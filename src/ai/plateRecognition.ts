import type { TensorflowModel } from "react-native-fast-tflite";
import type { Frame } from "react-native-vision-camera";
import { createResizePlugin } from "vision-camera-resize-plugin";

const labels: string[] = ["LicensePlate"];
const TAG = "[TFLiteService]";

const MIN_CONFIDENCE = 0.5;

type ResponseType = {
	confidence: number;
	label: string;
	index: number;
	x: number;
	y: number;
	xmax: number;
	ymax: number;
};

export interface TrackedPlate {
	id: string;
	text: string;
	timestamp: number;
	x: number;
	y: number;
	width: number;
	height: number;
}

const resize = createResizePlugin().resize;

export const plateRecognition = (
	frame: Frame,
	model: TensorflowModel,
): Array<TrackedPlate> | undefined => {
	"worklet";
	if (model == null) return;

	const inputs = model.inputs;
	const [_, shapeHeight, shapeWidth] = inputs[0].shape;
	const isFloatInput = inputs[0]["dtype"] == "float32";

	let resized = resize(frame, {
		scale: {
			width: shapeWidth,
			height: shapeHeight,
		},
		pixelFormat: "bgr",
		dataType: "float32",
	});

	const expand_dims = (arr: Float32Array): Float32Array => {
		// input_data = np.expand_dims(image_resized, axis=0) # Add batch dimension
		const batchSize = 1;
		const newArr = new Float32Array(batchSize * shapeHeight * shapeWidth * 3);
		newArr.set(arr, 0);
		return newArr;
	};

	resized = expand_dims(resized);

	if (isFloatInput) {
		console.log(TAG, "🐛🐛🐛🐛🐛🐛 Normalizing input data for float32 model.");
		const input_mean = 127.5;
		const input_std = 127.5;
		// input_data = (np.float32(input_data) - input_mean) / input_std
		resized = resized.map((val) => (val - input_mean) / input_std);
	}

	const runTFLiteModel = (
		float32: Float32Array,
		tflite: TensorflowModel,
	): Array<ResponseType> | null => {
		"worklet";
		if (!tflite) {
			throw new Error("TFLite model not loaded.");
		}

		const output = tflite.runSync([float32]);
		if (!output || output.length < 4) {
			throw new Error("Unexpected model output structure.");
		}

		const scores = Object.values(
			output[0] as unknown as { [key: string]: number },
		);
		const boxesRaw = Object.values(
			output[1] as unknown as { [key: string]: number },
		);
		const boxes: number[][] = [];
		for (let i = 0; i < boxesRaw.length; i += 4) {
			boxes.push([
				boxesRaw[i],
				boxesRaw[i + 1],
				boxesRaw[i + 2],
				boxesRaw[i + 3],
			]);
		}
		const classes = Object.values(
			output[3] as unknown as { [key: string]: number },
		);

		const detections: ResponseType[] = [];

		for (let i = 0; i < scores.length; i++) {
			if (scores[i] > MIN_CONFIDENCE && scores[i] <= 1.0) {
				const [ymin, xmin, ymax, xmax] = boxes[i];

				const boundingBox = {
					x: xmin,
					y: ymin,
					xmax: xmax,
					ymax: ymax,
				};

				detections.push({
					confidence: scores[i],
					label: labels[classes[i]],
					index: classes[i],
					...boundingBox,
				});
			}
		}

		return detections;
	};

	const results = runTFLiteModel(resized, model);
	if (!results) return;

	const newPlates = results.map((result, index) => {
		const { confidence, x, y, xmax, ymax } = result;
		const [imH, imW] = [frame.height, frame.width];

		const ymin = Math.max(y * imH, 1).toFixed(0);
		const xmin = Math.max(x * imW, 1).toFixed(0);
		const ymax_calc = Math.min(ymax * imH, imH).toFixed(0);
		const xmax_calc = Math.min(xmax * imW, imW).toFixed(0);

		const rectangle: Partial<TrackedPlate> = {
			x: Number(xmin),
			y: Number(ymin),
			width: Number(xmax_calc) - Number(xmin),
			height: Number(ymax_calc) - Number(ymin),
		};

		return {
			id: `${Date.now()}-${index}`,
			text: `Plate (${(confidence * 100).toFixed(0)}%)`,
			timestamp: Date.now(),
			...rectangle,
		} as TrackedPlate;
	});

	return newPlates;
};
