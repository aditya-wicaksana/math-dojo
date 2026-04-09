import { nanoid } from 'nanoid'
import type { TopicId, Difficulty } from '../store/types'
import type { TFunction } from '../i18n'

export interface Problem {
  id: string
  topicId: TopicId
  grade: number
  difficulty: Difficulty
  questionText: string
  answer: number | string
  answerType: 'integer' | 'fraction'
  hintSteps: string[]
  visualType: 'number-line' | 'array-dots' | 'fraction-bar' | 'none'
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

// Operand ranges per grade+difficulty
const ADD_RANGES: Record<number, Record<Difficulty, [number, number]>> = {
  1: { easy: [1, 9],  medium: [1, 19],  hard: [10, 20]  },
  2: { easy: [1, 49], medium: [1, 99],  hard: [10, 99]  },
  3: { easy: [1, 99], medium: [1, 199], hard: [50, 200] },
  4: { easy: [1, 199],medium: [1, 499], hard: [100,500] },
  5: { easy: [1, 499],medium: [1, 999], hard: [200,999] },
  6: { easy: [1, 499],medium: [1, 999], hard: [200,999] },
}
const MUL_RANGES: Record<number, Record<Difficulty, [number, number]>> = {
  3: { easy: [2, 5],  medium: [2, 9],   hard: [2, 12]  },
  4: { easy: [2, 9],  medium: [2, 12],  hard: [3, 12]  },
  5: { easy: [2, 9],  medium: [2, 12],  hard: [3, 12]  },
  6: { easy: [2, 9],  medium: [2, 12],  hard: [3, 12]  },
}
const DIV_RANGES: Record<number, Record<Difficulty, [number, number]>> = {
  3: { easy: [2, 5],  medium: [2, 9],   hard: [2, 12]  },
  4: { easy: [2, 9],  medium: [2, 12],  hard: [3, 12]  },
  5: { easy: [2, 9],  medium: [2, 12],  hard: [3, 12]  },
  6: { easy: [2, 9],  medium: [2, 12],  hard: [3, 12]  },
}

function makeAddition(grade: number, difficulty: Difficulty): Problem {
  const range = ADD_RANGES[grade]?.[difficulty] ?? ADD_RANGES[2][difficulty]
  const a = randInt(range[0], range[1])
  const b = randInt(range[0], range[1])
  const answer = a + b
  return {
    id: nanoid(6),
    topicId: 'addition',
    grade,
    difficulty,
    questionText: `${a} + ${b} = ?`,
    answer,
    answerType: 'integer',
    hintSteps: [
      `Start with ${a}`,
      `Count up ${b} more`,
      `${a} + ${b} = ${answer}`,
    ],
    visualType: grade <= 2 ? 'number-line' : 'none',
  }
}

function makeSubtraction(grade: number, difficulty: Difficulty): Problem {
  const range = ADD_RANGES[grade]?.[difficulty] ?? ADD_RANGES[2][difficulty]
  let a = randInt(range[0], range[1])
  let b = randInt(range[0], range[1])
  if (b > a) [a, b] = [b, a]
  const answer = a - b
  return {
    id: nanoid(6),
    topicId: 'subtraction',
    grade,
    difficulty,
    questionText: `${a} − ${b} = ?`,
    answer,
    answerType: 'integer',
    hintSteps: [
      `Start with ${a}`,
      `Take away ${b}`,
      `${a} − ${b} = ${answer}`,
    ],
    visualType: grade <= 2 ? 'number-line' : 'none',
  }
}

function makeMultiplication(grade: number, difficulty: Difficulty): Problem {
  const range = MUL_RANGES[grade]?.[difficulty] ?? MUL_RANGES[3][difficulty]
  const a = randInt(range[0], range[1])
  const b = randInt(range[0], range[1])
  const answer = a * b
  return {
    id: nanoid(6),
    topicId: 'multiplication',
    grade,
    difficulty,
    questionText: `${a} × ${b} = ?`,
    answer,
    answerType: 'integer',
    hintSteps: [
      `Think of ${a} groups of ${b}`,
      `Add ${b} a total of ${a} times`,
      `${a} × ${b} = ${answer}`,
    ],
    visualType: difficulty === 'easy' ? 'array-dots' : 'none',
  }
}

function makeDivision(grade: number, difficulty: Difficulty): Problem {
  const range = DIV_RANGES[grade]?.[difficulty] ?? DIV_RANGES[3][difficulty]
  const divisor = randInt(range[0], range[1])
  const quotient = randInt(1, 10)
  const dividend = divisor * quotient
  return {
    id: nanoid(6),
    topicId: 'division',
    grade,
    difficulty,
    questionText: `${dividend} ÷ ${divisor} = ?`,
    answer: quotient,
    answerType: 'integer',
    hintSteps: [
      `How many groups of ${divisor} fit in ${dividend}?`,
      `${divisor} × ? = ${dividend}`,
      `${dividend} ÷ ${divisor} = ${quotient}`,
    ],
    visualType: 'none',
  }
}

function makeFractions(grade: number, difficulty: Difficulty): Problem {
  if (grade <= 3 || difficulty === 'easy') {
    // Identify / compare simple fraction
    const denom = randInt(2, 4)
    const numer = randInt(1, denom - 1)
    const whole = randInt(2, 8)
    const answer = Math.round((numer / denom) * whole)
    return {
      id: nanoid(6),
      topicId: 'fractions',
      grade,
      difficulty,
      questionText: `What is ${numer}/${denom} of ${whole}?`,
      answer,
      answerType: 'integer',
      hintSteps: [
        `Divide ${whole} into ${denom} equal parts`,
        `Each part = ${whole}/${denom} = ${Math.round(whole / denom)}`,
        `Take ${numer} parts: ${numer} × ${Math.round(whole / denom)} = ${answer}`,
      ],
      visualType: 'fraction-bar',
    }
  }
  if (difficulty === 'medium') {
    // Add fractions with same denominator
    const denom = randInt(2, 8)
    const n1 = randInt(1, denom - 1)
    const n2 = randInt(1, denom - 1)
    const rawNum = n1 + n2
    const g = gcd(rawNum, denom)
    const answerNum = rawNum / g
    const answerDen = denom / g
    const answerStr = answerDen === 1 ? `${answerNum}` : `${answerNum}/${answerDen}`
    return {
      id: nanoid(6),
      topicId: 'fractions',
      grade,
      difficulty,
      questionText: `${n1}/${denom} + ${n2}/${denom} = ?`,
      answer: answerStr,
      answerType: 'fraction',
      hintSteps: [
        `Same denominator: keep ${denom}`,
        `Add numerators: ${n1} + ${n2} = ${rawNum}`,
        `Simplify: ${rawNum}/${denom} = ${answerStr}`,
      ],
      visualType: 'fraction-bar',
    }
  }
  // Hard: unlike denominators
  const d1 = randInt(2, 6)
  const d2 = randInt(2, 6)
  const n1 = randInt(1, d1 - 1)
  const n2 = randInt(1, d2 - 1)
  const commonDen = lcm(d1, d2)
  const rawNum = (n1 * (commonDen / d1)) + (n2 * (commonDen / d2))
  const g = gcd(rawNum, commonDen)
  const answerNum = rawNum / g
  const answerDen = commonDen / g
  const answerStr = answerDen === 1 ? `${answerNum}` : `${answerNum}/${answerDen}`
  return {
    id: nanoid(6),
    topicId: 'fractions',
    grade,
    difficulty,
    questionText: `${n1}/${d1} + ${n2}/${d2} = ?`,
    answer: answerStr,
    answerType: 'fraction',
    hintSteps: [
      `Find common denominator: ${d1} and ${d2} → LCD = ${commonDen}`,
      `Convert: ${n1}/${d1} = ${n1 * (commonDen / d1)}/${commonDen}, ${n2}/${d2} = ${n2 * (commonDen / d2)}/${commonDen}`,
      `Add: ${rawNum}/${commonDen} = ${answerStr}`,
    ],
    visualType: 'fraction-bar',
  }
}

function makeGeometry(grade: number, difficulty: Difficulty): Problem {
  const maxDim = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 15 : 20
  const w = randInt(2, maxDim)
  const h = randInt(2, maxDim)
  const isArea = Math.random() > 0.5
  if (isArea) {
    const answer = w * h
    return {
      id: nanoid(6),
      topicId: 'geometry',
      grade,
      difficulty,
      questionText: `A rectangle is ${w} units wide and ${h} units tall. What is its area?`,
      answer,
      answerType: 'integer',
      hintSteps: [
        `Area = width × height`,
        `Width = ${w}, Height = ${h}`,
        `Area = ${w} × ${h} = ${answer}`,
      ],
      visualType: 'none',
    }
  } else {
    const answer = 2 * (w + h)
    return {
      id: nanoid(6),
      topicId: 'geometry',
      grade,
      difficulty,
      questionText: `A rectangle is ${w} units wide and ${h} units tall. What is its perimeter?`,
      answer,
      answerType: 'integer',
      hintSteps: [
        `Perimeter = 2 × (width + height)`,
        `Width = ${w}, Height = ${h}`,
        `Perimeter = 2 × (${w} + ${h}) = 2 × ${w + h} = ${answer}`,
      ],
      visualType: 'none',
    }
  }
}

function makePlaceValue(grade: number, difficulty: Difficulty): Problem {
  const num = grade <= 2 || difficulty === 'easy'
    ? randInt(10, 99)
    : difficulty === 'medium'
      ? randInt(100, 999)
      : randInt(1000, 9999)
  const digits = num.toString()
  const positions = ['ones', 'tens', 'hundreds', 'thousands']
  const pos = randInt(0, Math.min(digits.length - 1, 3))
  const digit = Number(digits[digits.length - 1 - pos])
  const value = digit * Math.pow(10, pos)
  return {
    id: nanoid(6),
    topicId: 'place-value',
    grade,
    difficulty,
    questionText: `In the number ${num}, what is the value of the digit in the ${positions[pos]} place?`,
    answer: value,
    answerType: 'integer',
    hintSteps: [
      `The number ${num} has ${digits.length} digits`,
      `The ${positions[pos]} place is the ${pos + 1}${pos === 0 ? 'st' : pos === 1 ? 'nd' : pos === 2 ? 'rd' : 'th'} digit from the right`,
      `That digit is ${digit}, so its value is ${digit} × ${Math.pow(10, pos)} = ${value}`,
    ],
    visualType: 'none',
  }
}

function makeTime(_grade: number, difficulty: Difficulty): Problem {
  const hour = randInt(1, 12)
  const minuteStep = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 15 : 5
  const minutes = randInt(0, 11) * minuteStep
  const addMinutes = randInt(1, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 8 : 12) * minuteStep
  const totalMin = hour * 60 + minutes + addMinutes
  const newHour = Math.floor(totalMin / 60) % 12 || 12
  const newMin = totalMin % 60
  const fmt = (h: number, m: number) => `${h}:${m.toString().padStart(2, '0')}`
  return {
    id: nanoid(6),
    topicId: 'time',
    grade: _grade,
    difficulty,
    questionText: `It is ${fmt(hour, minutes)}. What time will it be in ${addMinutes} minutes?`,
    answer: fmt(newHour, newMin),
    answerType: 'fraction', // reuse 'fraction' for string answers
    hintSteps: [
      `Start at ${fmt(hour, minutes)}`,
      `Add ${addMinutes} minutes`,
      `New time: ${fmt(newHour, newMin)}`,
    ],
    visualType: 'none',
  }
}

function makeMoney(_grade: number, difficulty: Difficulty): Problem {
  const prices = difficulty === 'easy'
    ? [10, 25, 50, 75, 100]
    : difficulty === 'medium'
      ? [15, 30, 45, 60, 80, 120]
      : [125, 175, 225, 350, 475]
  const item1 = prices[randInt(0, prices.length - 1)]
  const item2 = prices[randInt(0, prices.length - 1)]
  const total = item1 + item2
  return {
    id: nanoid(6),
    topicId: 'money',
    grade: _grade,
    difficulty,
    questionText: `You buy something for ${item1}¢ and another for ${item2}¢. How many cents do you spend in total?`,
    answer: total,
    answerType: 'integer',
    hintSteps: [
      `First item: ${item1}¢`,
      `Second item: ${item2}¢`,
      `Total: ${item1} + ${item2} = ${total}¢`,
    ],
    visualType: 'none',
  }
}

function makeWordProblem(grade: number, difficulty: Difficulty, t: TFunction): Problem {
  const ops: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> =
    grade <= 2
      ? ['addition', 'subtraction']
      : ['addition', 'subtraction', 'multiplication', 'division']
  const op = ops[randInt(0, ops.length - 1)]
  const aMax = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100
  const bMax = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50
  const a = randInt(bMax + 1, aMax)
  const b = randInt(2, bMax)
  let answer: number
  let template: string

  if (op === 'addition') {
    answer = a + b
    template = t(`wordProblems.addition_${difficulty}`, { a, b })
  } else if (op === 'subtraction') {
    answer = a - b
    template = t(`wordProblems.subtraction_${difficulty}`, { a, b })
  } else if (op === 'multiplication') {
    const mul_a = randInt(2, 10)
    const mul_b = randInt(2, 10)
    answer = mul_a * mul_b
    template = t(`wordProblems.multiplication_${difficulty}`, { a: mul_a, b: mul_b })
  } else {
    const divisor = randInt(2, 10)
    const quotient = randInt(2, 10)
    const dividend = divisor * quotient
    answer = quotient
    template = t(`wordProblems.division_${difficulty}`, { a: dividend, b: divisor })
  }

  return {
    id: nanoid(6),
    topicId: 'word-problems',
    grade,
    difficulty,
    questionText: template,
    answer,
    answerType: 'integer',
    hintSteps: [
      `Read the problem carefully`,
      `Find the key numbers`,
      `The answer is ${answer}`,
    ],
    visualType: 'none',
  }
}

function makePatterns(_grade: number, difficulty: Difficulty): Problem {
  const step = difficulty === 'easy' ? randInt(1, 5) : difficulty === 'medium' ? randInt(2, 10) : randInt(3, 15)
  const start = randInt(1, 10)
  const seqLength = 4
  const seq = Array.from({ length: seqLength }, (_, i) => start + i * step)
  const next = start + seqLength * step
  return {
    id: nanoid(6),
    topicId: 'patterns',
    grade: _grade,
    difficulty,
    questionText: `What comes next? ${seq.join(', ')}, ?`,
    answer: next,
    answerType: 'integer',
    hintSteps: [
      `Look at the differences between numbers`,
      `Each number increases by ${step}`,
      `Next number: ${seq[seq.length - 1]} + ${step} = ${next}`,
    ],
    visualType: 'none',
  }
}

export function generateProblem(
  topicId: TopicId,
  grade: number,
  difficulty: Difficulty,
  t: TFunction,
): Problem {
  switch (topicId) {
    case 'addition':      return makeAddition(grade, difficulty)
    case 'subtraction':   return makeSubtraction(grade, difficulty)
    case 'multiplication':return makeMultiplication(grade, difficulty)
    case 'division':      return makeDivision(grade, difficulty)
    case 'fractions':     return makeFractions(grade, difficulty)
    case 'geometry':      return makeGeometry(grade, difficulty)
    case 'place-value':   return makePlaceValue(grade, difficulty)
    case 'time':          return makeTime(grade, difficulty)
    case 'money':         return makeMoney(grade, difficulty)
    case 'word-problems': return makeWordProblem(grade, difficulty, t)
    case 'patterns':      return makePatterns(grade, difficulty)
  }
}

export function generateSession(
  topicId: TopicId,
  grade: number,
  difficulty: Difficulty,
  t: TFunction,
  count = 10,
): Problem[] {
  const problems: Problem[] = []
  const seen = new Set<string>()
  let attempts = 0
  while (problems.length < count && attempts < count * 5) {
    attempts++
    const p = generateProblem(topicId, grade, difficulty, t)
    const key = p.questionText
    if (!seen.has(key)) {
      seen.add(key)
      problems.push(p)
    }
  }
  return problems
}

export function checkAnswer(problem: Problem, userInput: string): boolean {
  const normalized = userInput.trim().replace(/\s+/g, '')
  if (typeof problem.answer === 'number') {
    const num = parseFloat(normalized)
    return !isNaN(num) && num === problem.answer
  }
  // String answer (time, fraction)
  return normalized.toLowerCase() === String(problem.answer).toLowerCase()
}
