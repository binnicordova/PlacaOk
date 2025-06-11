import { Screen } from "@components/Screen";
import React from "react";
import { Pressable, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../theme/ThemeProvider";

interface WebviewScreenProps {
  url: string;
  onClose: () => void;
}

export const WebviewScreen: React.FC<WebviewScreenProps> = ({ url, onClose }) => {
  const theme = useTheme();
  return (
    <Screen>
      <Pressable onPress={onClose} style={{ padding: 16 }}>
        <Text style={{ color: theme.accent, fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
      </Pressable>
      <WebView source={{ uri: url }} style={{ flex: 1 }} />
    </Screen>
  );
};
