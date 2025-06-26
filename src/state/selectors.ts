import { getVisitedServicesByPlate, saveVisitedServicesByPlate } from "@services/plateServices";
import { atom } from "jotai";
import { vehiclePlateAtom, VisitedServicesByPlate, visitedServicesByPlateAtom } from "./atoms";

export const currentVehiclePlateAtom = atom(
    (get) => get(vehiclePlateAtom),
    (get, set, update: string) => {
        set(vehiclePlateAtom, update);
        void getVisitedServicesByPlate(update).then((data) =>
            set(visitedServicesByPlateAtom, data || {})
        );
    }
);

export const currentVisitedServicesByPlateAtom = atom(
    (get) => get(visitedServicesByPlateAtom),
    (get, set, update: VisitedServicesByPlate) => {
        set(visitedServicesByPlateAtom, update);
        const currentPlate = get(currentVehiclePlateAtom);
        if (currentPlate) {
            saveVisitedServicesByPlate(currentPlate, update);
        }
    }
);