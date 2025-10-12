import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAJ5uAPOdw_XMcjd5L48UYwDVy1WMoJips",
	authDomain: "placaok-ai.firebaseapp.com",
	databaseURL: "https://placaok-ai-default-rtdb.firebaseio.com",
	projectId: "placaok-ai",
	storageBucket: "placaok-ai.firebasestorage.app",
	messagingSenderId: "746574809184",
	appId: "1:746574809184:android:16db3bd626d82be6e95b05",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
