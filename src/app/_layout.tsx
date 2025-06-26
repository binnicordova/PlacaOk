import { JotaiProvider } from '@state/jotaiProvider';
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { View } from "react-native";
import { ANALYTICS_EVENTS } from '../constants/analyticsEvents';
import { logAnalyticsEvent, withPostHogProvider } from '../services/analytics';
import { registerBackgroundSyncTask } from '../services/backgroundSync';
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

function AnalyticsInit() {
    const theme = useTheme();

    useEffect(() => {
        logAnalyticsEvent(ANALYTICS_EVENTS.APP_OPEN);
        registerBackgroundSyncTask();
        async function checkForUpdate() {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    Updates.reloadAsync();
                }
            } catch (e) {
                console.log("Update check failed:", e);
            }
        }
        checkForUpdate();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar
                backgroundColor={theme.background}
                style={theme.background === "#121a23" ? "light" : "dark"}
                translucent={false}
            />
            <Slot />
        </View>
    );
}

function LayoutContent() {
  return (
    <JotaiProvider>
      <ThemeProvider>
        <AnalyticsInit />
      </ThemeProvider>
    </JotaiProvider>
  );
}

export default withPostHogProvider(LayoutContent);
