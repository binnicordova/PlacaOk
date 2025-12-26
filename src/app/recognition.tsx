import { Icon } from "@components/Icon";
import { useIsFocused } from "@react-navigation/native";
import { getVisitedServicesFromCloud } from "@services/firestore";
import { currentVehiclePlateAtom } from "@state/selectors";
import { plateRecognition, type TrackedPlate } from "ai/plateRecognition";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import type { PlateStatus } from "models/plateStatus";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import {
	Camera,
	runAtTargetFps,
	useCameraDevice,
	useCameraFormat,
	useCameraPermission,
	useFrameProcessor,
} from "react-native-vision-camera";
import {
	type ScanTextConfig,
	useTextRecognition,
} from "react-native-vision-camera-ocr-plus";
import { useRunOnJS } from "react-native-worklets-core";
import { platesAtom } from "store/plates";

const TAG = "[Recognition]";

const FPS_CAMERA = 30;
const FPS_RUN_PROCESSOR = 1;

type PlateRectangleProps = {
	plate: TrackedPlate & {
		labels?: string[];
	};
};

const getPlateStatus = async (label: string) => {
	"worklet";
	if (!label) return;
	const services = await getVisitedServicesFromCloud(label);
	if (!services) return "new";
	if (Object.values(services).some((status) => status === "observed"))
		return "observed";
	return "ok";
};

type Labels = Record<string, PlateStatus | string>;

const PlateRectangle: React.FC<PlateRectangleProps> = ({ plate }) => {
	console.log("Rendering plate:", plate.labels);
	const [statuses, setStatuses] = useState<Labels | undefined>(undefined);

	const router = useRouter();
	const setVehiclePlate = useSetAtom(currentVehiclePlateAtom);

	const getStatus = useCallback(async () => {
		if (plate.labels && plate.labels.length > 0) {
			const statusRecord: Labels = {};
			for (const label of plate.labels) {
				const status = await getPlateStatus(label.replace("-", ""));
				if (status) {
					statusRecord[label] = status;
				}
			}
			setStatuses(statusRecord);
		}
	}, [plate.labels]);

	useEffect(() => {
		getStatus();
	}, [getStatus]);

	const backgroundColor = (status: string) => {
		if (status === "ok") {
			return "rgba(0, 255, 0, 1)"; // Green for OK
		} else if (status === "observed") {
			return "rgba(255, 0, 0, 1)"; // Orange for OBSERVED
		} else {
			return "rgba(255, 255, 0, 1)"; // Red for NEW
		}
	};

	const onPressPlate = (label: string) => {
		console.log(`${TAG} Plate pressed:`, label);
		if (!label || label.trim().length === 0) {
			return;
		}
		setVehiclePlate(label.replace("-", "").trim().toUpperCase());
		router.push("/");
	};

	return (
		<View
			key={plate.id}
			style={[
				styles.trackedObject,
				{
					left: plate.x,
					top: plate.y,
					width: plate.width,
					height: plate.height,
					backgroundColor: "rgba(0, 157, 255, .5)",
				},
			]}
		>
			{plate.labels?.map((label) => (
				<TouchableHighlight key={label} onPress={() => onPressPlate(label)}>
					<Text
						style={[
							styles.labelText,
							{
								color: backgroundColor(statuses?.[label] as string),
							},
						]}
					>
						{label}
						<Icon
							name="open-outline"
							size={80}
							color={backgroundColor(statuses?.[label] as string)}
						/>
					</Text>
				</TouchableHighlight>
			))}
		</View>
	);
};

const PlatesLayout: React.FC = () => {
	const platesData = useAtomValue(platesAtom);

	return (
		<View style={styles.overlay} pointerEvents="box-none">
			{platesData.map((plate) => (
				<PlateRectangle key={plate.id} plate={plate} />
			))}

			<View style={styles.controls}>
				<Text style={styles.hintText}>Scanning for plates...</Text>
				<Text style={styles.hintText}>
					On Screen Plates {platesData.length}
				</Text>
			</View>
		</View>
	);
};

const HEIGH = 720;
const WIDTH = 1114;

