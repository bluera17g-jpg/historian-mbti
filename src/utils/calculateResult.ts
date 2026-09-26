import type { UserAnswers, TestResult, Personality } from '../types';
import { personalitiesData } from '../data/personalities';
import { questionsData } from '../data/questions';

// 题目 ID → 所属维度（如 "SP"）。题目乱序后不能再靠题号范围计分
const QUESTION_DIMENSION = new Map<number, string>();
questionsData.dimensions.forEach(d => {
  d.questions.forEach(q => QUESTION_DIMENSION.set(q.id, d.id));
});

export function calculateResult(answers: UserAnswers): TestResult {
  const scores = {
    S: 0, P: 0,
    F: 0, I: 0,
    O: 0, H: 0,
    Y: 0, E: 0
  };

  // 按题目所属维度累加：A 计向首极点，B 计向次极点
  for (const [idStr, answer] of Object.entries(answers)) {
    if (!answer) continue;
    const dimId = QUESTION_DIMENSION.get(Number(idStr));
    if (!dimId) continue;
    if (answer === 'A') scores[dimId[0] as keyof typeof scores]++;
    else scores[dimId[1] as keyof typeof scores]++;
  }

  // 计算各维度结果
  const spDiff = scores.S - scores.P;
  const fiDiff = scores.F - scores.I;
  const ohDiff = scores.O - scores.H;
  const yeDiff = scores.Y - scores.E;

  const spWinner = spDiff >= 2 ? 'S' : spDiff <= -2 ? 'P' : 'balanced';
  const fiWinner = fiDiff >= 2 ? 'F' : fiDiff <= -2 ? 'I' : 'balanced';
  const ohWinner = ohDiff >= 2 ? 'O' : ohDiff <= -2 ? 'H' : 'balanced';
  const yeWinner = yeDiff >= 2 ? 'Y' : yeDiff <= -2 ? 'E' : 'balanced';

  // 统计均衡/双倾向维度数量
  const balancedCount = [
    spWinner === 'balanced',
    fiWinner === 'balanced',
    ohWinner === 'balanced',
    yeWinner === 'balanced'
  ].filter(Boolean).length;

  // 生成人格代码
  let code = '';
  const compositeCodes: string[] = [];

  // 处理每个维度
  const dimensions = [
    { winner: spWinner, pos: 'S', neg: 'P' },
    { winner: fiWinner, pos: 'F', neg: 'I' },
    { winner: ohWinner, pos: 'O', neg: 'H' },
    { winner: yeWinner, pos: 'Y', neg: 'E' }
  ];

  // 如果有2个及以上均衡维度，生成复合人格
  if (balancedCount >= 2) {
    // 生成所有可能的组合：非均衡维度取胜出项，均衡维度取两极
    const getOptions = (dim: typeof dimensions[0]): string[] => {
      if (dim.winner !== 'balanced') return [dim.winner];
      return [dim.pos, dim.neg];
    };

    const spOptions = getOptions(dimensions[0]);
    const fiOptions = getOptions(dimensions[1]);
    const ohOptions = getOptions(dimensions[2]);
    const yeOptions = getOptions(dimensions[3]);

    for (const s of spOptions) {
      for (const f of fiOptions) {
        for (const o of ohOptions) {
          for (const y of yeOptions) {
            compositeCodes.push(s + f + o + y);
          }
        }
      }
    }
    code = compositeCodes[0];
  } else {
    // 单一人格
    code = dimensions.map(d => {
      if (d.winner === 'balanced') {
        // 选择得分更高的，如果相等则选正向
        if (d.pos === 'S') return scores.S >= scores.P ? 'S' : 'P';
        if (d.pos === 'F') return scores.F >= scores.I ? 'F' : 'I';
        if (d.pos === 'O') return scores.O >= scores.H ? 'O' : 'H';
        return scores.Y >= scores.E ? 'Y' : 'E';
      }
      return d.winner;
    }).join('');
  }

  return {
    code,
    scores,
    dimensions: {
      SP: { winner: spWinner as 'S' | 'P' | 'balanced', diff: Math.abs(spDiff) },
      FI: { winner: fiWinner as 'F' | 'I' | 'balanced', diff: Math.abs(fiDiff) },
      OH: { winner: ohWinner as 'O' | 'H' | 'balanced', diff: Math.abs(ohDiff) },
      YE: { winner: yeWinner as 'Y' | 'E' | 'balanced', diff: Math.abs(yeDiff) }
    },
    isComposite: balancedCount >= 2,
    compositeCodes: balancedCount >= 2 ? compositeCodes : undefined
  };
}

export function getPersonalityByCode(code: string): Personality | null {
  const personalities = personalitiesData.personalities;
  return personalities.find(p => p.code === code) || null;
}

export function getPersonalitiesByCodes(codes: string[]): Personality[] {
  const personalities = personalitiesData.personalities;
  return codes.map(code => personalities.find(p => p.code === code)).filter(Boolean) as Personality[];
}

export function generateShareText(result: TestResult): string {
  const { code, isComposite } = result;

  if (isComposite && result.compositeCodes) {
    const personalities = getPersonalitiesByCodes(result.compositeCodes.slice(0, 2));
    const names = personalities.map(p => p.historian).join(' + ');
    return `我的历史学人格是【${code}】复合型，像${names}的结合体。快来测测你的历史学人格吧！`;
  }

  const personality = getPersonalityByCode(code);
  if (personality) {
    return `我的历史学人格是【${code}】${personality.tag}，像${personality.historian}。快来测测你的历史学人格吧！`;
  }

  return `我的历史学人格是【${code}】。快来测测你的历史学人格吧！`;
}
