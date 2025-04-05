export function classifyExpense(description: string, amount: number): "Need" | "Want" {
  const needsKeywords = ["rent", "grocery", "medicine", "electricity", "water", "transport", "food"];
  const wantsKeywords = ["netflix", "movie", "uber eats", "shopping", "gaming", "concert", "starbucks"];

  const lowerDesc = description.toLowerCase();

  if (needsKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return "Need";
  }
  if (wantsKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return "Want";
  }

  return amount <= 200 ? "Want" : "Need"; // fallback logic
}
