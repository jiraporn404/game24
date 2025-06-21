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
      results.push(eval(`${a}${op1}${b}${op2}${c}${op3}${d}`));
      results.push(eval(`(${a}${op1}${b})${op2}(${c}${op3}${d})`));
      results.push(eval(`((${a}${op1}${b})${op2}${c})${op3}${d}`));
      results.push(eval(`${a}${op1}((${b}${op2}${c})${op3}${d})`));
      results.push(eval(`${a}${op1}(${b}${op2}(${c}${op3}${d}))`));
    } catch (e) {}

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

export function solve24(nums: number[]): boolean {
  if (nums.length === 0) return false;
  const EPS = 1e-6;

  function combine(a: number, b: number): number[] {
    const results = [a + b, a - b, b - a, a * b];
    if (Math.abs(b) > EPS) results.push(a / b);
    if (Math.abs(a) > EPS) results.push(b / a);
    results.push(Math.pow(a, b));
    results.push(Math.pow(b, a));
    return results;
  }

  function helper(arr: number[]): boolean {
    if (arr.length === 1) {
      return Math.abs(arr[0] - 24) < EPS;
    }

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const rest = arr.filter((_, idx) => idx !== i && idx !== j);
        for (const val of combine(arr[i], arr[j])) {
          rest.push(val);
          if (helper(rest)) return true;
          rest.pop();
        }
      }
    }

    return false;
  }

  function genSqrts(input: number[]): number[][] {
    const n = input.length,
      res: number[][] = [];
    const total = 1 << n;
    for (let mask = 0; mask < total; mask++) {
      const arr2 = input.map((v, idx) =>
        (mask >> idx) & 1 ? Math.sqrt(v) : v
      );
      res.push(arr2);
    }
    return res;
  }

  for (const variant of genSqrts(nums)) {
    if (helper(variant)) return true;
  }

  return false;
}
