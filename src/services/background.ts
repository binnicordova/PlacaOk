import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { setVisitedServicesToCloud } from "./firestore";
import { getVisitedServicesByPlate } from "./plate";
import { storage } from "./storage";

const BACKGROUND_SYNC_TASK = "background-sync-visited-services";
const BACKGROUND_SYNC_INTERVAL = 60 * 5; // 5 minutes in seconds

const PLATE_LENGTH = 6;

export const BACKGROUND_SYNC_HANDLER = async () => {
	try {
		const allKeys = await storage.getAllKeys();
		if (!allKeys || !Array.isArray(allKeys)) {
			return;
		}
		for (const plate of allKeys) {
			if (!plate.length || plate.length < PLATE_LENGTH) {
				continue;
			}
			const data = await getVisitedServicesByPlate(plate);
			if (!data) {
				continue;
			}
			if (data.inCloud) {
				continue;
			}
			console.log(`Syncing visited services for plate ${plate} to cloud...`);
			await setVisitedServicesToCloud(plate, data);
		}
		console.info("Background sync completed.");
	} catch (e) {
		console.error(e);
	}
};

TaskManager.defineTask(BACKGROUND_SYNC_TASK, BACKGROUND_SYNC_HANDLER);

export async function registerBackgroundSyncTask() {
	await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
		minimumInterval: BACKGROUND_SYNC_INTERVAL,
	});
}
