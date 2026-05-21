import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
}>;

export const ScreenContainer = ({ children, scroll = true, padded = true }: Props) => {
  const content = <View className={`${padded ? "px-5 pb-8" : ""} flex-1`}>{children}</View>;

  return (
    <LinearGradient colors={["#050713", "#100A2A", "#071A2A", "#050713"]} className="flex-1">
      <View pointerEvents="none" className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-violet-600/20" />
      <View pointerEvents="none" className="absolute -right-20 top-36 h-52 w-52 rounded-full bg-cyan-400/20" />
      <View pointerEvents="none" className="absolute bottom-24 left-16 h-40 w-40 rounded-full bg-fuchsia-500/10" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
          {scroll ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {content}
            </ScrollView>
          ) : (
            content
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};
