import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import type { RootStackParamList } from "@/navigation/types";

const ONBOARDING_KEY = "riskradar.onboarding.complete";

const slides = [
  {
    title: "Avoid bad deals before you buy.",
    subtitle: "Scan listings, photos, and seller messages for scam risk, overpricing, and hidden red flags."
  },
  {
    title: "AI-powered deal analysis.",
    subtitle: "Get a risk score, price insight, negotiation strategy, and walk-away warning."
  },
  {
    title: "Buy smarter.",
    subtitle: "Use RiskRadar before sending money, meeting sellers, or committing to a purchase."
  }
];

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export const OnboardingScreen = ({ navigation }: Props) => {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    navigation.replace("Home");
  };

  return (
    <ScreenContainer scroll={false}>
      <View className="flex-1 justify-between py-5">
        <Pressable onPress={finish} className="self-end rounded-full px-4 py-2">
          <Text className="font-semibold text-slate-400">Skip</Text>
        </Pressable>

        <View>
          <View className="mb-10 h-56 justify-end rounded-[36px] border border-cyan-300/20 bg-cyan-300/10 p-6">
            <Text className="text-sm font-bold uppercase tracking-[4px] text-cyan-200">RiskRadar</Text>
            <Text className="mt-4 text-6xl font-black text-white">AI Purchase Risk Scanner</Text>
          </View>
          <Text className="text-4xl font-black leading-tight text-white">{slide.title}</Text>
          <Text className="mt-5 text-lg leading-8 text-slate-300">{slide.subtitle}</Text>
        </View>

        <View>
          <View className="mb-6 flex-row justify-center gap-2">
            {slides.map((item, dotIndex) => (
              <View
                key={item.title}
                className={`h-2 rounded-full ${dotIndex === index ? "w-8 bg-cyan-300" : "w-2 bg-slate-700"}`}
              />
            ))}
          </View>
          <PrimaryButton
            title={index === slides.length - 1 ? "Get Started" : "Next"}
            onPress={index === slides.length - 1 ? finish : () => setIndex((value) => value + 1)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export { ONBOARDING_KEY };
