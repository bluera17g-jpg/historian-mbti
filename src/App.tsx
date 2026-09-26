import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import Home from './pages/Home';
import Test from './pages/Test';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';

// 结果页单独分包：recharts 体积大，只有查看结果时才加载
const Result = lazy(() => import('./pages/Result'));

/** 路由切换时的水墨扫场：墨色自上而下揭开新页面 */
function InkReveal({ routeKey }: { routeKey: string }) {
  return (
    <motion.div
      key={routeKey}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] bg-[#2b2018]"
      initial={{ clipPath: 'inset(0 0 0 0)' }}
      animate={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

/** 背景呼吸墨迹：极慢速漂浮的模糊墨渍，让宣纸背景「活」起来 */
type InkSpot = {
  size: number;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  duration: number;
  dx: number[];
  dy: number[];
};

const inkSpots: InkSpot[] = [
  { size: 420, left: '-6%', top: '12%', duration: 26, dx: [0, 36, -18, 0], dy: [0, -28, 16, 0] },
  { size: 340, right: '-8%', top: '46%', duration: 32, dx: [0, -30, 22, 0], dy: [0, 24, -20, 0] },
  { size: 380, left: '30%', bottom: '-12%', duration: 38, dx: [0, 24, -30, 0], dy: [0, -20, 26, 0] },
];

function InkDrift() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* 巨型笔触：横贯画面的一笔，载入时缓缓画出 */}
      <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <motion.path
          d="M-60 640 C 220 540, 400 720, 630 560 S 940 360, 1120 280"
          stroke="#5c4033"
          strokeWidth="52"
          fill="none"
          strokeLinecap="round"
          opacity="0.07"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.2 }}
        />
      </svg>
      {inkSpots.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#5c4033]"
          style={{
            width: s.size,
            height: s.size,
            left: s.left,
            right: s.right,
            top: s.top,
            bottom: s.bottom,
            filter: 'blur(90px)',
            opacity: 0.07
          }}
          animate={{ x: s.dx, y: s.dy }}
          transition={{ duration: s.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  return (
    <>
      <InkReveal routeKey={location.pathname} />
      <InkDrift />
      <div className="min-h-screen bg-[#f5f0e6] text-[#3d3d3d] font-serif">
        <div className="fixed inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <Header />
        <main className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <span className="font-serif text-[#8b7355]">结果生成中…</span>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<Test />} />
                <Route path="/result" element={<Result />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell />
      </HashRouter>
    </MotionConfig>
  );
}

export default App;
