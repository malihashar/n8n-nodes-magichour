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
	/** Magic Hour endpoint slug — must stay in sync with catalog/operations.json. */
	slug: string;
	name: string;
	description: string;
	action: string;
	path: string;
	namespace: Namespace;
	mediaType: 'video' | 'image' | 'audio';
	/** API lists style as a required top-level object. */
	requiresStyle?: boolean;
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
	/** Extra top-level / style fields beyond the shared ones. */
	specials?: string[];
	extra?: (params: IDataObject) => IDataObject;
}

export const VIDEO_OPERATIONS: Operation[] = [
	{
		value: 'talkingPhoto',
		slug: 'ai-talking-photo',
		name: 'Talking Photo',
		action: 'Animate a portrait to speak',
		description: 'Animate a portrait to speak from an audio track',
		path: '/ai-talking-photo',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: false,
		media: [
		{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: true, description: 'Audio input' },
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
		duration: true,
		window: true,
	},
	{
		value: 'editVideo',
		slug: 'ai-video-editor',
		name: 'Edit Video',
		action: 'Edit a video with an instruction',
		description: 'Edit a video with a natural-language instruction',
		path: '/ai-video-editor',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: true,
		media: [
		{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: true, description: 'Video input' },
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
		duration: true,
		window: true,
		models: ["gemini-omni-1.1", "gemini-omni", "ltx-2.3"],
		resolutions: ["480p", "720p", "1080p"],
	},
	{
		value: 'animation',
		slug: 'animation',
		name: 'Animation',
		action: 'Animate an image',
		description: 'Animate a still image into motion',
		path: '/animation',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: true,
		media: [
		{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: false, description: 'Audio input' },
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: false, description: 'Image input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
		duration: true,
		specials: ["artStyle"],
		extra: () => ({ assets: { audio_source: 'file' }, fps: 12, height: 512, width: 512 }),
	},
	{
		value: 'audioToVideo',
		slug: 'audio-to-video',
		name: 'Audio to Video',
		action: 'Generate video from audio',
		description: 'Generate video driven by an audio track',
		path: '/audio-to-video',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: false,
		media: [
		{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: true, description: 'Audio input' },
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: false, description: 'Image input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
		duration: true,
		window: true,
		resolutions: ["480p", "720p", "1080p"],
	},
	{
		value: 'autoSubtitles',
		slug: 'auto-subtitle-generator',
		name: 'Auto Subtitles',
		action: 'Generate video subtitles',
		description: 'Transcribe a video and burn in subtitles',
		path: '/auto-subtitle-generator',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: true,
		media: [
		{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: true, description: 'Video input' },
		],
		duration: true,
		window: true,
	},
	{
		value: 'characterReplace',
		slug: 'character-replace',
		name: 'Character Replace',
		action: 'Replace a person in a video',
		description: 'Replace a person in a video using a reference image',
		path: '/character-replace',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: true, description: 'Video input' },
		],
		duration: true,
		window: true,
		resolutions: ["480p", "720p"],
	},
	{
		value: 'videoFaceSwap',
		slug: 'face-swap',
		name: 'Video Face Swap',
		action: 'Swap a face into a video',
		description: 'Swap a face into a video, frame by frame',
		path: '/face-swap',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: false, description: 'Image input' },
		{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: false, description: 'Video input' },
		],
		duration: true,
		window: true,
		extra: () => ({ assets: { video_source: 'file' } }),
	},
	{
		value: 'imageToVideo',
		slug: 'image-to-video',
		name: 'Image to Video',
		action: 'Generate a video from an image',
		description: 'Animate a still image into a video',
		path: '/image-to-video',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
		duration: true,
		models: ["default", "ltx-2", "ltx-2.3", "ltx-2.5", "minimax-h3", "wan-2.2", "seedance-1.5", "seedance-2.0", "seedance-2.0-mini", "seedance-2.5", "kling-2.5", "kling-2.6", "kling-3.0", "gemini-omni-1.1", "veo3.1", "veo3.1-lite", "sora-2", "kling-1.6", "seedance", "kling-2.5-audio"],
		resolutions: ["360p", "480p", "720p", "1080p", "4k"],
	},
	{
		value: 'lipSync',
		slug: 'lip-sync',
		name: 'Lip Sync',
		action: 'Sync a video to new audio',
		description: 'Sync a video lip movement to a new audio track',
		path: '/lip-sync',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: false,
		media: [
		{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: true, description: 'Audio input' },
		{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: false, description: 'Video input' },
		],
		duration: true,
		window: true,
		extra: () => ({ assets: { video_source: 'file' } }),
	},
	{
		value: 'textToVideo',
		slug: 'text-to-video',
		name: 'Text to Video',
		action: 'Generate a video from a prompt',
		description: 'Generate video from a text prompt',
		path: '/text-to-video',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: true,
		media: [
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
		duration: true,
		models: ["default", "ltx-2", "ltx-2.3", "ltx-2.5", "minimax-h3", "wan-2.2", "seedance-1.5", "seedance-2.0", "seedance-2.0-mini", "seedance-2.5", "kling-2.5", "kling-2.6", "kling-3.0", "gemini-omni-1.1", "veo3.1", "veo3.1-lite", "sora-2", "kling-1.6", "seedance", "kling-2.5-audio"],
		resolutions: ["360p", "480p", "720p", "1080p", "4k"],
		aspectRatios: ["16:9", "9:16", "1:1"],
	},
	{
		value: 'videoToVideo',
		slug: 'video-to-video',
		name: 'Video to Video',
		action: 'Restyle a video',
		description: 'Restyle an existing video with a new look',
		path: '/video-to-video',
		namespace: 'video-projects',
		mediaType: 'video',
		requiresStyle: true,
		media: [
		{ name: 'video', displayName: 'Video', kind: 'video', assetKey: 'video_file_path', required: false, description: 'Video input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
		duration: true,
		window: true,
		specials: ["artStyle"],
		extra: () => ({ assets: { video_source: 'file' } }),
	},
];

export const IMAGE_OPERATIONS: Operation[] = [
	{
		value: 'clothesChanger',
		slug: 'ai-clothes-changer',
		name: 'Clothes Changer',
		action: 'Change clothes in a photo',
		description: 'Change what someone is wearing using a garment image',
		path: '/ai-clothes-changer',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'garment', displayName: 'Garment', kind: 'image', assetKey: 'garment_file_path', required: true, description: 'Garment input' },
		{ name: 'person', displayName: 'Person', kind: 'image', assetKey: 'person_file_path', required: true, description: 'Person input' },
		],
	},
	{
		value: 'faceEditor',
		slug: 'ai-face-editor',
		name: 'Face Editor',
		action: 'Edit facial features',
		description: 'Adjust facial features precisely',
		path: '/ai-face-editor',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: true,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
	},
	{
		value: 'gifGenerator',
		slug: 'ai-gif-generator',
		name: 'GIF Generator',
		action: 'Generate a GIF',
		description: 'Create an animated GIF from a prompt',
		path: '/ai-gif-generator',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: true,
		media: [
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
	},
	{
		value: 'headshot',
		slug: 'ai-headshot-generator',
		name: 'Headshot',
		action: 'Generate a headshot',
		description: 'Produce a professional headshot from a photo',
		path: '/ai-headshot-generator',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
	},
	{
		value: 'editImage',
		slug: 'ai-image-editor',
		name: 'Edit Image',
		action: 'Edit an image with an instruction',
		description: 'Edit an image with a plain-language instruction',
		path: '/ai-image-editor',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: true,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_paths', required: true, description: 'Image input' },
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
		models: ["default", "nano-banana-2", "gpt-image-2", "flux-2-klein", "nano-banana-2-lite", "qwen-edit", "seedream-v4", "seedream-v4.5", "seedream-v5-pro", "nano-banana", "nano-banana-pro"],
		resolutions: ["auto", "640px", "1k", "2k", "4k"],
		aspectRatios: ["auto", "16:9", "9:16", "4:3", "3:2", "1:1", "4:5", "2:3"],
		extra: () => ({ image_count: 1 }),
	},
	{
		value: 'generateImage',
		slug: 'ai-image-generator',
		name: 'Generate Image',
		action: 'Generate an image from a prompt',
		description: 'Create an image from a text description',
		path: '/ai-image-generator',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: true,
		media: [
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
		models: ["default", "nano-banana-2", "gpt-image-2", "z-image-turbo", "flux-2-klein", "nano-banana-2-lite", "seedream-v4", "seedream-v5-pro", "nano-banana", "nano-banana-pro", "flux-schnell", "seedream"],
		resolutions: ["auto", "640px", "1k", "2k", "4k"],
		aspectRatios: ["1:1", "16:9", "9:16"],
		extra: () => ({ image_count: 1 }),
	},
	{
		value: 'upscaleImage',
		slug: 'ai-image-upscaler',
		name: 'Upscale Image',
		action: 'Upscale an image',
		description: 'Increase image resolution while keeping detail',
		path: '/ai-image-upscaler',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
		prompt: { required: false, placeholder: 'Describe what you want' },
		specials: ["scaleFactor"],
	},
	{
		value: 'memeGenerator',
		slug: 'ai-meme-generator',
		name: 'Meme Generator',
		action: 'Generate a meme',
		description: 'Generate a meme from a topic and template',
		path: '/ai-meme-generator',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: true,
		media: [
		],
		specials: ["memeTopic", "memeTemplate"],
	},
	{
		value: 'qrCodeGenerator',
		slug: 'ai-qr-code-generator',
		name: 'QR Code Generator',
		action: 'Generate an AI QR code',
		description: 'Generate an artistic QR code that still scans',
		path: '/ai-qr-code-generator',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: true,
		media: [
		],
		specials: ["qrContent", "artStyle"],
	},
	{
		value: 'bodySwap',
		slug: 'body-swap',
		name: 'Body Swap',
		action: 'Swap a person into a scene',
		description: 'Place a person into a new scene',
		path: '/body-swap',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'person', displayName: 'Person', kind: 'image', assetKey: 'person_file_path', required: true, description: 'Person input' },
		{ name: 'scene', displayName: 'Scene', kind: 'image', assetKey: 'scene_file_path', required: true, description: 'Scene input' },
		],
		resolutions: ["640px", "1k", "2k", "4k"],
	},
	{
		value: 'imageFaceSwap',
		slug: 'face-swap-photo',
		name: 'Image Face Swap',
		action: 'Swap a face between two photos',
		description: 'Swap a face between two photos',
		path: '/face-swap-photo',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Source Face', kind: 'image', assetKey: 'source_file_path', required: false, description: 'Source Face input' },
		{ name: 'imageTarget', displayName: 'Target Photo', kind: 'image', assetKey: 'target_file_path', required: true, description: 'Target Photo input' },
		],
	},
	{
		value: 'headSwap',
		slug: 'head-swap',
		name: 'Head Swap',
		action: 'Swap a head onto a body',
		description: 'Replace a head while keeping the body and scene',
		path: '/head-swap',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'body', displayName: 'Body', kind: 'image', assetKey: 'body_file_path', required: true, description: 'Body input' },
		{ name: 'head', displayName: 'Head', kind: 'image', assetKey: 'head_file_path', required: true, description: 'Head input' },
		],
	},
	{
		value: 'removeBackground',
		slug: 'image-background-remover',
		name: 'Remove Background',
		action: 'Remove an image background',
		description: 'Remove or replace an image background',
		path: '/image-background-remover',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
	},
	{
		value: 'photoColorizer',
		slug: 'photo-colorizer',
		name: 'Photo Colorizer',
		action: 'Colorize a photo',
		description: 'Add colour to a black and white photograph',
		path: '/photo-colorizer',
		namespace: 'image-projects',
		mediaType: 'image',
		requiresStyle: false,
		media: [
		{ name: 'image', displayName: 'Image', kind: 'image', assetKey: 'image_file_path', required: true, description: 'Image input' },
		],
	},
];

