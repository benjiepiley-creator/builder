import { Pressable, Text, View } from "react-native";

import { CATEGORIES, type Category } from "@/constants/categories";

type Props = {
  value: Category | "";
  onChange: (category: Category) => void;
  error?: string;
};

export const CategoryPicker = ({ value, onChange, error }: Props) => (
  <View>
    <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Category</Text>
    <View className="flex-row flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const active = value === category;
        return (
          <Pressable
            key={category}
            onPress={() => onChange(category)}
            className={`rounded-full border px-4 py-2 ${
              active ? "border-cyan-300 bg-cyan-400/20" : "border-slate-700 bg-slate-900/70"
            }`}
          >
            <Text className={`text-sm font-semibold ${active ? "text-cyan-100" : "text-slate-300"}`}>{category}</Text>
          </Pressable>
        );
      })}
    </View>
    {error ? <Text className="mt-2 text-sm text-red-300">{error}</Text> : null}
  </View>
);
