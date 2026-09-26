import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { TestResult } from '../types';

interface DimensionChartProps {
  result: TestResult;
}

// 轴序：相对极点拨到直径两端（S-P、F-I、O-H、Y-E 各隔 180°），
// 形状往哪边鼓就偏向哪边，越接近圆越均衡，避免相邻对极造成的锯齿极端感
const AXIS_ORDER = ['S', 'F', 'O', 'Y', 'P', 'I', 'H', 'E'] as const;

const POLE_NAMES: Record<string, string> = {
  S: '学斋向内', P: '公众向外',
  F: '实证考据', I: '阐释解读',
  O: '客观中立', H: '人文关怀',
  Y: '体系建构', E: '开放探索'
};

const DIMENSION_TITLES: { key: 'SP' | 'FI' | 'OH' | 'YE'; title: string }[] = [
  { key: 'SP', title: '能量指向' },
  { key: 'FI', title: '核心方法' },
  { key: 'OH', title: '价值立场' },
  { key: 'YE', title: '认知模式' }
];

export const DimensionChart: React.FC<DimensionChartProps> = ({ result }) => {
  const { scores, dimensions } = result;

  // 每极满分为 8，统一换算为百分比展示
  const toPercent = (v: number) => Math.round((v / 8) * 100);

  const data = AXIS_ORDER.map(type => ({
    dimension: POLE_NAMES[type],
    value: toPercent(scores[type]),
    baseline: 50,
    type
  }));

  const getDimensionStyle = (type: string) => {
    const dimMap: Record<string, keyof typeof dimensions> = {
      S: 'SP', P: 'SP',
      F: 'FI', I: 'FI',
      O: 'OH', H: 'OH',
      Y: 'YE', E: 'YE'
    };
    const dim = dimensions[dimMap[type]];
    if (dim.winner === type) return 'text-amber-700 font-bold';
    if (dim.winner === 'balanced') return 'text-amber-600';
    return 'text-stone-500';
  };

  const isBalanced = (key: 'SP' | 'FI' | 'OH' | 'YE') => dimensions[key].winner === 'balanced';

  return (
    <div className="w-full">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#d6c4a8" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'serif' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            {/* 50% 均衡基准环：越贴合虚线越均衡 */}
            <Radar
              name="均衡线"
              dataKey="baseline"
              stroke="#c9b99a"
              strokeDasharray="5 5"
              strokeWidth={1}
              fill="none"
              fillOpacity={0}
              isAnimationActive={false}
            />
            <Radar
              name="得分"
              dataKey="value"
              stroke="#92400e"
              fill="#92400e"
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        {DIMENSION_TITLES.map(({ key, title }, idx) => {
          const [pos, neg] = key.split('');
          const posScore = scores[pos as keyof typeof scores];
          const negScore = scores[neg as keyof typeof scores];
          const total = posScore + negScore;
          const posPct = total > 0 ? (posScore / total) * 100 : 50;
          return (
            <div key={key} className="bg-stone-100 p-3 rounded border border-stone-200">
              <div className="text-stone-600 text-xs mb-1.5 flex items-center gap-1.5">
                {title}
                {isBalanced(key) && (
                  <span className="px-1.5 py-px bg-amber-200 text-amber-800 rounded text-[10px] leading-4">均衡</span>
                )}
              </div>
              {/* 动态发散条：宽度即左右占比，加载时生长 */}
              <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mb-1.5">
                <motion.div
                  className="h-full bg-amber-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${posPct}%` }}
                  transition={{ delay: 0.15 + idx * 0.1, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between">
                <span className={getDimensionStyle(pos)}>{POLE_NAMES[pos]} {posScore}</span>
                <span className="text-stone-400">|</span>
                <span className={getDimensionStyle(neg)}>{POLE_NAMES[neg]} {negScore}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
