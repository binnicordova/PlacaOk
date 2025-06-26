import { Client, Databases } from 'appwrite';
import { APPWRITE_DATABASE_ID, APPWRITE_PROJECT_ID } from '../constants/environment';
import { VisitedServicesByPlate } from '../state/atoms';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';

type AppwriteConfig = {
  projectId: string;
  databaseId: string;
};

export const APPWRITE_CONFIG: AppwriteConfig = {
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
};

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_CONFIG.projectId);

const databases = new Databases(client);

export async function syncVisitedServicesByPlateToAppwrite(
  plate: string,
  data: VisitedServicesByPlate
): Promise<void> {
    const APPWRITE_COLLECTION_ID = 'plates';
  try {
    await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_COLLECTION_ID,
      plate,
      data,
    );
  } catch (err: any) {
    if (err?.code === 409) {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_COLLECTION_ID,
        plate,
        data
      );
    } else {
      throw err;
    }
  }
}
