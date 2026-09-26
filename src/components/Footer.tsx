import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-100/90 backdrop-blur-sm border-t border-amber-800/20"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xs text-amber-800/60 font-serif">
          16型历史学人格测试
        </div>
        <div className="text-[10px] text-amber-800/20 font-serif tracking-wider">
          author：asukasuki
        </div>
        <div className="text-xs text-amber-800/40 font-serif">
          探索你的历史思维密码
        </div>
      </div>
    </motion.footer>
  );
}
