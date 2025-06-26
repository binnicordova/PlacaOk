import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { syncVisitedServicesByPlateToAppwrite } from './appwrite';
import { getVisitedServicesByPlate } from './plateServices';
import { storage } from './storage';

const BACKGROUND_SYNC_TASK = 'background-sync-visited-services';
const BACKGROUND_SYNC_INTERVAL = 60 * 15;

const PLATE_LENGTH = 6;

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const allKeys = await storage.getAllKeys();
    if (!allKeys || !Array.isArray(allKeys)) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
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
      await syncVisitedServicesByPlateToAppwrite(plate, data);
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSyncTask() {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: BACKGROUND_SYNC_INTERVAL,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
