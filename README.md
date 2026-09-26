# 16 型历史学人格测试 · historian-mbti

[![CI](https://github.com/bluera17g-jpg/historian-mbti/actions/workflows/ci.yml/badge.svg)](https://github.com/bluera17g-jpg/historian-mbti/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

一个纯前端的「历史学人格」测试：**32 道题 → 4 个维度 → 16 种史家人格**，测测你的史学气质更像陈寅恪、钱穆，还是布罗代尔、黄仁宇。

无后端、无账号、无埋点。答题记录只存在浏览器 localStorage 里，关闭页面即随你处置。

## 特性

- **四维十六型**：能量指向 / 核心方法 / 价值立场 / 认知模式，四个维度交叉出 16 种人格，每种对应一位史学宗师。
- **复合人格**：当 2 个及以上维度出现均衡时，输出由两极组合而成的复合结果（例如「陈寅恪 + 陈垣」的结合体）。
- **题目乱序**：进入测试时用种子化 Fisher-Yates 洗牌打散 32 题，并隐藏题目所属维度，避免选项被出题规律暗示；同一轮刷新页面题序保持一致。
- **进度可跳转**：底部进度圆点支持任意跳题；若最后一题已答但仍有遗漏，会自动跳回第一道未答题。
- **断点续答**：答题进度实时落盘，刷新或误关页面后可从第一道未答题继续。
- **结果与会话**：雷达图（对极轴 + 50% 均衡基准环）展示维度倾向，附人格描述、核心特质与适合方向；支持复制分享文案与生成分享图片。
- **水墨视觉**：宣纸噪点、朱红印章、开卷揭示、墨色扫场等动效，并遵循 `prefers-reduced-motion`。

## 计分规则

每个维度 8 道题，每题 1 分：选 A 计首极点，选 B 计次极点，两极得分相加恒为 8 分。

| 维度 | 首极点 (A) | 次极点 (B) |
| --- | --- | --- |
| 能量指向 SP | S 学斋向内型 | P 公众向外型 |
| 核心方法 FI | F 实证考据型 | I 阐释解读型 |
| 价值立场 OH | O 客观中立型 | H 人文关怀型 |
| 认知模式 YE | Y 体系建构型 | E 开放探索型 |

判定规则：

- 分差 ≥ 2 分：该维度确定为主导取向；
- 分差 ≤ 1 分（含 0 分）：该维度记为「均衡」，两极倾向兼有；
- 出现 2 个及以上均衡维度：输出**复合人格**，由均衡维度的两极组合而成；
- 仅 1 个均衡维度：按两极高者归入单一人格，两极同分时取首极点。

### 16 种人格

| 代码 | 人格 | 代表人物 |
| --- | --- | --- |
| SFOY | 正统史学宗师 | 陈寅恪 |
| SFOE | 文献考据大家 | 陈垣 |
| SFHY | 温情制度史家 | 田余庆 |
| SFHE | 微观叙事大师 | 史景迁 |
| SIOY | 宏观结构奠基人 | 布罗代尔 |
| SIOE | 新视角解构者 | 罗志田 |
| SIHY | 思想文化史家 | 余英时 |
| SIHE | 思想史探微者 | 王汎森 |
| PFOY | 国民通识宗师 | 钱穆 |
| PFOE | 通俗考据名家 | 葛剑雄 |
| PFHY | 国民历史教师 | 王立群 |
| PFHE | 公共良知史家 | 秦晖 |
| PIOY | 大历史架构师 | 黄仁宇 |
| PIOE | 思想解构先锋 | 福柯 |
| PIHY | 公共史学良心 | 托尼·朱特 |
| PIHE | 文明通识大家 | 许倬云 |

## 技术栈

React 18 · TypeScript（strict）· Webpack 5（手写配置 + Babel）· Tailwind CSS · framer-motion · Recharts · lucide-react · React Router 6（HashRouter）

## 快速开始

环境要求：Node.js ≥ 20、pnpm（推荐用 `corepack enable` 启用，无需全局安装）。

```bash
pnpm install     # 安装依赖
pnpm dev         # 启动开发服务器 http://localhost:3266
pnpm typecheck   # 类型检查（tsc --noEmit）
pnpm build       # 生产构建，产物输出到 dist/
```

构建产物是纯静态文件，可直接部署到任何静态托管（Netlify / Vercel / GitHub Pages / Nginx）。

> 路由使用 HashRouter（URL 形如 `/#/test`），因此部署时**不需要**配置服务端 history fallback。
> 如需改成 BrowserRouter，请自行补上「所有路径回落到 index.html」的重写规则。

## 目录结构

```
.
├── index.html                  HTML 模板（内联底色，避免首屏白闪）
├── src
│   ├── index.tsx               应用入口
│   ├── App.tsx                 路由、页面骨架与全局水墨动效
│   ├── pages                   Home / Test / Result / About
│   ├── components              Header / Footer / QuestionCard / DimensionChart / ShareModal
│   ├── hooks/useTest.ts        答题状态（题序位置、答题记录、翻页）
│   ├── utils
│   │   ├── questionOrder.ts    种子洗牌与「题目 id ↔ 题序位置」换算
│   │   └── calculateResult.ts  计分、人格查表、分享文案
│   ├── data
│   │   ├── questions.ts        4 维度 × 8 题 = 32 题
│   │   └── personalities.ts    16 种人格文案
│   ├── types/index.ts          共享类型
│   └── styles/index.css        Tailwind 入口与宣纸纹理
├── webpack.config.js           构建配置（开发端口 3266）
├── tailwind.config.js / postcss.config.js / tsconfig.json
└── .github/workflows/ci.yml    类型检查 + 生产构建
```

## 数据与隐私

所有状态都在浏览器本地，不会上传到任何服务器：

| localStorage key | 内容 |
| --- | --- |
| `historian_mbti_answers` | 已答题目（题目 id → A/B） |
| `historian_mbti_result` | 最近一次结果（代码、分数、维度判定） |
| `historian_mbti_seed` | 本轮题序随机种子 |

结果页的「重测」会清除以上三项。读取本地数据时均做了结构校验，缓存损坏时会安全回退到测试页。

## 开发约定

- **题序位置 ≠ 题目 id**：题目进入测试页时会被乱序，翻页与进度圆点使用的是「题序位置」（1 起始），计分使用的是「题目 id」。两者换算必须走 `src/utils/questionOrder.ts`，不要互相替代——历史上这里出过一次「点圆点跳到别的题」的 bug。
- 新增题目后无需改题数：题目总数由 `questionsData` 推导。
- 计分依赖「题目 id → 维度」映射表，因此题库可以任意增删或调整顺序。

## 贡献

欢迎提 Issue / PR。提交前请确保：

```bash
pnpm typecheck && pnpm build
```

均无报错（CI 也会跑这两项）。

## License

[MIT](./LICENSE)
