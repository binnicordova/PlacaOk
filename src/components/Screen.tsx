import type React from "react";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";

export const Screen: React.FC<PropsWithChildren> = ({ children }) => {
	const insets = useSafeAreaInsets();
	const theme = useTheme();
	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
					backgroundColor: theme.background,
				},
			]}
		>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