export const AUDIO_OPERATIONS: Operation[] = [
	{
		value: 'voiceCloner',
		slug: 'ai-voice-cloner',
		name: 'Voice Cloner',
		action: 'Clone a voice and speak',
		description: 'Clone a voice from a sample and generate speech',
		path: '/ai-voice-cloner',
		namespace: 'audio-projects',
		mediaType: 'audio',
		requiresStyle: true,
		media: [
		{ name: 'audio', displayName: 'Audio', kind: 'audio', assetKey: 'audio_file_path', required: true, description: 'Audio input' },
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
	},
	{
		value: 'voiceGenerator',
		slug: 'ai-voice-generator',
		name: 'Voice Generator',
		action: 'Generate speech from text',
		description: 'Generate speech from text in a chosen voice',
		path: '/ai-voice-generator',
		namespace: 'audio-projects',
		mediaType: 'audio',
		requiresStyle: true,
		media: [
		],
		prompt: { required: true, placeholder: 'Describe what you want' },
		specials: ["voiceName"],
	},
];

export const ALL_OPERATIONS = [...VIDEO_OPERATIONS, ...IMAGE_OPERATIONS, ...AUDIO_OPERATIONS];

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

		if (op.specials?.includes('scaleFactor')) {
			props.push({
				displayName: 'Scale Factor',
				name: 'scaleFactor',
				type: 'number',
				default: 2,
				required: true,
				description: 'How much to upscale (e.g. 2 = 2x)',
				typeOptions: { minValue: 2, maxValue: 4 },
				displayOptions: { show },
			});
		}
		if (op.specials?.includes('qrContent')) {
			props.push({
				displayName: 'QR Content',
				name: 'qrContent',
				type: 'string',
				default: '',
				required: true,
				description: 'URL or text the QR code should encode',
				displayOptions: { show },
			});
		}
		if (op.specials?.includes('voiceName')) {
			props.push({
				displayName: 'Voice',
				name: 'voiceName',
				type: 'string',
				default: 'Elon Musk',
				required: true,
				description: 'Voice name recognised by Magic Hour (e.g. Elon Musk, Morgan Freeman)',
				displayOptions: { show },
			});
		}
		if (op.specials?.includes('memeTopic')) {
			props.push({
				displayName: 'Topic',
				name: 'memeTopic',
				type: 'string',
				default: '',
				required: true,
				description: 'What the meme is about',
				displayOptions: { show },
			});
		}
		if (op.specials?.includes('memeTemplate')) {
			props.push({
				displayName: 'Template',
				name: 'memeTemplate',
				type: 'string',
				default: 'Random',
				description: 'Meme template name, or Random',
				displayOptions: { show },
			});
		}
		if (op.specials?.includes('artStyle')) {
			props.push({
				displayName: 'Art Style',
				name: 'artStyle',
				type: 'string',
				default: 'Studio Ghibli',
				description: 'Art style recognised by this endpoint. Animation defaults to Directed by AI if left blank.',
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
			const resolutionDefault = op.resolutions.includes('720p')
				? '720p'
				: op.resolutions.includes('1k')
					? '1k'
					: op.resolutions[0];
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
