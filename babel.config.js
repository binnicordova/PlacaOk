module.exports = (api) => {
	api.cache(true);
	return {
		presets: [["babel-preset-expo"]],
		plugins: [
			"@babel/plugin-transform-async-generator-functions",
			["react-native-worklets-core/plugin"],
			["react-native-reanimated/plugin", { processNestedWorklets: true }],
		],
	};
};
