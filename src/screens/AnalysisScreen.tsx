import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useScanStore } from "@/hooks/useScanStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Analysis">;

export const AnalysisScreen = ({ navigation, route }: Props) => {
  const started = useRef(false);
  const runAnalysis = useScanStore((state) => state.runAnalysis);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    runAnalysis(route.params.input)
      .then((scan) => {
        navigation.replace("RiskReport", { scanId: scan.id, scan });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unable to analyze this purchase.";
        Alert.alert("Analysis failed", message);
        navigation.goBack();
      });
  }, [navigation, route.params.input, runAnalysis]);

  return (
    <ScreenContainer scroll={false} padded={false}>
      <LoadingAnalysis />
    </ScreenContainer>
  );
};
