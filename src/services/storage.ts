import AsyncStorage from "@react-native-async-storage/async-storage";

export type Storage = {
	setItem(key: string, value: string): Promise<void>;
	getItem(key: string): Promise<string | null>;
	removeItem(key: string): Promise<void>;
	clear(): Promise<void>;
	getAllKeys(): Promise<string[]>;
};

export const storage: Storage = {
	async setItem(key: string, value: string): Promise<void> {
		await AsyncStorage.setItem(key, value);
	},

	async getItem(key: string): Promise<string | null> {
		return await AsyncStorage.getItem(key);
	},

	async removeItem(key: string): Promise<void> {
		await AsyncStorage.removeItem(key);
	},

	async clear(): Promise<void> {
		await AsyncStorage.clear();
	},

	async getAllKeys(): Promise<string[]> {
		return Array.from(await AsyncStorage.getAllKeys());
	},
};
