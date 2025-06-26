import { atomWithStorage } from 'jotai/utils';
import { PlateStatus } from '../models/plateStatus';

export type VisitedServicesByPlate = Record<string, PlateStatus | string>;

export const CURRENT_VEHICLE_PLATE_STORAGE_KEY = 'vehiclePlate';
export const vehiclePlateAtom = atomWithStorage<string>(CURRENT_VEHICLE_PLATE_STORAGE_KEY, '');

export const CURRENT_VEHICLE_STATES_STORAGE_KEY = 'vehicleStates';
export const visitedServicesByPlateAtom = atomWithStorage<VisitedServicesByPlate>(
  CURRENT_VEHICLE_STATES_STORAGE_KEY,
  {},
);
