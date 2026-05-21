import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = PropsWithChildren<{
  className?: string;
  glow?: "cyan" | "violet" | "none";
}>;

export const GlassCard = ({ children, className = "", glow = "none" }: Props) => {
  const glowColor = glow === "cyan" ? "#22D3EE33" : glow === "violet" ? "#8B5CF633" : "transparent";

  return (
    <View className={`overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 ${className}`}>
      {glow !== "none" ? (
        <View
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full"
          style={{ backgroundColor: glowColor, pointerEvents: "none" }}
        />
      ) : null}
      <LinearGradient
        colors={["rgba(255,255,255,0.11)", "rgba(56,189,248,0.05)", "rgba(15,23,42,0.58)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5"
      >
        {children}
      </LinearGradient>
    </View>
  );
};
