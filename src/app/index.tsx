import { PlateServiceList } from "@components/PlateServiceList";
import { Screen } from "@components/Screen";
import { VehiclePlateModal } from "@components/VehiclePlateModal";
import { MOCK_PLATE_SERVICES } from "@mocks/plateServices.mock";
import { BACKGROUND_SYNC_HANDLER } from "@services/background";
import { currentVehiclePlateAtom } from "@state/selectors";
import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function Index() {
	const theme = useTheme();
	const vehiclePlate = useAtomValue(currentVehiclePlateAtom);
	const [showPlateModal, setShowPlateModal] = useState(!vehiclePlate);

	const handleChangePlate = () => {
		setShowPlateModal(true);
	};
	const handleCloseModal = () => {
		if (vehiclePlate && vehiclePlate.trim().length > 0) {
			setShowPlateModal(false);
		}
	};

	const evaluateShowModal = useCallback(() => {
		const showModal = !(vehiclePlate && vehiclePlate.trim().length > 0);
		console.log("Evaluating show plate modal:", showModal, vehiclePlate);
		setShowPlateModal(showModal);
	}, [vehiclePlate]);

	useEffect(() => {
		BACKGROUND_SYNC_HANDLER();
		evaluateShowModal();
	}, [evaluateShowModal]);

	return (
		<Screen>
			<VehiclePlateModal visible={showPlateModal} onClose={handleCloseModal} />
			<View style={[styles.container, { backgroundColor: theme.background }]}>
				{vehiclePlate && (
					<View style={styles.plateRow}>
						<Text style={[styles.plateText, { color: theme.textColor }]}>
							Placa actual: {vehiclePlate}
						</Text>
						<Pressable
							onPress={handleChangePlate}
							style={[styles.changeButton, { backgroundColor: theme.accent }]}
						>
							<Text style={styles.changeButtonText}>Cambiar placa</Text>
						</Pressable>
					</View>
				)}
				<Text
					style={[styles.title, { color: theme.textColor }]}
					onLongPress={() => BACKGROUND_SYNC_HANDLER()}
				>
					PlacaOk
				</Text>
				<Text style={[styles.subtitle, { color: theme.accent }]}>
					Valida si la placa de tu vehículo está OK
				</Text>
				{vehiclePlate && <PlateServiceList services={MOCK_PLATE_SERVICES} />}
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	plateRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		justifyContent: "center",
	},
	plateText: {
		fontWeight: "bold",
		fontSize: 16,
		marginRight: 8,
	},
	changeButton: {
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 4,
		marginLeft: 8,
	},
	changeButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	title: {
		fontWeight: "bold",
		fontSize: 28,
		marginBottom: 8,
		letterSpacing: 1,
	},
	subtitle: {
		fontWeight: "600",
		fontSize: 16,
		marginBottom: 16,
	},
});
