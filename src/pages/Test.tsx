import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { QuestionCard } from '../components/QuestionCard';
import { useTest } from '../hooks/useTest';
import { calculateResult } from '../utils/calculateResult';
import { shuffleWithSeed, firstUnansweredPosition } from '../utils/questionOrder';
import { questionsData } from '../data/questions';
import type { Question, UserAnswers } from '../types';

const ANSWERS_KEY = 'historian_mbti_answers';
const RESULT_KEY = 'historian_mbti_result';
const SEED_KEY = 'historian_mbti_seed';

/** 题库全集（32 题），乱序前的原始顺序 */
const ALL_QUESTIONS = questionsData.dimensions.flatMap(d => d.questions);

/** 安全读取本地答题记录，损坏时返回 null */
function loadSavedAnswers(): UserAnswers | null {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const valid: UserAnswers = {};
    for (const [id, answer] of Object.entries(parsed)) {
      const qid = Number(id);
      if (Number.isInteger(qid) && (answer === 'A' || answer === 'B')) {
        valid[qid] = answer;
      }
    }
    return Object.keys(valid).length > 0 ? valid : null;
  } catch {
    return null;
  }
}

export default function Test() {
  const navigate = useNavigate();
  const {
    answers,
    currentIndex,
    progress,
    answerQuestion,
    goToNext,
    goToPrev,
    goToIndex
  } = useTest();

  const [order, setOrder] = useState<Question[]>([]);

  // 防止快速双击导致跳题/重复提交
  const isTransitioning = useRef(false);

  // 初始化：取种子乱序题目 + 恢复答题记录 + 跳到第一道未答的题
  useEffect(() => {
    let seed = Number(localStorage.getItem(SEED_KEY));
    if (!Number.isInteger(seed) || seed <= 0) {
      seed = Math.floor(Math.random() * 2 ** 31);
      localStorage.setItem(SEED_KEY, String(seed));
    }
    const shuffled = shuffleWithSeed(ALL_QUESTIONS, seed);
    setOrder(shuffled);

    const saved = loadSavedAnswers();
    if (saved) {
      Object.entries(saved).forEach(([id, answer]) => {
        answerQuestion(Number(id), answer as 'A' | 'B');
      });
      // 题目已乱序：题目 id 与题序位置不再等价，必须换算后再跳转
      const resumePosition = firstUnansweredPosition(shuffled, saved);
      if (resumePosition > 0) {
        goToIndex(resumePosition);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalQuestions = order.length;
  const currentQ = order[currentIndex - 1];

  const finishTest = (finalAnswers: UserAnswers) => {
    const result = calculateResult(finalAnswers);
    localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    navigate('/result');
  };

  const handleSelect = (answer: 'A' | 'B') => {
    if (isTransitioning.current || !currentQ) return;
    isTransitioning.current = true;

    answerQuestion(currentQ.id, answer);
    const updatedAnswers = { ...answers, [currentQ.id]: answer };
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(updatedAnswers));

    setTimeout(() => {
      isTransitioning.current = false;
      if (currentIndex < totalQuestions) {
        goToNext();
      } else if (Object.keys(updatedAnswers).length >= totalQuestions) {
        finishTest(updatedAnswers);
      } else {
        // 最后一题已答但前面有遗漏（通过圆点跳转造成），回到第一道未答的题
        const missedPosition = firstUnansweredPosition(order, updatedAnswers);
        if (missedPosition > 0) goToIndex(missedPosition);
      }
    }, 300);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < totalQuestions) return;
    finishTest(answers);
  };

  if (!currentQ) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 py-4 sm:py-8 px-2 sm:px-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-amber-800 hover:text-amber-900 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="font-serif text-sm">返回</span>
          </button>
          <div className="text-amber-800 font-serif text-xs sm:text-sm">
            {progress}/{totalQuestions}
          </div>
        </div>

        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <QuestionCard
            question={currentQ}
            currentAnswer={answers[currentQ.id] as 'A' | 'B' | null}
            questionNumber={currentIndex}
            totalQuestions={totalQuestions}
            onSelect={handleSelect}
          />
        </motion.div>

        <div className="flex items-center justify-between mt-6 gap-2">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 1}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-3 bg-white border-2 border-amber-300
              text-amber-800 rounded-lg font-serif transition-all text-sm
              hover:border-amber-500 hover:bg-amber-50
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            上一题
          </button>

          {currentIndex === totalQuestions ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < totalQuestions}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-6 py-3 bg-amber-800 text-amber-50
                rounded-lg font-serif transition-all hover:bg-amber-900 text-sm
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              查看结果
            </button>
          ) : (
            <button
              onClick={goToNext}
              disabled={currentIndex === totalQuestions}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-3 bg-white border-2 border-amber-300
                text-amber-800 rounded-lg font-serif transition-all text-sm
                hover:border-amber-500 hover:bg-amber-50
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一题
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {order.map((q, index) => (
            <button
              key={q.id}
              onClick={() => goToIndex(index + 1)}
              aria-label={`第 ${index + 1} 题${answers[q.id] ? '（已答）' : '（未答）'}`}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                q.id === currentQ.id
                  ? 'bg-amber-800 scale-125'
                  : answers[q.id]
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
