import { doc, getDoc, setDoc } from "firebase/firestore";
import type { VisitedServicesByPlate } from "../state/atoms";
import { db } from "./firebase";
import { markPlateAsInCloud } from "./plate";

const FIRESTORE_COLLECTION_NAME = "plates";

export async function setVisitedServicesToCloud(
	plate: string,
	data: VisitedServicesByPlate,
): Promise<void> {
	try {
		// Create a reference to the document with the plate as the document ID
		const plateDocRef = doc(db, FIRESTORE_COLLECTION_NAME, plate);
		const document = {
			...data,
			inCloud: true,
			uploadedAt: Date.now(),
		};
		await setDoc(plateDocRef, document, { merge: true });
		markPlateAsInCloud(plate, document as unknown as VisitedServicesByPlate);
	} catch (error) {
		console.error("Error syncing visited services to Firestore:", error);
		throw error;
	}
}

export async function getVisitedServicesFromCloud(
	plate: string,
): Promise<VisitedServicesByPlate | null> {
	try {
		const plateDocRef = doc(db, FIRESTORE_COLLECTION_NAME, plate);
		const docSnap = await getDoc(plateDocRef);

		if (docSnap.exists()) {
			return docSnap.data() as VisitedServicesByPlate;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error getting visited services from Firestore:", error);
		throw error;
	}
}
