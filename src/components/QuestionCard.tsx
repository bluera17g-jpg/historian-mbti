import React from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  currentAnswer: 'A' | 'B' | null;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (answer: 'A' | 'B') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  questionNumber,
  totalQuestions,
  onSelect
}) => {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* 进度条（答题阶段不展示维度信息，避免提示倾向） */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2 text-xs sm:text-sm text-stone-600 font-serif">
          <span>第 {questionNumber} 题</span>
          <span>共 {totalQuestions} 题</span>
        </div>
        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="relative h-full bg-amber-700"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* 墨滴笔尖：进度生长时像毛笔运笔 */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-2.5 h-2.5 rounded-full bg-amber-700" />
          </motion.div>
        </div>
      </div>

      {/* 题目 */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-2xl font-serif text-stone-800 leading-relaxed text-center">
          {question.text}
        </h2>
      </div>

      {/* 选项（题目切换时 key 变化会自动重放入场动画，无需 AnimatePresence） */}
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <motion.button
          key={`${question.id}-A`}
          onClick={() => onSelect('A')}
          className={`w-full p-3 sm:p-4 md:p-6 text-left rounded-lg border-2 transition-all duration-300 min-h-[56px] sm:min-h-[64px] md:min-h-[80px] ${
            currentAnswer === 'A'
              ? 'border-amber-700 bg-amber-50 shadow-sm'
              : 'border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center font-serif text-xs sm:text-sm transition-all duration-300 ${
              currentAnswer === 'A'
                ? 'bg-[#9e2b25] text-[#f5f0e6] rounded-md -rotate-3 shadow-sm'
                : 'bg-stone-100 text-stone-600 rounded-full'
            }`}>
              A
            </span>
            <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed pt-0.5">
              {question.optionA}
            </p>
          </div>
        </motion.button>

        <motion.button
          key={`${question.id}-B`}
          onClick={() => onSelect('B')}
          className={`w-full p-3 sm:p-4 md:p-6 text-left rounded-lg border-2 transition-all duration-300 min-h-[56px] sm:min-h-[64px] md:min-h-[80px] ${
            currentAnswer === 'B'
              ? 'border-amber-700 bg-amber-50 shadow-sm'
              : 'border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
            <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center font-serif text-xs sm:text-sm transition-all duration-300 ${
              currentAnswer === 'B'
                ? 'bg-[#9e2b25] text-[#f5f0e6] rounded-md -rotate-3 shadow-sm'
                : 'bg-stone-100 text-stone-600 rounded-full'
            }`}>
              B
            </span>
            <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed pt-0.5">
              {question.optionB}
            </p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
