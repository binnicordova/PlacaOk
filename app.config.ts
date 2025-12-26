import type { ExpoConfig } from "@expo/config-types";
import "dotenv/config";

const EAS_OWNER = process.env.EAS_OWNER; // by https://www.binnicordova.com
const EAS_SLUG = "PlacaOk";
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID;

const VERSION = "0.0.3";
const VERSION_CODE = 30;

const APP_VARIANTS = {
	development: {
		identifier: "com.placaok.dev",
		name: "PlacaOk (Dev)",
		scheme: "dev.placaok.com",
	},
	preview: {
		identifier: "com.placaok.preview",
		name: "PlacaOk (Preview)",
		scheme: "preview.placaok.com",
	},
	production: {
		identifier: "com.placaok",
		name: "PlacaOk",
		scheme: "placaok.com",
	},
};

const getAppVariant = () => {
	if (process.env.APP_VARIANT === "development")
		return APP_VARIANTS.development;
	if (process.env.APP_VARIANT === "preview") return APP_VARIANTS.preview;
	return APP_VARIANTS.production;
};

const getUniqueIdentifier = () => getAppVariant().identifier;
const getAppName = () => getAppVariant().name;
const getScheme = () => getAppVariant().scheme;

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
	...config,
	name: getAppName(),
	scheme: getScheme(),
	slug: EAS_SLUG,
	version: VERSION,
	icon: "./assets/icon.png",
	newArchEnabled: true,
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	updates: {
		fallbackToCacheTimeout: 0,
		url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
		enabled: true,
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: getUniqueIdentifier(),
		version: VERSION,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#FFFFFF",
		},
		package: getUniqueIdentifier(),
		versionCode: VERSION_CODE,
		version: VERSION,
	},
	web: {
		favicon: "./assets/favicon.png",
		bundler: "metro",
	},
	extra: {
		router: {
			root: "src/app",
		},
		eas: {
			projectId: EAS_PROJECT_ID,
		},
	},
	owner: EAS_OWNER,
	runtimeVersion: VERSION,
	userInterfaceStyle: "automatic",
	plugins: [
		[
			"expo-router",
			{
				root: "src/app",
			},
		],
		"expo-background-task",
		[
			"react-native-vision-camera",
			{
				cameraPermissionText:
					"Allow $(PRODUCT_NAME) to access your camera for license plate recognition.",
				microphonePermissionText:
					"Allow $(PRODUCT_NAME) to access your microphone for potential future audio features.",
				enableCodeScanner: false,
			},
		],
		[
			"react-native-fast-tflite",
			{
				enableCoreMLDelegate: false,
				enableFrameProcessors: false,
			},
		],
		"expo-asset",
		"expo-font",
		"expo-localization",
		"expo-web-browser",
	],
});
