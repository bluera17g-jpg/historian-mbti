import { useState, useCallback } from 'react';
import type { UserAnswers } from '../types';
import { questionsData } from '../data/questions';

/** 题目总数由题库推导，避免与数据脱节 */
export const TOTAL_QUESTIONS = questionsData.dimensions.flatMap(d => d.questions).length;

/**
 * 答题状态。
 *
 * 注意：题目在进入测试页时会被乱序，因此 `currentIndex` 表示的是
 * **乱序后的题序位置（1 起始）**，不是题目 id。题目 id 到位置的换算
 * 由持有乱序结果的页面负责（见 pages/Test.tsx 的 positionOf）。
 */
export function useTest() {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(1);

  const answerQuestion = useCallback((questionId: number, answer: 'A' | 'B') => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, TOTAL_QUESTIONS));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 1));
  }, []);

  const goToIndex = useCallback((index: number) => {
    if (index >= 1 && index <= TOTAL_QUESTIONS) {
      setCurrentIndex(index);
    }
  }, []);

  const progress = Object.keys(answers).length;

  return {
    answers,
    currentIndex,
    progress,
    totalQuestions: TOTAL_QUESTIONS,
    answerQuestion,
    goToNext,
    goToPrev,
    goToIndex
  };
}
