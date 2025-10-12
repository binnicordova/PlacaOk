export async function logAnalyticsEvent(
	event: string,
	properties?: Record<string, any>,
) {
	console.log(`Analytics Event: ${event}`, properties);
	//   await analytics().logEvent(event, properties);
}