export default function Recognition() {
	const setPlatesAtom = useSetAtom(platesAtom);
	const isFocused = useIsFocused();

	const runOnJS = useRunOnJS((message: any) => {
		setPlatesAtom(message);
	}, []);

	const plateDetectionModel = useTensorflowModel(
		require("../../assets/models/detect.tflite"),
	);

	const { scanText } = useTextRecognition({
		language: "latin",
		frameSkipThreshold: 5,
		useLightweightMode: true,
	});

	const { hasPermission, requestPermission } = useCameraPermission();
	const device = useCameraDevice("back", {
		physicalDevices: ["telephoto-camera"],
	});

	const format = useCameraFormat(device, [
		{
			fps: FPS_CAMERA,
			videoStabilizationMode: "off",
			videoHdr: false,
			videoResolution: {
				height: HEIGH,
				width: WIDTH,
			},
			photoResolution: {
				height: HEIGH,
				width: WIDTH,
			},
			photoHdr: false,
			autoFocusSystem: "none",
			iso: "max",
		},
	]);

	useEffect(() => {
		if (!hasPermission) {
			requestPermission();
		}
	}, [hasPermission, requestPermission]);

	const frameProcessor = useFrameProcessor(
		(frame) => {
			"worklet";
			runAtTargetFps(FPS_RUN_PROCESSOR, () => {
				"worklet";
				if (plateDetectionModel.model == null) return;

				const recognizedPlates = plateRecognition(
					frame,
					plateDetectionModel.model,
				);
				if (recognizedPlates == null || recognizedPlates.length === 0) {
					return;
				}

				Promise.all(
					recognizedPlates.map(async (plate) => {
						"worklet";
						const totalHeight = frame.height; // 100%
						const totalWidth = frame.width;

						const config: ScanTextConfig = {
							scanRegion: {
								left: `${(plate.x / totalWidth) * 100}%`,
								top: `${(plate.y / totalHeight) * 100}%`,
								width: `${(plate.width / totalWidth) * 100}%`,
								height: `${(plate.height / totalHeight) * 100}%`,
							},
						};
						const data = scanText(frame, config);

						const PLATE_REGEX = /[A-Z0-9]{1,4}-[A-Z0-9]{1,4}/g;
						let match: string[] | undefined;
						if (
							data !== undefined &&
							data.resultText !== undefined &&
							data.resultText.length > 0
						) {
							const list = data?.resultText.match(PLATE_REGEX);
							// delete duplicates
							const uniqueList = list ? Array.from(new Set(list)) : [];
							if (uniqueList.length > 0) {
								match = uniqueList;
							}
						}

						if (match === undefined) {
							return plate;
						}

						return {
							...plate,
							labels: match,
						};
					}),
				).then((finalPlates: (TrackedPlate & { labels?: string[] })[]) => {
					"worklet";
					const plates = finalPlates.filter(
						(plate) => plate?.labels !== undefined,
					);
					if (plates.length === 0) {
						return;
					}
					runOnJS(plates);
				});
			});
		},
		[plateDetectionModel.model],
	);

	if (!hasPermission || plateDetectionModel.model == null || !device) {
		return (
			<View style={styles.container}>
				<Text style={styles.overlay}>Loading...</Text>
				<View style={styles.permissionContainer}>
					{!hasPermission ? (
						<Text style={styles.message}>Requesting camera permission...</Text>
					) : !device ? (
						<Text style={styles.message}>No camera device found.</Text>
					) : (
						<Text style={styles.message}>Loading recognition model...</Text>
					)}
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.cameraWrapper,
					{
						transform: [{ scale: 0.35 }],
					},
				]}
			>
				<Camera
					style={styles.camera}
					device={device}
					isActive={isFocused}
					frameProcessor={frameProcessor}
					format={format}
				/>
				<PlatesLayout />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	permissionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	cameraWrapper: {
		width: WIDTH,
		height: HEIGH,
		alignSelf: "center",
		position: "relative",
	},
	camera: {
		width: "100%",
		height: "100%",
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
	trackedObject: {
		position: "absolute",
		borderRadius: 30,
	},
	labelContainer: {},
	labelText: {
		position: "absolute",
		color: "purple",
		fontWeight: "bold",
		fontSize: 100,
	},
	controls: {
		position: "absolute",
		bottom: 20,
		width: "100%",
		alignItems: "center",
	},
	hintText: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 14,
		backgroundColor: "rgba(0,0,0,0.5)",
		padding: 8,
		borderRadius: 8,
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
		fontSize: 16,
	},
});
