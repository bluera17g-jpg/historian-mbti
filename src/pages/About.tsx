import { motion } from 'framer-motion';
import { BookOpen, Users, Scale } from 'lucide-react';
import { personalitiesData } from '../data/personalities';

export default function About() {
  const historians = personalitiesData.personalities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="paper-noise bg-stone-50 border-4 border-double border-amber-800 rounded-lg p-4 md:p-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-serif text-amber-900 text-center mb-6 md:mb-8 tracking-wide">关于本测试</h1>

        <section className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
            <h2 className="text-lg md:text-xl font-serif text-amber-900">测试原理</h2>
          </div>
          <p className="text-stone-700 leading-relaxed mb-4">
            本测试基于四大维度、32道精心设计的题目，精准定位你的历史学人格类型。
            每个维度包含8道题目，通过分差判定规则确定你的主导取向。
            题目在答题时随机乱序呈现，且不显示所属维度，避免选项被规律暗示。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-amber-100/50 p-4 rounded border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">能量指向</h3>
              <p className="text-sm text-stone-600">学斋向内型 vs 公众向外型</p>
            </div>
            <div className="bg-amber-100/50 p-4 rounded border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">核心方法</h3>
              <p className="text-sm text-stone-600">实证考据型 vs 阐释解读型</p>
            </div>
            <div className="bg-amber-100/50 p-4 rounded border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">价值立场</h3>
              <p className="text-sm text-stone-600">客观中立型 vs 人文关怀型</p>
            </div>
            <div className="bg-amber-100/50 p-4 rounded border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">认知模式</h3>
              <p className="text-sm text-stone-600">体系建构型 vs 开放探索型</p>
            </div>
          </div>
        </section>

        <section className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
            <h2 className="text-lg md:text-xl font-serif text-amber-900">16位史学宗师</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {historians.map((h, i) => (
              <motion.div
                key={h.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 p-2 md:p-3 bg-white rounded border border-stone-200 hover:border-amber-400 transition-colors"
              >
                <span className="text-amber-700 font-bold font-mono text-xs flex-shrink-0">{h.code}</span>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="font-bold text-stone-800 text-xs md:text-sm truncate">{h.historian}</div>
                  <div className="text-xs text-stone-600 truncate">{h.tag}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Scale className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
            <h2 className="text-lg md:text-xl font-serif text-amber-900">计分规则</h2>
          </div>
          <ul className="text-stone-700 space-y-2 list-disc list-inside text-sm md:text-base">
            <li>每个维度 8 道题，每题 1 分：选 A 计首极点，选 B 计次极点，两极得分相加恒为 8 分</li>
            <li>分差 ≥ 2 分：该维度确定为主导取向</li>
            <li>分差 ≤ 1 分（含 0 分）：该维度记为「均衡」，两极倾向兼有</li>
            <li>出现 2 个及以上均衡维度：输出复合人格，由均衡维度的两极组合而成</li>
            <li>仅 1 个均衡维度：按两极高者归入单一人格，两极同分时取首极点</li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
}
