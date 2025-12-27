import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { PlateStatus } from "../models/plateStatus";

export type VisitedServicesByPlate = Record<string, PlateStatus | string>;

export const CURRENT_VEHICLE_PLATE_STORAGE_KEY = "vehiclePlate";
export const vehiclePlateAtom = atom<string>("");

export const CURRENT_VEHICLE_STATES_STORAGE_KEY = "vehicleStates";
export const visitedServicesByPlateAtom =
	atomWithStorage<VisitedServicesByPlate>(
		CURRENT_VEHICLE_STATES_STORAGE_KEY,
		{},
	);
