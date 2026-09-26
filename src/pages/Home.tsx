import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Scroll, Feather } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="max-w-2xl w-full mx-4">
        {/* 开卷：墨团自中心晕开成整幅卷面 */}
        <motion.div
          initial={{ clipPath: 'circle(4% at 50% 42%)', opacity: 0.5 }}
          animate={{ clipPath: 'circle(130% at 50% 42%)', opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="paper-noise bg-[#faf8f3] border-4 border-double border-[#8b7355] rounded-lg p-4 sm:p-6 md:p-12 drop-shadow-2xl relative"
        >
          <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#8b7355]/30 rounded pointer-events-none" />

          {/* 装帧角花 */}
          <span aria-hidden className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#8b7355]" />
          <span aria-hidden className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#8b7355]" />
          <span aria-hidden className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#8b7355]" />
          <span aria-hidden className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#8b7355]" />

          {/* 引首章「史」：压轴落印 */}
          <motion.div
            initial={{ scale: 1.9, opacity: 0, rotate: -22 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ delay: 1.15, type: 'spring', stiffness: 300, damping: 13 }}
            className="absolute top-5 right-5 md:top-7 md:right-7 z-10 w-11 h-11 md:w-14 md:h-14 bg-[#9e2b25] rounded-md shadow-lg flex items-center justify-center"
          >
            <span className="font-serif font-bold text-[#f5f0e6] text-lg md:text-2xl">史</span>
          </motion.div>

          {/* 竖排题词（大屏可见） */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="hidden lg:block absolute left-5 top-1/2 -translate-y-1/2 text-[#8b7355]/55 text-xs tracking-[0.3em] font-serif select-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            以史为镜可以知兴替
          </motion.div>
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.65, duration: 0.8 }}
            className="hidden lg:block absolute right-5 top-1/2 -translate-y-1/2 text-[#8b7355]/55 text-xs tracking-[0.3em] font-serif select-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            读史使人明智
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-6 md:mb-8"
          >
            <div className="h-px bg-[#8b7355] flex-1" />
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#8b7355]" />
            <div className="h-px bg-[#8b7355] flex-1" />
          </motion.div>

          {/* 标题逐字晕开：墨迹聚焦感 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3d2914] text-center mb-2 md:mb-3 tracking-wide font-serif">
            {'16型历史学人格测试'.split('').map((c, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.35 + i * 0.055, duration: 0.4, ease: 'easeOut' }}
              >
                {c}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs sm:text-sm text-[#8b7355] text-center mb-3 md:mb-4 italic"
          >
            The Historian Personality Test
          </motion.p>

          {/* 标题下的毛笔划线：双笔触自己画出来 */}
          <svg viewBox="0 0 220 14" className="w-40 md:w-52 h-3.5 mx-auto mb-6 md:mb-8" aria-hidden>
            <motion.path
              d="M4 8 C 60 3, 160 11, 216 6"
              stroke="#8b7355"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.05, duration: 0.6, ease: 'easeOut' }}
            />
            <motion.path
              d="M34 11 C 92 7, 152 12, 196 9"
              stroke="#8b7355"
              strokeWidth="1"
              opacity="0.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.25, duration: 0.5, ease: 'easeOut' }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-[#5c4033] text-center space-y-3 md:space-y-4 mb-8 md:mb-10 leading-relaxed"
          >
            <p className="text-sm sm:text-base">
              本测试基于四大维度、32道精心设计的题目，
              <br className="hidden sm:block" />
              精准定位你的历史学人格类型。
            </p>
            <p className="text-xs sm:text-sm text-[#8b7355]">
              你将与16位史学宗师中的某一位产生共鸣——
              <br className="hidden sm:block" />
              陈寅恪、钱穆、布罗代尔、黄仁宇……
            </p>
            <div className="flex items-center justify-center gap-4 md:gap-6 text-xs text-[#8b7355] mt-4 md:mt-6">
              <span className="flex items-center gap-1 md:gap-2">
                <Feather className="w-3 h-3 md:w-4 md:h-4" />
                32道题目
              </span>
              <span className="flex items-center gap-1 md:gap-2">
                <Scroll className="w-3 h-3 md:w-4 md:h-4" />
                5-8分钟
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => navigate('/test')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="btn-breathe w-full sm:w-auto px-6 sm:px-10 py-3 bg-[#8b4513] text-[#f5f0e6] font-serif text-sm sm:text-base
                rounded-sm transition-colors duration-300 hover:bg-[#6b3410]"
            >
              <span className="flex items-center justify-center gap-2 md:gap-3">
                <Scroll className="w-4 h-4 md:w-5 md:h-5" />
                开始测试
                <Scroll className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 md:mt-8 text-center text-xs text-[#8b7355]"
          >
            <span className="inline-block border-t border-b border-[#8b7355]/30 px-4 py-1">
              探索你的历史思维密码
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
