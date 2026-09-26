import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Scroll, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/test', label: '开始测试' },
    { path: '/about', label: '关于' }
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#f5f0e6]/95 backdrop-blur-sm border-b-2 border-[#8b7355]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#8b4513] rounded flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#f5f0e6]" />
            </div>
            <span className="font-serif text-lg text-[#3d2914] font-bold group-hover:text-[#8b4513] transition-colors">
              历史学人格测试
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 font-serif text-sm transition-all rounded ${
                  location.pathname === item.path
                    ? 'text-[#8b4513] bg-[#e8dcc8]'
                    : 'text-[#5c4033] hover:text-[#8b4513] hover:bg-[#e8dcc8]/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5c4033] hover:text-[#8b4513]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            to="/test"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#8b4513] text-[#f5f0e6] rounded font-serif text-sm hover:bg-[#6b3410] transition-colors"
          >
            <Scroll className="w-4 h-4" />
            开始测试
          </Link>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#f5f0e6] border-b-2 border-[#8b7355] shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-serif text-sm rounded transition-all ${
                    location.pathname === item.path
                      ? 'text-[#8b4513] bg-[#e8dcc8]'
                      : 'text-[#5c4033] hover:text-[#8b4513] hover:bg-[#e8dcc8]/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/test"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8b4513] text-[#f5f0e6] rounded font-serif text-sm"
              >
                <Scroll className="w-4 h-4" />
                开始测试
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
