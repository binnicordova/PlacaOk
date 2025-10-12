import { WebviewScreen } from "@components/WebviewScreen";
import MasonryList from "@react-native-seoul/masonry-list";
import {
	currentVehiclePlateAtom,
	currentVisitedServicesByPlateAtom,
} from "@state/selectors";
import * as Clipboard from "expo-clipboard";
import { useAtom } from "jotai";
import { PlateStatus } from "models/plateStatus";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ANALYTICS_EVENTS } from "../constants/analyticsEvents";
import { logAnalyticsEvent } from "../services/analytics";
import { useTheme } from "../theme/ThemeProvider";

const PLATE_SERVICE_LIST = "PlateServiceList";

export interface PlateService {
	title: string;
	url: string;
	subtitle: string;
}

interface PlateServiceListProps {
	services: PlateService[];
}

export const PlateServiceList: React.FC<PlateServiceListProps> = ({
	services,
}) => {
	const theme = useTheme();
	const [selectedService, setSelectedService] = useState<PlateService | null>(
		null,
	);
	const [vehiclePlate] = useAtom(currentVehiclePlateAtom);
	const [visitedServicesByPlate, setVisitedServicesByPlate] = useAtom(
		currentVisitedServicesByPlateAtom,
	);

	useEffect(() => {
		if (selectedService && vehiclePlate) {
			logAnalyticsEvent(ANALYTICS_EVENTS.SERVICE_ITEM_CLICKED, {
				title: selectedService.title,
				url: selectedService.url,
				subtitle: selectedService.subtitle,
				timestamp: new Date().toISOString(),
				screen: PLATE_SERVICE_LIST,
				plate: vehiclePlate,
			});
			Clipboard.setStringAsync(vehiclePlate);
		}
	}, [selectedService, vehiclePlate]);

	const handleServiceStatus = (status: PlateStatus) => {
		if (!selectedService || !vehiclePlate) return;
		setVisitedServicesByPlate({
			...visitedServicesByPlate,
			[selectedService.url]: status,
		});
		setSelectedService(null);
	};

	return (
		<>
			<MasonryList
				data={services}
				keyExtractor={(item) => item.url}
				numColumns={2}
				renderItem={({ item }) => {
					const service = item as PlateService;
					const visitStatus = visitedServicesByPlate[
						service.url
					] as PlateStatus;
					const statusLabel =
						visitStatus === PlateStatus.OK
							? "Placa OK"
							: visitStatus === PlateStatus.OBSERVED
								? "Placa Observada"
								: "";
					const statusColor =
						visitStatus === PlateStatus.OK
							? theme.accent
							: visitStatus === PlateStatus.OBSERVED
								? "#e67e22"
								: theme.textColor;

					return (
						<Pressable
							onPress={() => setSelectedService(service)}
							disabled={!vehiclePlate}
						>
							<View
								style={[
									styles.card,
									{
										backgroundColor: theme.cardBackground,
										borderColor: theme.border,
										borderWidth: 1,
										opacity: visitStatus ? 0.6 : 1,
									},
								]}
							>
								<Text style={[styles.item, { color: theme.textColor }]}>
									{service.title}
								</Text>
								<Text style={[styles.subtitle, { color: theme.textColor }]}>
									{service.subtitle}
								</Text>
								{visitStatus && (
									<Text style={[styles.visited, { color: statusColor }]}>
										{statusLabel}
									</Text>
								)}
							</View>
						</Pressable>
					);
				}}
				contentContainerStyle={{ paddingHorizontal: 8 }}
			/>
			<Modal
				visible={!!selectedService}
				animationType="slide"
				onRequestClose={() => setSelectedService(null)}
			>
				{selectedService && vehiclePlate && (
					<WebviewScreen
						url={selectedService.url}
						onClose={() => setSelectedService(null)}
						onOk={() => handleServiceStatus(PlateStatus.OK)}
						onObserved={() => handleServiceStatus(PlateStatus.OBSERVED)}
					/>
				)}
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		padding: 12,
		margin: 6,
		alignItems: "center",
		elevation: 2,
	},
	item: {
		fontWeight: "700",
		fontSize: 16,
		textAlign: "center",
		marginBottom: 2,
	},
	subtitle: {
		fontWeight: "400",
		fontSize: 13,
		textAlign: "center",
		marginBottom: 4,
		opacity: 0.8,
	},
	status: {
		fontWeight: "bold",
		fontSize: 14,
		marginTop: 2,
		letterSpacing: 1,
	},
	visited: {
		fontWeight: "bold",
		fontSize: 12,
		marginTop: 4,
		letterSpacing: 1,
		opacity: 0.8,
	},
});
