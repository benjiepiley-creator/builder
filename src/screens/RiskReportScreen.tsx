import { Alert, Share, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ReactNode } from "react";

import { GoodSignCard } from "@/components/GoodSignCard";
import { NegotiationScriptCard } from "@/components/NegotiationScriptCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { QuestionList } from "@/components/QuestionList";
import { RedFlagCard } from "@/components/RedFlagCard";
import { RiskBreakdownCard } from "@/components/RiskBreakdownCard";
import { RiskScoreCircle } from "@/components/RiskScoreCircle";
import { ScreenContainer } from "@/components/ScreenContainer";
import { VerdictBadge } from "@/components/VerdictBadge";
import { REPORT_DISCLAIMER } from "@/constants/copy";
import { useScanStore } from "@/hooks/useScanStore";
import type { RootStackParamList } from "@/navigation/types";
import { formatCurrency } from "@/utils/format";
import { recommendationLabel } from "@/utils/risk";

type Props = NativeStackScreenProps<RootStackParamList, "RiskReport">;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View className="mt-6">
    <Text className="mb-3 text-2xl font-black text-white">{title}</Text>
    {children}
  </View>
);

export const RiskReportScreen = ({ navigation, route }: Props) => {
  const { currentScan, scans, saveReport } = useScanStore();
  const scan =
    route.params?.scan ??
    currentScan ??
    scans.find((item) => item.id === route.params?.scanId);

  if (!scan) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center">
          <Text className="text-center text-2xl font-black text-white">Report not found</Text>
          <Text className="mt-3 text-center text-slate-400">This scan may have been deleted.</Text>
          <View className="mt-6">
            <PrimaryButton title="Back to Home" onPress={() => navigation.navigate("Home")} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const { report } = scan;

  const copyPrimaryScript = async () => {
    await Clipboard.setStringAsync(report.negotiation.casualScript);
    Alert.alert("Copied", "Casual negotiation message copied.");
  };

  const shareReport = async () => {
    await Share.share({
      title: `RiskRadar report for ${scan.itemTitle}`,
      message: `${scan.itemTitle}\nRisk score: ${report.overallRiskScore}/100\nVerdict: ${report.verdict}\n\n${report.summary}\n\n${report.finalRecommendation}\n\n${REPORT_DISCLAIMER}`
    });
  };

  const save = async () => {
    await saveReport(scan);
    Alert.alert("Saved", "Report saved to past scans.");
  };

  return (
    <ScreenContainer>
      <View className="pt-4">
        <Text className="text-sm font-bold uppercase tracking-[4px] text-cyan-300">Risk Report</Text>
        <Text className="mt-2 text-4xl font-black text-white">{scan.itemTitle || "Purchase analysis"}</Text>
        <Text className="mt-2 text-slate-400">
          {scan.category} • {formatCurrency(scan.askingPrice)}
        </Text>

        <View className="mt-6 items-center rounded-[36px] border border-slate-800 bg-slate-900/80 p-6">
          <RiskScoreCircle score={report.overallRiskScore} />
          <View className="mt-6 items-center">
            <VerdictBadge verdict={report.verdict} />
            <Text className="mt-4 text-center text-xl font-black text-white">
              Recommendation: {recommendationLabel(report.recommendation)}
            </Text>
            <Text className="mt-2 text-center text-slate-400">Confidence: {report.confidenceScore}/100</Text>
          </View>
        </View>

        <Section title="Summary">
          <View className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <Text className="leading-7 text-slate-200">{report.summary}</Text>
          </View>
        </Section>

        <Section title="Risk Breakdown">
          <RiskBreakdownCard breakdown={report.riskBreakdown} />
        </Section>

        <Section title="Red Flags Found">
          <View className="gap-3">
            {report.redFlags.length ? (
              report.redFlags.map((flag, index) => <RedFlagCard key={`${flag.title}-${index}`} flag={flag} />)
            ) : (
              <Text className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
                No major red flags were identified from the provided information, but this is not a guarantee of safety.
              </Text>
            )}
          </View>
        </Section>

        <Section title="Good Signs">
          <View className="gap-3">
            {report.goodSigns.map((sign, index) => (
              <GoodSignCard key={`${sign.title}-${index}`} sign={sign} />
            ))}
          </View>
        </Section>

        <Section title="Estimated Fair Value">
          <View className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Low</Text>
              <Text className="font-bold text-white">{formatCurrency(report.estimatedValue.low)}</Text>
            </View>
            <View className="mt-3 flex-row justify-between">
              <Text className="text-slate-400">Fair</Text>
              <Text className="font-bold text-white">{formatCurrency(report.estimatedValue.fair)}</Text>
            </View>
            <View className="mt-3 flex-row justify-between">
              <Text className="text-slate-400">High</Text>
              <Text className="font-bold text-white">{formatCurrency(report.estimatedValue.high)}</Text>
            </View>
            <Text className="mt-4 leading-6 text-slate-300">{report.estimatedValue.priceAssessment}</Text>
          </View>
        </Section>

        <Section title="Questions to Ask">
          <QuestionList questions={report.questionsToAsk} />
        </Section>

        <Section title="Negotiation Strategy">
          <View className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Opening offer</Text>
              <Text className="font-bold text-white">{formatCurrency(report.negotiation.suggestedOpeningOffer)}</Text>
            </View>
            <View className="mt-3 flex-row justify-between">
              <Text className="text-slate-400">Target price</Text>
              <Text className="font-bold text-white">{formatCurrency(report.negotiation.targetPrice)}</Text>
            </View>
            <View className="mt-3 flex-row justify-between">
              <Text className="text-slate-400">Max price</Text>
              <Text className="font-bold text-white">{formatCurrency(report.negotiation.maxRecommendedPrice)}</Text>
            </View>
          </View>
          <View className="mt-3 gap-3">
            <NegotiationScriptCard title="Polite script" script={report.negotiation.politeScript} />
            <NegotiationScriptCard title="Aggressive script" script={report.negotiation.aggressiveScript} />
            <NegotiationScriptCard title="Casual marketplace message" script={report.negotiation.casualScript} />
          </View>
        </Section>

        <Section title="Final Recommendation">
          <View className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <Text className="text-lg font-bold leading-7 text-white">{report.finalRecommendation}</Text>
          </View>
        </Section>

        <View className="mt-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <Text className="leading-6 text-yellow-100">{REPORT_DISCLAIMER}</Text>
        </View>

        <View className="mt-6 gap-3">
          <PrimaryButton title="Save Report" onPress={save} />
          <PrimaryButton title="Start New Scan" variant="secondary" onPress={() => navigation.navigate("NewScan")} />
          <PrimaryButton title="Copy Negotiation Message" variant="secondary" onPress={copyPrimaryScript} />
          <PrimaryButton title="Share Report" variant="secondary" onPress={shareReport} />
        </View>
      </View>
    </ScreenContainer>
  );
};
