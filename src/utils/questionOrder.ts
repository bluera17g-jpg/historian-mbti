import type { Question, UserAnswers } from '../types';

/**
 * 出题顺序与定位工具。
 *
 * 题目进入测试页时会被乱序，因此「题序位置」（1 起始，用于翻页与进度圆点）
 * 与「题目 id」（题库中的固定编号，用于计分）是两套编号，必须用本模块的
 * 换算函数转换，不能互相替代。
 */

/** 种子化伪随机数生成器：同一 seed 必然产出同一序列 */
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates 洗牌：返回新数组，不改动入参，穿插各维度题目以隐藏出题规律 */
export function shuffleWithSeed<T>(list: readonly T[], seed: number): T[] {
  const result = [...list];
  const rng = mulberry32(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 第一道未答题的题序位置（1 起始）；全部已答返回 0 */
export function firstUnansweredPosition(order: readonly Question[], answers: UserAnswers): number {
  return order.findIndex(q => !answers[q.id]) + 1;
}
