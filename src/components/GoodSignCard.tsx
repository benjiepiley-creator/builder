import { Text, View } from "react-native";

import type { AiReport } from "@/schemas/aiReportSchema";

type Props = {
  sign: AiReport["goodSigns"][number];
};

export const GoodSignCard = ({ sign }: Props) => (
  <View className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
    <Text className="mb-2 text-base font-bold text-white">{sign.title}</Text>
    <Text className="leading-6 text-slate-300">{sign.explanation}</Text>
  </View>
);
