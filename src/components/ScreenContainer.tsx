import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
}>;

export const ScreenContainer = ({ children, scroll = true, padded = true }: Props) => {
  const content = <View className={`${padded ? "px-5 pb-8" : ""} flex-1`}>{children}</View>;

  return (
    <LinearGradient colors={["#060912", "#0A0F1D", "#101624"]} className="flex-1">
      <SafeAreaView className="flex-1">
        {scroll ? (
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};
