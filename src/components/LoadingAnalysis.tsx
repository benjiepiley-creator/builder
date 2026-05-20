import { ActivityIndicator, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const messages = [
  "Scanning for red flags...",
  "Checking price risk...",
  "Looking for seller warning signs...",
  "Building your risk report..."
];

export const LoadingAnalysis = () => (
  <View className="flex-1 items-center justify-center px-8">
    <LinearGradient
      colors={["#38BDF855", "#2563EB33", "#7C3AED22"]}
      className="mb-8 h-36 w-36 items-center justify-center rounded-full border border-cyan-300/30"
    >
      <ActivityIndicator color="#FFFFFF" size="large" />
    </LinearGradient>
    <Text className="text-center text-3xl font-black text-white">Analyzing purchase risk</Text>
    <View className="mt-8 w-full gap-3">
      {messages.map((message) => (
        <View key={message} className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
          <Text className="text-center font-semibold text-slate-200">{message}</Text>
        </View>
      ))}
    </View>
    <Text className="mt-8 text-center leading-6 text-slate-400">
      RiskRadar is using structured analysis. It will not guarantee safety, but it will highlight what to verify before buying.
    </Text>
  </View>
);
