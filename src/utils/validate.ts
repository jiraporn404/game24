import { evaluate } from "mathjs";

export const isValidate24 = (expression: string): boolean => {
  try {
    const result = evaluate(expression);
    return Math.abs(result - 24) < 1e-6;
  } catch (error) {
    return false;
  }
};

export const isSolvable = (numbers: number[]): boolean => {
  const ops = ["+", "-", "*", "/"];

  // Generate all permutations of 4 numbers
  function permute(nums: number[]): number[][] {
    if (nums.length === 1) return [nums];
    const result: number[][] = [];
    for (let i = 0; i < nums.length; i++) {
      const rest = [...nums.slice(0, i), ...nums.slice(i + 1)];
      const restPerm = permute(rest);
      for (const perm of restPerm) {
        result.push([nums[i], ...perm]);
      }
    }
    return result;
  }

  // Try all operator combinations
  function getOpCombos(): string[][] {
    const result: string[][] = [];
    for (const op1 of ops) {
      for (const op2 of ops) {
        for (const op3 of ops) {
          result.push([op1, op2, op3]);
        }
      }
    }
    return result;
  }

  // Try all possible grouping of expressions
  function evalExpression(
    a: number,
    b: number,
    c: number,
    d: number,
    ops: string[]
  ): number[] {
    const [op1, op2, op3] = ops;
    const results = [];

    try {
      results.push(eval(`${a}${op1}${b}${op2}${c}${op3}${d}`)); // ((a op1 b) op2 c) op3 d
      results.push(eval(`(${a}${op1}${b})${op2}(${c}${op3}${d})`)); // (a op1 b) op2 (c op3 d)
      results.push(eval(`((${a}${op1}${b})${op2}${c})${op3}${d}`)); // ((a op1 b) op2 c) op3 d
      results.push(eval(`${a}${op1}((${b}${op2}${c})${op3}${d})`)); // a op1 ((b op2 c) op3 d)
      results.push(eval(`${a}${op1}(${b}${op2}(${c}${op3}${d}))`)); // a op1 (b op2 (c op3 d))
    } catch (e) {
      // Ignore division by zero and invalid expressions
    }

    return results;
  }

  const perms = permute(numbers);
  const opCombos = getOpCombos();

  for (const nums of perms) {
    for (const ops of opCombos) {
      const results = evalExpression(nums[0], nums[1], nums[2], nums[3], ops);
      for (const r of results) {
        if (Math.abs(r - 24) < 1e-6) {
          return true;
        }
      }
    }
  }

  return false;
};
