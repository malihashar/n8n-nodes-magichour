import type { IDataObject, INodeProperties } from 'n8n-workflow';

export type Namespace = 'video-projects' | 'image-projects' | 'audio-projects';
export type MediaKind = 'image' | 'video' | 'audio';

export interface MediaInput {
	/** The node parameter the user fills in. */
	name: string;
	displayName: string;
	kind: MediaKind;
	/** Where the resulting file path goes in the request body. */
	assetKey: string;
	required: boolean;
	description: string;
}

export interface Operation {
	value: string;
	name: string;
	description: string;
	action: string;
	path: string;
	namespace: Namespace;
	media: MediaInput[];
	/** Prompt is meaningful for this operation. */
	prompt?: { required: boolean; placeholder: string };
	/** Operation produces timed media and takes a length. */
	duration?: boolean;
	/** The endpoint takes a start/end window rather than only a length. */
	window?: boolean;
	resolutions?: string[];
	aspectRatios?: string[];
	models?: string[];
	extra?: (params: IDataObject) => IDataObject;
}

const VIDEO_MODELS = [
	'default', 'ltx-2.3', 'ltx-2.5', 'minimax-h3', 'wan-2.2', 'kling-2.6',
	'kling-3.0', 'seedance-1.5', 'seedance-2.0', 'seedance-2.5', 'veo3.1', 'sora-2',
];
const IMAGE_MODELS = [
	'default', 'qwen-edit', 'flux-schnell', 'flux-2-klein', 'seedream-v4',
	'nano-banana', 'nano-banana-2', 'nano-banana-pro', 'gpt-image-2',
];
const VIDEO_RES = ['480p', '720p', '1080p'];
const IMAGE_RES = ['auto', '640px', '1k', '2k', '4k'];
const RATIOS = ['16:9', '9:16', '1:1'];

