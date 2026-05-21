import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import type { RootStackParamList } from "@/navigation/types";

type NavKey = "home" | "scan" | "saved" | "settings";

type Props = {
  active: NavKey;
};

const items: { key: NavKey; label: string; route: keyof RootStackParamList }[] = [
  { key: "home", label: "Home", route: "Home" },
  { key: "scan", label: "Scan", route: "NewScan" },
  { key: "saved", label: "Saved", route: "PastScans" },
  { key: "settings", label: "Settings", route: "Settings" }
];

export const BottomNav = ({ active }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/50 p-2">
      <View className="flex-row items-center justify-between">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <Pressable
              key={item.key}
              onPress={() => navigation.navigate(item.route as never)}
              className="flex-1 overflow-hidden rounded-2xl"
            >
              {isActive ? (
                <LinearGradient colors={["#22D3EE", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="items-center py-3">
                  <Text className="text-xs font-black text-white">{item.label}</Text>
                </LinearGradient>
              ) : (
                <View className="items-center py-3">
                  <Text className="text-xs font-bold text-slate-400">{item.label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
