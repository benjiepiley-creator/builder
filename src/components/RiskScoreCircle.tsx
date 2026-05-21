import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { riskScoreColor } from "@/utils/risk";

type Props = {
  score: number;
  size?: number;
};

export const RiskScoreCircle = ({ score, size = 156 }: Props) => {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100)) / 100;
  const color = riskScoreColor(score);

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} className="absolute">
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={stroke}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress * circumference}
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <Text className="text-5xl font-black text-white">{Math.round(score)}</Text>
      <Text className="mt-1 text-xs font-semibold uppercase tracking-[2px] text-slate-400">Risk Score</Text>
    </View>
  );
};
