import { PlateServiceList } from "@components/PlateServiceList";
import { Screen } from "@components/Screen";
import { MOCK_PLATE_SERVICES } from "@mocks/plateServices.mock";
import { Text, useColorScheme, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function Index() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#181818" : "#fff";
  const textColor = isDark ? "#fff" : "#222";

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ color: theme.textColor, fontWeight: "bold", fontSize: 28, marginBottom: 8, letterSpacing: 1 }}>
          PlacaOk
        </Text>
        <Text style={{ color: theme.accent, fontWeight: "600", fontSize: 16, marginBottom: 16 }}>
          Valida si la placa de tu vehículo está OK
        </Text>
        <PlateServiceList services={MOCK_PLATE_SERVICES} />
      </View>
    </Screen>
  );
}
