import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, RotateCcw } from 'lucide-react';
import type { TestResult, Personality } from '../types';
import { getPersonalityByCode, getPersonalitiesByCodes } from '../utils/calculateResult';
import { DimensionChart } from '../components/DimensionChart';
import { ShareModal } from '../components/ShareModal';

/** 印章周围的墨点飞溅 */
const inkDots = [
  { size: 6, x: '-30%', y: '-18%', delay: 0.72 },
  { size: 4, x: '112%', y: '-8%', delay: 0.78 },
  { size: 5, x: '104%', y: '96%', delay: 0.74 },
  { size: 3, x: '-22%', y: '104%', delay: 0.82 },
  { size: 3, x: '50%', y: '-30%', delay: 0.8 },
];

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    let parsed: TestResult | null = null;
    try {
      const raw = localStorage.getItem('historian_mbti_result');
      if (raw) {
        const data = JSON.parse(raw);
        // 基本结构校验，防止损坏的缓存导致页面崩溃
        if (data && typeof data.code === 'string' && data.scores && data.dimensions) {
          parsed = data as TestResult;
        }
      }
    } catch {
      parsed = null;
    }

    if (parsed) {
      setResult(parsed);
    } else {
      navigate('/test');
    }
  }, [navigate]);

  if (!result) return null;

  const personalities: Personality[] = result.isComposite && result.compositeCodes
    ? getPersonalitiesByCodes(result.compositeCodes.slice(0, 2))
    : [getPersonalityByCode(result.code)].filter(Boolean) as Personality[];

  const handleRestart = () => {
    localStorage.removeItem('historian_mbti_result');
    localStorage.removeItem('historian_mbti_answers');
    localStorage.removeItem('historian_mbti_seed');
    navigate('/test');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 py-4 md:py-8 px-3 md:px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex items-center justify-between"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors font-serif text-sm md:text-base"
          >
            <ArrowLeft size={18} />
            返回首页
          </button>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-900 transition-colors font-serif text-xs md:text-sm"
            >
              <Share2 size={16} />
              分享
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 border-2 border-amber-800 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors font-serif text-xs md:text-sm"
            >
              <RotateCcw size={16} />
              重测
            </button>
          </div>
        </motion.div>

        {/* 结果卷轴：从中间向两侧展开 */}
        <motion.div
          initial={{ clipPath: 'inset(0 50% 0 50%)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0% 0 0%)', opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          className="paper-noise bg-stone-50 border-4 border-double border-amber-800 rounded-lg p-3 sm:p-4 md:p-8 shadow-2xl mb-6"
        >
          <div className="text-center mb-6">
            <p className="text-amber-700 font-serif mb-4 text-sm md:text-base">你的历史学人格</p>

            {/* 篆刻印章：延迟落印 */}
            <div className="relative inline-block">
              {inkDots.map((dot, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute rounded-full bg-[#9e2b25]"
                  style={{ width: dot.size, height: dot.size, left: dot.x, top: dot.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0, 0.7, 0.45] }}
                  transition={{ delay: dot.delay, duration: 0.3 }}
                />
              ))}
              <motion.div
                initial={{ scale: 2.1, opacity: 0, rotate: -14 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 16 }}
                className="inline-flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 bg-[#9e2b25] rounded-lg shadow-xl"
              >
                <div className="w-[86%] h-[86%] border-2 border-[#f5f0e6]/60 rounded grid grid-cols-2 place-items-center p-2">
                  {result.code.split('').map((ch, i) => (
                    <span key={i} className="font-serif font-bold text-3xl sm:text-4xl leading-none text-[#f5f0e6]">
                      {ch}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {result.isComposite && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-amber-600 mt-3 text-xs md:text-sm"
              >
                复合型人格
              </motion.p>
            )}
          </div>

          <div className="h-px bg-amber-800/30 mb-6" />

          {personalities.map((p, index) => (
            <motion.div
              key={p.code}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 + index * 0.15 }}
              className="mb-6 last:mb-0"
            >
              <div className="flex items-center gap-3 mb-4">
                {/* 史学家首字方印：与顶部大印章呼应 */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#9e2b25] rounded-md -rotate-3 shadow flex items-center justify-center text-[#f5f0e6] text-base sm:text-lg md:text-xl font-bold font-serif flex-shrink-0">
                  {p.historian.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900 font-serif truncate">{p.tag}</h2>
                  <p className="text-amber-700 text-xs sm:text-sm md:text-base truncate">代表人物：{p.historian}</p>
                </div>
              </div>

              <p className="text-stone-700 leading-relaxed mb-4 text-xs sm:text-sm md:text-base">{p.description}</p>

              <div className="grid sm:grid-cols-2 gap-3 md:gap-6">
                <div className="bg-amber-100/50 rounded-lg p-3 md:p-4">
                  <h3 className="font-bold text-amber-900 mb-2 md:mb-3 font-serif text-xs sm:text-sm md:text-base">核心特质</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.traits.map(t => (
                      <span key={t} className="px-2 md:px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs md:text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-100/50 rounded-lg p-3 md:p-4">
                  <h3 className="font-bold text-amber-900 mb-2 md:mb-3 font-serif text-xs sm:text-sm md:text-base">适合方向</h3>
                  <ul className="text-stone-700 space-y-1 text-xs sm:text-sm md:text-base">
                    {p.suitableFor.slice(0, 3).map(s => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.15 }}
          className="paper-noise bg-stone-50 border-2 border-amber-800/30 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-amber-900 mb-4 md:mb-6 text-center tracking-wide">维度分析</h2>
          <DimensionChart result={result} />
        </motion.div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        result={result}
      />
    </motion.div>
  );
}
