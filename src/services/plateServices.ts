import { VisitedServicesByPlate } from "@state/atoms";
import { storage } from "./storage";

export async function getVisitedServicesByPlate(plate: string): Promise<VisitedServicesByPlate | undefined> {
  const data = await storage.getItem(plate);
  return data ? JSON.parse(data) : undefined;
}

export async function saveVisitedServicesByPlate(
  plate: string,
  data: VisitedServicesByPlate
): Promise<void> {
  const updatedAt = Date.now();
  const existingData = await getVisitedServicesByPlate(plate);
  if (existingData) {
    Object.assign(existingData, data);
    data = existingData;
  }
  await storage.setItem(plate, JSON.stringify({
    ...data,
    updatedAt,
    inCloud: false,
  }));
}
