import { getVisitedServicesFromCloud } from "@services/firestore";
import {
	getVisitedServicesByPlate,
	saveVisitedServicesByPlate,
} from "@services/plate";
import { atom } from "jotai";
import {
	type VisitedServicesByPlate,
	vehiclePlateAtom,
	visitedServicesByPlateAtom,
} from "./atoms";

export const currentVehiclePlateAtom = atom(
	async (get) => {
		return await get(vehiclePlateAtom);
	},
	(get, set, plate: string) => {
		console.log("Setting vehicle plate to:", plate);
		set(vehiclePlateAtom, plate);
		const defaultCallback = () => {
			void getVisitedServicesByPlate(plate).then((data) =>
				set(visitedServicesByPlateAtom, data || {}),
			);
		};
		void getVisitedServicesFromCloud(plate)
			.then((data) => {
				if (data) {
					set(visitedServicesByPlateAtom, data);
					saveVisitedServicesByPlate(plate, data);
				} else defaultCallback();
			})
			.catch(() => defaultCallback());
	},
);

export const currentVisitedServicesByPlateAtom = atom(
	(get) => get(visitedServicesByPlateAtom),
	async (get, set, update: VisitedServicesByPlate) => {
		set(visitedServicesByPlateAtom, update);
		const currentPlate = await get(currentVehiclePlateAtom);
		if (currentPlate) {
			saveVisitedServicesByPlate(currentPlate, update);
		}
	},
);