export const VIDEO_OPERATIONS: Operation[] = [
	{
		value: 'imageToVideo',
		name: 'Image to Video',
		action: 'Generate a video from an image',
		description: 'Animate a still image into a video',
		path: '/image-to-video',
		namespace: 'video-projects',
		media: [{
			name: 'image', displayName: 'Image', kind: 'image',
			assetKey: 'image_file_path', required: true,
			description: 'The image to animate',
		}],
		prompt: { required: false, placeholder: 'Camera slowly pushing in, leaves moving in the wind' },
		duration: true,
		resolutions: VIDEO_RES,
		models: VIDEO_MODELS,
	},
	{
		value: 'textToVideo',
		name: 'Text to Video',
		action: 'Generate a video from a prompt',
		description: 'Generate a video from a text description',
		path: '/text-to-video',
		namespace: 'video-projects',
		media: [],
		prompt: { required: true, placeholder: 'A paper boat drifting down a rain gutter, cinematic' },
		duration: true,
		resolutions: VIDEO_RES,
		aspectRatios: RATIOS,
		models: VIDEO_MODELS,
	},
	{
		value: 'videoFaceSwap',
		name: 'Video Face Swap',
		action: 'Swap a face into a video',
		description: 'Replace a face in a video, frame by frame',
		path: '/face-swap',
		namespace: 'video-projects',
		media: [
			{ name: 'image', displayName: 'Face Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'The face to apply' },
			{ name: 'video', displayName: 'Target Video', kind: 'video', assetKey: 'video_file_path', required: true, description: 'The video to change' },
		],
		duration: true,
		window: true,
		extra: () => ({ assets: { video_source: 'file' } }),
	},
	{
		value: 'talkingPhoto',
		name: 'Talking Photo',
		action: 'Animate a portrait to speak',
		description: 'Make a portrait speak from an audio track',
		path: '/ai-talking-photo',
		namespace: 'video-projects',
		media: [
			{ name: 'image', displayName: 'Portrait', kind: 'image', assetKey: 'image_file_path', required: true, description: 'The face that will speak' },
			{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: true, description: 'The speech to lip-sync to' },
		],
		duration: true,
		window: true,
	},
	{
		value: 'lipSync',
		name: 'Lip Sync',
		action: 'Sync a video to new audio',
		description: 'Re-sync lip movement in a video to a new audio track',
		path: '/lip-sync',
		namespace: 'video-projects',
		media: [
			{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: true, description: 'The video to re-sync' },
			{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: true, description: 'The new audio track' },
		],
		duration: true,
		window: true,
		extra: () => ({ assets: { video_source: 'file' } }),
	},
	{
		value: 'characterReplace',
		name: 'Character Replace',
		action: 'Replace a person in a video',
		description: 'Replace a person in a video using a reference image',
		path: '/character-replace',
		namespace: 'video-projects',
		media: [
			{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: true, description: 'The video to change' },
			{ name: 'image', displayName: 'Character Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'The character to put in' },
		],
		duration: true,
		window: true,
		resolutions: ['480p', '720p'],
	},
];

export const IMAGE_OPERATIONS: Operation[] = [
	{
		value: 'generateImage',
		name: 'Generate Image',
		action: 'Generate an image from a prompt',
		description: 'Create an image from a text description',
		path: '/ai-image-generator',
		namespace: 'image-projects',
		media: [],
		prompt: { required: true, placeholder: 'A paper boat on a rain gutter, cinematic lighting' },
		resolutions: IMAGE_RES,
		aspectRatios: RATIOS,
		models: IMAGE_MODELS,
		extra: () => ({ image_count: 1 }),
	},
	{
		value: 'editImage',
		name: 'Edit Image',
		action: 'Edit an image with an instruction',
		description: 'Change an image using a plain-language instruction',
		path: '/ai-image-editor',
		namespace: 'image-projects',
		media: [{
			name: 'image', displayName: 'Image', kind: 'image',
			// This endpoint takes an array, unlike every video endpoint.
			assetKey: 'image_file_paths', required: true,
			description: 'The image to edit',
		}],
		prompt: { required: true, placeholder: 'Change the background to a snowy forest' },
		resolutions: IMAGE_RES,
		models: IMAGE_MODELS,
		extra: () => ({ image_count: 1 }),
	},
	{
		value: 'imageFaceSwap',
		name: 'Image Face Swap',
		action: 'Swap a face between two photos',
		description: 'Put a face from one photo onto another',
		path: '/face-swap-photo',
		namespace: 'image-projects',
		media: [
			{ name: 'image', displayName: 'Source Face', kind: 'image', assetKey: 'source_file_path', required: true, description: 'The face to take' },
			{ name: 'imageTarget', displayName: 'Target Photo', kind: 'image', assetKey: 'target_file_path', required: true, description: 'The photo to change' },
		],
	},
];

export const ALL_OPERATIONS = [...VIDEO_OPERATIONS, ...IMAGE_OPERATIONS];

export function findOperation(value: string): Operation | undefined {
	return ALL_OPERATIONS.find((op) => op.value === value);
}

/** Build the per-operation properties, shown only for the operation they belong to. */
export function operationProperties(resource: string, operations: Operation[]): INodeProperties[] {
	const props: INodeProperties[] = [];

	for (const op of operations) {
		const show = { resource: [resource], operation: [op.value] };

		for (const media of op.media) {
			props.push({
				displayName: `${media.displayName} Source`,
				name: `${media.name}Source`,
				type: 'options',
				default: 'binary',
				description: `Where to take the ${media.displayName.toLowerCase()} from`,
				options: [
					{ name: 'From Previous Node', value: 'binary', description: 'Use a file passed in from the node before this one' },
					{ name: 'By URL', value: 'url', description: 'Use a publicly reachable URL' },
				],
				displayOptions: { show },
			});
			props.push({
				displayName: `${media.displayName} Field Name`,
				name: `${media.name}BinaryProperty`,
				type: 'string',
				default: 'data',
				required: media.required,
				description: `Name of the binary field holding the ${media.displayName.toLowerCase()}`,
				displayOptions: { show: { ...show, [`${media.name}Source`]: ['binary'] } },
			});
			props.push({
				displayName: `${media.displayName} URL`,
				name: `${media.name}Url`,
				type: 'string',
				default: '',
				required: media.required,
				description: media.description,
				displayOptions: { show: { ...show, [`${media.name}Source`]: ['url'] } },
			});
		}

		if (op.prompt) {
			props.push({
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				required: op.prompt.required,
				placeholder: op.prompt.placeholder,
				description: 'What you want generated, in plain language',
				displayOptions: { show },
			});
		}

		if (op.duration) {
			props.push({
				displayName: 'Duration (Seconds)',
				name: 'durationSeconds',
				type: 'number',
				default: 5,
				description: 'How long the generated video should be',
				typeOptions: { minValue: 1, maxValue: 60 },
				displayOptions: { show },
			});
		}

		const options: INodeProperties[] = [];
		if (op.models) {
			options.push({
				displayName: 'Model',
				name: 'model',
				type: 'options',
				default: 'default',
				description: 'Which model to use. Leave as default unless you need a specific one.',
				options: op.models.map((m) => ({ name: m, value: m })),
			});
		}
		if (op.resolutions) {
			const resolutionDefault = op.resolutions.includes('720p') ? '720p' : op.resolutions[0];
			options.push({
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				default: resolutionDefault,
				description: 'Output resolution',
				options: op.resolutions.map((r) => ({ name: r, value: r })),
			});
		}
		if (op.aspectRatios) {
			options.push({
				displayName: 'Aspect Ratio',
				name: 'aspectRatio',
				type: 'options',
				default: '16:9',
				description: 'Shape of the output',
				options: op.aspectRatios.map((r) => ({ name: r, value: r })),
			});
		}
		if (options.length) {
			props.push({
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show },
				options: options as INodeProperties[],
			});
		}
	}

	return props;
}
