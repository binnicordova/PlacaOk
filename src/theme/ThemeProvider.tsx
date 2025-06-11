import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

export type Theme = {
  cardBackground: string;
  textColor: string;
  background: string;
  accent: string;
  border: string;
};

export const lightTheme: Theme = {
  cardBackground: "#e3f2fd", // light blue
  textColor: "#0d47a1", // strong blue
  background: "#f5faff", // very light blue
  accent: "#43a047", // green for 'ok'
  border: "#90caf9", // blue border
};

export const darkTheme: Theme = {
  cardBackground: "#263238", // dark blue-grey
  textColor: "#bbdefb", // light blue
  background: "#121a23", // very dark blue
  accent: "#66bb6a", // green for 'ok'
  border: "#37474f", // dark border
};

const ThemeContext = createContext<Theme>(lightTheme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
