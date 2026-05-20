import { Text, View } from "react-native";

type Props = {
  questions: string[];
};

export const QuestionList = ({ questions }: Props) => (
  <View className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
    <Text className="mb-4 text-xl font-bold text-white">Questions to Ask Seller</Text>
    {questions.map((question, index) => (
      <View key={`${question}-${index}`} className="mb-3 flex-row gap-3 last:mb-0">
        <Text className="font-bold text-cyan-300">{index + 1}.</Text>
        <Text className="flex-1 leading-6 text-slate-200">{question}</Text>
      </View>
    ))}
  </View>
);
