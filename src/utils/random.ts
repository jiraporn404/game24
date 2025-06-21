import { isSolvable } from "./validate";

export const generateNumbers = (): number[] => {
  const numbers = [];
  for (let i = 0; i < 4; i++) {
    numbers.push(Math.floor(Math.random() * 9) + 1);
  }
  if (!isSolvable(numbers)) {
    return generateNumbers();
  }
  return numbers;
};

export const randomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return `#${color}`;
};
