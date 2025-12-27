import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { useTheme } from "../theme/ThemeProvider";

export type IconName = keyof typeof Ionicons.glyphMap;

export interface IconProps extends React.ComponentProps<typeof Ionicons> {
	name: IconName;
}

export const Icon: React.FC<IconProps> = ({
	name,
	size = 24,
	color,
	style,
	...props
}) => {
	const theme = useTheme();
	const iconColor = color || theme.textColor;

	return (
		<Ionicons
			name={name}
			size={size}
			color={iconColor}
			style={style}
			{...props}
		/>
	);
};
