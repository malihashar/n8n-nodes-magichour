import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, sleep } from 'n8n-workflow';

export const BASE_URL = 'https://api.magichour.ai/v1';

// Lets Magic Hour attribute usage to this integration. Coordinated with
// backend rather than invented: if the API stops recognising it, the header is
// simply ignored.
export const SOURCE_HEADERS = {
	'X-MagicHour-Source': 'n8n',
	'User-Agent': 'magic-hour-n8n/1.0',
};

const TERMINAL_OK = ['complete', 'completed'];
const TERMINAL_BAD = ['error', 'errored', 'failed', 'canceled', 'cancelled'];

export interface JobResult {
	projectId: string;
	status: string;
	creditsCharged?: number;
	downloads: string[];
	raw: IDataObject;
}

/** One place that talks to Magic Hour, so auth and attribution cannot drift. */
export async function magicHourRequest(
	this: IExecuteFunctions,
	method: 'GET' | 'POST' | 'DELETE',
	path: string,
	body?: IDataObject,
): Promise<IDataObject> {
	try {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'magicHourApi', {
			method,
			url: `${BASE_URL}${path}`,
			headers: { ...SOURCE_HEADERS },
			body,
			json: true,
		})) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as never, {
			message: describeError(error),
		});
	}
}

/** Turn Magic Hour's errors into something a workflow author can act on. */
function describeError(error: unknown): string {
	const err = error as { httpCode?: string; statusCode?: number; message?: string };
	const code = Number(err.httpCode ?? err.statusCode);
	if (code === 401 || code === 403) {
		return 'Magic Hour rejected the API key. Check the credential, or create a new key at https://magichour.ai/developer?tab=api-keys.';
	}
	if (code === 402) {
		return 'Not enough Magic Hour credits for this generation. Top up at https://magichour.ai/pricing.';
	}
	if (code === 429) {
		return 'Magic Hour rate limit reached. Reduce the batch size or add a Wait node between items.';
	}
	if (code === 400 || code === 422) {
		return `Magic Hour rejected the request: ${err.message ?? 'check the inputs for this operation'}`;
	}
	return err.message ?? 'Magic Hour request failed';
}

/**
 * Upload binary data from the previous node.
 *
 * This is what lets Google Drive connect straight to Magic Hour: the user
 * never has to host a file publicly. Magic Hour issues a presigned URL, the
 * bytes go straight to it, and the returned file path is what generation
 * takes.
 */
export async function uploadBinary(
	this: IExecuteFunctions,
	itemIndex: number,
	binaryProperty: string,
	kind: 'image' | 'video' | 'audio',
): Promise<string> {
	const binary = this.helpers.assertBinaryData(itemIndex, binaryProperty);
	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);
	const extension = (binary.fileExtension ?? defaultExtension(kind)).replace(/^\./, '');

	const response = await magicHourRequest.call(this, 'POST', '/files/upload-urls', {
		items: [{ type: kind, extension }],
	});

	const items = (response.items ?? []) as Array<{ upload_url?: string; file_path?: string }>;
	const target = items[0];
	if (!target?.upload_url || !target.file_path) {
		throw new NodeOperationError(
			this.getNode(),
			'Magic Hour did not return an upload URL. Try again, or check that the file type is supported.',
			{ itemIndex },
		);
	}

	await this.helpers.httpRequest({
		method: 'PUT',
		url: target.upload_url,
		body: buffer,
		headers: { 'Content-Type': binary.mimeType || mimeFor(kind) },
	});

	return target.file_path;
}

function defaultExtension(kind: 'image' | 'video' | 'audio'): string {
	return kind === 'image' ? 'png' : kind === 'video' ? 'mp4' : 'mp3';
}

function mimeFor(kind: 'image' | 'video' | 'audio'): string {
	return kind === 'image' ? 'image/png' : kind === 'video' ? 'video/mp4' : 'audio/mpeg';
}

/**
 * Poll until the job finishes.
 *
 * Backs off gradually so a ten-minute video does not mean hundreds of
 * requests, and reports the elapsed time on timeout so the user knows whether
 * to raise the limit or whether something is actually stuck.
 */
export async function waitForCompletion(
	this: IExecuteFunctions,
	projectId: string,
	namespace: 'video-projects' | 'image-projects' | 'audio-projects',
	timeoutSeconds: number,
	itemIndex: number,
): Promise<JobResult> {
	const deadline = Date.now() + timeoutSeconds * 1000;
	let interval = 5000;

	for (;;) {
		const body = await magicHourRequest.call(this, 'GET', `/${namespace}/${projectId}`);
		const status = String(body.status ?? '').toLowerCase();

		if (TERMINAL_OK.includes(status) || TERMINAL_BAD.includes(status)) {
			const downloads = ((body.downloads ?? []) as Array<{ url?: string }>)
				.map((d) => d.url)
				.filter((url): url is string => Boolean(url));
			return {
				projectId,
				status,
				creditsCharged: body.credits_charged as number | undefined,
				downloads,
				raw: body,
			};
		}

		if (Date.now() > deadline) {
			throw new NodeOperationError(
				this.getNode(),
				`Magic Hour did not finish within ${timeoutSeconds}s (last status: ${status || 'unknown'}). The job is still running — project ID ${projectId} — so raise the timeout or set "Wait for Completion" to false and poll separately.`,
				{ itemIndex },
			);
		}

		await sleep(interval);
		interval = Math.min(Math.round(interval * 1.3), 30000);
	}
}
