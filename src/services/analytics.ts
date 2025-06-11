import PostHog, { PostHogProvider } from 'posthog-react-native';
import React from 'react';
import { POSTHOG_API_KEY, POSTHOG_HOST } from '../constants/environment';

export const posthog = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
});

export function logAnalyticsEvent(
    event: string,
    properties?: Record<string, any>
) {
    if (posthog && typeof posthog.capture === 'function') {
        posthog.capture(event, properties);
    }
}

export function withPostHogProvider(AppComponent: React.ComponentType<any>) {
    return function PostHogWrappedApp(props: any) {
        return React.createElement(
            PostHogProvider,
            { client: posthog, children: React.createElement(AppComponent, props) }
        );
    };
}
