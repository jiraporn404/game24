export const generateNumbers = (): number[] => {
  const numbers = [];
  for (let i = 0; i < 4; i++) {
    numbers.push(Math.floor(Math.random() * 9) + 1);
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

// Helper: Generate a random integer from 1 to 9
const randomNumber = (): number => Math.floor(Math.random() * 9) + 1;

// Helper: Generate 4 random numbers
const generateRandomSet = (): number[] => {
  return Array.from({ length: 4 }, randomNumber);
};

// Solver: Check if 4 numbers can make 24
const canMake24 = (nums: number[]): boolean => {
  const EPSILON = 1e-6;

  const helper = (arr: number[]): boolean => {
    if (arr.length === 1) {
      return Math.abs(arr[0] - 24) < EPSILON;
    }

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i === j) continue;

        const rest = arr.filter((_, k) => k !== i && k !== j);
        const a = arr[i];
        const b = arr[j];

        const results = [
          a + b,
          a - b,
          b - a,
          a * b,
          ...(b !== 0 ? [a / b] : []),
          ...(a !== 0 ? [b / a] : []),
        ];

        for (const result of results) {
          if (helper([...rest, result])) return true;
        }
      }
    }

    return false;
  };

  return helper(nums);
};

// Final function: Generate numbers guaranteed to solve Game 24
export const generateSolvable24Numbers = (): number[] => {
  let nums: number[] = [];
  let tries = 0;
  do {
    nums = generateRandomSet();
    tries++;
  } while (!canMake24(nums) && tries < 10000); // limit retries just in case

  return nums;
};
