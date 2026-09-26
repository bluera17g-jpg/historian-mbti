import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, Share2 } from 'lucide-react';
import type { TestResult, Personality } from '../types';
import { generateShareText, getPersonalityByCode, getPersonalitiesByCodes } from '../utils/calculateResult';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, result }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = generateShareText(result);

  const getPersonalities = (): Personality[] => {
    if (result.isComposite && result.compositeCodes) {
      return getPersonalitiesByCodes(result.compositeCodes.slice(0, 2));
    }
    const p = getPersonalityByCode(result.code);
    return p ? [p] : [];
  };

  const personalities = getPersonalities();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleDownload = () => {
    if (!cardRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    // 复古纸张背景
    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 边框
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 内边框
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // 标题
    ctx.fillStyle = '#3d2914';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('历史学人格测试', canvas.width / 2, 80);

    // 人格代码
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#8b4513';
    ctx.fillText(result.code, canvas.width / 2, 150);

    // 史学家
    ctx.font = '24px serif';
    ctx.fillStyle = '#5c4033';
    const historianText = personalities.map(p => p.historian).join(' + ');
    ctx.fillText(historianText, canvas.width / 2, 200);

    // 标签
    ctx.font = '20px serif';
    ctx.fillStyle = '#8b7355';
    const tagText = personalities.map(p => p.tag).join(' / ');
    ctx.fillText(tagText, canvas.width / 2, 240);

    // 描述
    ctx.font = '18px serif';
    ctx.fillStyle = '#3d2914';
    const desc = personalities[0]?.description || '';
    const words = desc.slice(0, 60) + '...';
    ctx.fillText(words, canvas.width / 2, 300);

    // 底部
    ctx.font = '16px serif';
    ctx.fillStyle = '#8b7355';
    ctx.fillText('测测你的历史学人格', canvas.width / 2, 420);

    const link = document.createElement('a');
    link.download = `历史学人格_${result.code}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="paper-noise relative w-full max-w-md bg-[#f5f0e6] rounded-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* 复古边框装饰 */}
            <div className="absolute inset-2 border-2 border-[#8b7355] rounded pointer-events-none" />
            <div className="absolute inset-4 border border-[#8b7355]/50 rounded pointer-events-none" />

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-[#8b7355] hover:text-[#5c4033] transition-colors"
            >
              <X size={20} />
            </button>

            {/* 内容 */}
            <div className="p-8 pt-12">
              <div className="text-center mb-6">
                <Share2 className="w-8 h-8 mx-auto mb-3 text-[#8b4513]" />
                <h3 className="text-xl font-serif text-[#3d2914]">分享你的历史学人格</h3>
              </div>

              {/* 结果卡片预览：与结果页统一的小方印 */}
              <div
                ref={cardRef}
                className="bg-[#faf8f3] border-2 border-[#8b7355] rounded p-6 mb-6 text-center"
              >
                <div className="text-sm text-[#8b7355] mb-3 font-serif">我的历史学人格</div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#9e2b25] rounded-md -rotate-3 shadow mb-3">
                  <span className="font-serif font-bold text-xl tracking-widest text-[#f5f0e6]">{result.code}</span>
                </div>
                <div className="text-[#5c4033] font-serif">
                  {personalities.map(p => p.historian).join(' + ')}
                </div>
                <div className="text-sm text-[#8b7355] mt-1">
                  {personalities.map(p => p.tag).join(' / ')}
                </div>
              </div>

              {/* 分享文本 */}
              <div className="bg-[#faf8f3] border border-[#d4c4a8] rounded p-4 mb-6">
                <p className="text-sm text-[#5c4033] leading-relaxed">{shareText}</p>
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8b4513] text-[#f5f0e6] rounded hover:bg-[#6b3410] transition-colors font-serif"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? '已复制' : '复制文本'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#8b4513] text-[#8b4513] rounded hover:bg-[#8b4513] hover:text-[#f5f0e6] transition-colors font-serif"
                >
                  <Download size={18} />
                  保存图片
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
