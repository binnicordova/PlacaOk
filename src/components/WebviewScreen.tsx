import { Screen } from "@components/Screen";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../theme/ThemeProvider";

interface WebviewScreenProps {
  url: string;
  onClose?: () => void;
  onOk: () => void;
  onObserved: () => void;
}

const CustomButton: React.FC<{
  label: string;
  onPress: () => void;
  backgroundColor: string;
}> = React.memo(({ label, onPress, backgroundColor }) => (
  <Pressable
    onPress={onPress}
    style={[styles.button, { backgroundColor, marginLeft: 8 }]}
    android_ripple={{ color: "#fff", borderless: false }}
  >
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
));

export const WebviewScreen: React.FC<WebviewScreenProps & {
  onOk: () => void;
  onObserved: () => void;
}> = ({ url, onClose, onOk, onObserved }) => {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.infoText,
              { color: theme.textColor }
            ]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            Indica si la placa está OK u observada:
          </Text>
        </View>
        <CustomButton
          label="Placa Observada"
          onPress={onObserved}
          backgroundColor="#e67e22"
        />
        <CustomButton
          label="Placa OK"
          onPress={onOk}
          backgroundColor={theme.accent}
        />
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  infoText: {
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  webview: {
    flex: 1,
  },
});
