import { Alert, Pressable, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";

type Props = {
  title: string;
  script: string;
};

export const NegotiationScriptCard = ({ title, script }: Props) => {
  const copy = async () => {
    await Clipboard.setStringAsync(script);
    Alert.alert("Copied", "Negotiation message copied to clipboard.");
  };

  return (
    <View className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <Text className="text-base font-bold text-white">{title}</Text>
        <Pressable onPress={copy} className="rounded-full bg-cyan-500/15 px-3 py-1">
          <Text className="text-xs font-bold uppercase text-cyan-200">Copy</Text>
        </Pressable>
      </View>
      <Text className="leading-6 text-slate-300">{script}</Text>
    </View>
  );
};
