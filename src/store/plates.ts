import type { TrackedPlate } from "@app/recognition";
import { atom } from "jotai";

export const platesAtom = atom<Array<TrackedPlate>>([]);
