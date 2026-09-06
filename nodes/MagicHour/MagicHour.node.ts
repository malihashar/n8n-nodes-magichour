import type {
	IDataObject,
	JsonObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	IMAGE_OPERATIONS,
	VIDEO_OPERATIONS,
	findOperation,
	operationProperties,
	type Operation,
} from './operations';
import { magicHourRequest, uploadBinary, waitForCompletion } from './transport';

export class MagicHour implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Magic Hour',
		name: 'magicHour',
		icon: { light: 'file:magichour.svg', dark: 'file:magichour.dark.svg' },
		group: ['transform'],
		version: [1],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Generate and edit video and images with Magic Hour',
		defaults: { name: 'Magic Hour' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		// Lets an AI Agent call these operations and fill the parameters itself.
		usableAsTool: true,
		credentials: [{ name: 'magicHourApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'video',
				options: [
					{ name: 'Video', value: 'video' },
					{ name: 'Image', value: 'image' },
					{ name: 'Project', value: 'project' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'imageToVideo',
				displayOptions: { show: { resource: ['video'] } },
				options: VIDEO_OPERATIONS.map((op) => ({
					name: op.name, value: op.value, action: op.action, description: op.description,
				})),
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'generateImage',
				displayOptions: { show: { resource: ['image'] } },
				options: IMAGE_OPERATIONS.map((op) => ({
					name: op.name, value: op.value, action: op.action, description: op.description,
				})),
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'get',
				displayOptions: { show: { resource: ['project'] } },
				options: [{
					name: 'Get Status', value: 'get',
					action: 'Get a project status',
					description: 'Look up a generation by its project ID',
				}],
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				description: 'The project ID returned when the generation was created',
				displayOptions: { show: { resource: ['project'] } },
			},
			{
				displayName: 'Project Type',
				name: 'projectType',
				type: 'options',
				default: 'video-projects',
				description: 'Which kind of project to look up',
				options: [
					{ name: 'Video', value: 'video-projects' },
					{ name: 'Image', value: 'image-projects' },
					{ name: 'Audio', value: 'audio-projects' },
				],
				displayOptions: { show: { resource: ['project'] } },
			},

			...operationProperties('video', VIDEO_OPERATIONS),
			...operationProperties('image', IMAGE_OPERATIONS),

			{
				displayName: 'Wait for Completion',
				name: 'waitForCompletion',
				type: 'boolean',
				default: true,
				description:
					'Whether to wait for the generation to finish and return the media URL. Turn off to get the project ID immediately and poll separately.',
				displayOptions: { show: { resource: ['video', 'image'] } },
			},
			{
				displayName: 'Timeout (Seconds)',
				name: 'timeoutSeconds',
				type: 'number',
				default: 900,
				description:
					'How long to wait before giving up. Long video can take several minutes; the job keeps running on Magic Hour either way.',
				typeOptions: { minValue: 30, maxValue: 3600 },
				displayOptions: { show: { resource: ['video', 'image'], waitForCompletion: [true] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const results: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'project') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const namespace = this.getNodeParameter('projectType', i) as
						'video-projects' | 'image-projects' | 'audio-projects';
					const body = await magicHourRequest.call(this, 'GET', `/${namespace}/${projectId}`);
					results.push({ json: body as IDataObject, pairedItem: { item: i } });
					continue;
				}

				const op = findOperation(operation);
				if (!op) {
					throw new NodeOperationError(
						this.getNode(), `Unknown operation "${operation}"`, { itemIndex: i },
					);
				}

				const payload = await buildPayload.call(this, op, i);
				const created = await magicHourRequest.call(this, 'POST', op.path, payload);
				const projectId = String(created.id ?? '');
				if (!projectId) {
					throw new NodeOperationError(
						this.getNode(),
						'Magic Hour did not return a project ID for this generation',
						{ itemIndex: i },
					);
				}

				const wait = this.getNodeParameter('waitForCompletion', i, true) as boolean;
				if (!wait) {
					results.push({
						json: {
							projectId,
							status: created.status ?? 'queued',
							creditsCharged: created.credits_charged ?? null,
							operation: op.value,
						},
						pairedItem: { item: i },
					});
					continue;
				}

				const timeout = this.getNodeParameter('timeoutSeconds', i, 900) as number;
				const result = await waitForCompletion.call(
					this, projectId, op.namespace, timeout, i,
				);

				if (result.status !== 'complete' && result.status !== 'completed') {
					throw new NodeOperationError(
						this.getNode(),
						`Magic Hour could not complete this generation (status: ${result.status}). Project ID ${projectId}.`,
						{ itemIndex: i },
					);
				}

				results.push({
					json: {
						projectId,
						status: result.status,
						operation: op.value,
						creditsCharged: result.creditsCharged ?? null,
						downloadUrl: result.downloads[0] ?? null,
						downloadUrls: result.downloads,
					},
					pairedItem: { item: i },
				});
			} catch (error) {
				// Honour the workflow's own error setting rather than always
				// stopping: a 200-item batch should not die on one bad row.
				if (this.continueOnFail()) {
					results.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [results];
	}
}

/** Assemble the create-request body, uploading any binary inputs first. */
async function buildPayload(
	this: IExecuteFunctions,
	op: Operation,
	itemIndex: number,
): Promise<IDataObject> {
	const payload: IDataObject = { name: `${op.name} via n8n` };
	const assets: IDataObject = {};

	for (const media of op.media) {
		const source = this.getNodeParameter(`${media.name}Source`, itemIndex, 'binary') as string;
		let filePath: string;

		if (source === 'binary') {
			const property = this.getNodeParameter(
				`${media.name}BinaryProperty`, itemIndex, 'data',
			) as string;
			filePath = await uploadBinary.call(this, itemIndex, property, media.kind);
		} else {
			filePath = this.getNodeParameter(`${media.name}Url`, itemIndex, '') as string;
			if (!filePath && media.required) {
				throw new NodeOperationError(
					this.getNode(),
					`${media.displayName} is required for ${op.name}`,
					{ itemIndex },
				);
			}
		}

		if (filePath) {
			assets[media.assetKey] = media.assetKey.endsWith('_paths') ? [filePath] : filePath;
		}
	}

	const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

	if (op.prompt) {
		const prompt = this.getNodeParameter('prompt', itemIndex, '') as string;
		if (!prompt && op.prompt.required) {
			throw new NodeOperationError(
				this.getNode(), `A prompt is required for ${op.name}`, { itemIndex },
			);
		}
		if (prompt) payload.style = { prompt };
	}

	if (op.duration) {
		const seconds = this.getNodeParameter('durationSeconds', itemIndex, 5) as number;
		payload.end_seconds = seconds;
		if (op.window) payload.start_seconds = 0;
	}

	if (options.model && options.model !== 'default') payload.model = options.model;
	if (options.resolution) payload.resolution = options.resolution;
	if (options.aspectRatio) payload.aspect_ratio = options.aspectRatio;

	const extra = op.extra?.(options) ?? {};
	const extraAssets = (extra.assets ?? {}) as IDataObject;
	delete extra.assets;
	Object.assign(payload, extra);

	const merged = { ...extraAssets, ...assets };
	if (Object.keys(merged).length) payload.assets = merged;

	return payload;
}
