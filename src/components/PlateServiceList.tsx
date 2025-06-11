import { WebviewScreen } from "@components/WebviewScreen";
import MasonryList from '@react-native-seoul/masonry-list';
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ANALYTICS_EVENTS } from '../constants/analyticsEvents';
import { logAnalyticsEvent } from '../services/analytics';
import { useTheme } from "../theme/ThemeProvider";

const PLATE_SERVICE_LIST = 'PlateServiceList';

export interface PlateService {
  title: string;
  url: string;
  subtitle: string;
}

interface PlateServiceListProps {
  services: PlateService[];
}

export const PlateServiceList: React.FC<PlateServiceListProps> = ({ services }) => {
  const theme = useTheme();
  const [selectedService, setSelectedService] = useState<PlateService | null>(null);
  const [visited, setVisited] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedService) {
      setVisited((prev) => ({ ...prev, [selectedService.url]: true }));
      logAnalyticsEvent(ANALYTICS_EVENTS.SERVICE_ITEM_CLICKED, {
        title: selectedService.title,
        url: selectedService.url,
        subtitle: selectedService.subtitle,
        timestamp: new Date().toISOString(),
        screen: PLATE_SERVICE_LIST,
      });
    }
  }, [selectedService]);

  return (
    <>
      <MasonryList
        data={services}
        keyExtractor={(item) => item.url}
        numColumns={2}
        renderItem={({ item }) => {
          const service = item as PlateService;
          const isVisited = visited[service.url];
          return (
            <Pressable onPress={() => setSelectedService(service)}>
              <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border, borderWidth: 1, opacity: isVisited ? 0.6 : 1 }]}> 
                <Text style={[styles.item, { color: theme.textColor }]}>{service.title}</Text>
                <Text style={[styles.subtitle, { color: theme.textColor }]}>{service.subtitle}</Text>
                {isVisited && (
                  <Text style={[styles.visited, { color: theme.accent }]}>Visitado</Text>
                )}
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
      <Modal visible={!!selectedService} animationType="slide" onRequestClose={() => setSelectedService(null)}>
        {selectedService && (
          <WebviewScreen url={selectedService.url} onClose={() => setSelectedService(null)} />
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
    alignItems: 'center',
    elevation: 2,
  },
  item: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.8,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
    letterSpacing: 1,
  },
  visited: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
    opacity: 0.8,
  },
});
