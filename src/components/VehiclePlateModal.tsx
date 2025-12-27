import { currentVehiclePlateAtom } from "@state/selectors";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "./Icon";

export function VehiclePlateModal({
	visible,
	onClose,
}: {
	visible: boolean;
	onClose: () => void;
}) {
	const theme = useTheme();
	const router = useRouter();
	const [inputPlate, setInputPlate] = useState("");
	const setVehiclePlate = useSetAtom(currentVehiclePlateAtom);

	const handlePlateSubmit = () => {
		if (!inputPlate || inputPlate.trim().length === 0) {
			return;
		}
		setVehiclePlate(inputPlate.trim().toUpperCase());
		setInputPlate("");
		onClose();
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
				<View
					style={[
						styles.modalContent,
						{ backgroundColor: theme.cardBackground },
					]}
				>
					<Text
						style={{
							color: theme.textColor,
							fontWeight: "bold",
							fontSize: 18,
							marginBottom: 8,
						}}
					>
						Ingresa la placa del vehículo
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							alignContent: "center",
						}}
					>
						<TextInput
							value={inputPlate}
							onChangeText={setInputPlate}
							placeholder="Ej: ABC123"
							autoCapitalize="characters"
							style={[
								styles.input,
								{ color: theme.textColor, borderColor: theme.border },
							]}
							placeholderTextColor={theme.border}
							autoFocus
							onSubmitEditing={handlePlateSubmit}
						/>
						<Icon
							name="camera-outline"
							size={32}
							color={theme.accent}
							onPress={() => router.push("/recognition")}
							style={styles.icon}
						>
							<Text style={{ color: theme.accent, fontSize: 15 }}>IA</Text>
							<Icon
								name="logo-apple-ar"
								size={15}
								color={theme.accent}
								style={{ marginLeft: 2 }}
							/>
						</Icon>
					</View>
					<Pressable
						style={[styles.button, { backgroundColor: theme.accent }]}
						onPress={handlePlateSubmit}
					>
						<Text style={{ color: "#fff", fontWeight: "bold" }}>
							Usar placa
						</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "85%",
		borderRadius: 12,
		padding: 20,
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 10,
		width: 180,
		fontSize: 18,
		textAlign: "center",
		letterSpacing: 2,
	},
	icon: {
		paddingLeft: 10,
	},
	button: {
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginTop: 8,
	},
});
