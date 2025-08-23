import { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

type Translations = {
  common: {
    language: string;
    theme: string;
    light: string;
    dark: string;
    home: string;
    loading: string;
    error: string;
    success: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  homepage: {
    title: string;
    subtitle: string;
    problemList: string;
    problems: string;
    difficulty: {
      Easy: string;
      Medium: string;
      Hard: string;
    };
  };
  problemPage: {
    description: string;
    examples: string;
    solution: string;
    showSolution: string;
    hideSolution: string;
    solutionHidden: string;
    example: string;
    input: string;
    output: string;
  };
  codeRunner: {
    title: string;
    submit: string;
    running: string;
    testResults: string;
    passed: string;
    failed: string;
    testCase: string;
    expected: string;
    actual: string;
    executionTime: string;
    ms: string;
    runningTests: string;
    runError: string;
    networkError: string;
    totalExecutionTime: string;
    averageTime: string;
    memoryUsed: string;
    totalMemory: string;
    input: string;
  };
  tags: {
    [key: string]: string;
  };
};
type TranslationKey = keyof Translations;
type NestedTranslationKey<T> = T extends object ? keyof T : never;

interface I18nContextType {
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
  switchLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<string, Translations> = {
  zh: {
    common: {
      language: '语言',
      theme: '主题',
      light: '亮色',
      dark: '暗色',
      home: '首页',
      loading: '加载中...',
      error: '错误',
      success: '成功'
    },
    header: {
      title: '离线 LeetCode 练习',
      subtitle: '本地题库，支持在浏览器内编辑并运行测试（JavaScript）'
    },
    homepage: {
      title: '🚀 离线 LeetCode 练习',
      subtitle: '本地题库，支持在浏览器内编辑并运行测试（JavaScript）',
      problemList: '📚 题目列表',
      problems: '题',
      difficulty: {
        Easy: '简单',
        Medium: '中等',
        Hard: '困难'
      }
    },
    problemPage: {
      description: '题目描述',
      examples: '示例',
      solution: '参考解法',
      showSolution: '显示解法',
      hideSolution: '隐藏解法',
      solutionHidden: '点击上方按钮查看参考解法（建议先自己尝试解决）',
      example: '示例',
      input: '输入',
      output: '输出'
    },
    codeRunner: {
      title: '💻 代码编辑器',
      submit: '🚀 提交并运行测试',
      running: '运行中...',
      testResults: '📋 测试结果',
      passed: '通过',
      failed: '失败',
      testCase: '测试用例',
      expected: '期望输出',
      actual: '实际输出',
      executionTime: '执行时间',
      ms: '毫秒',
      runningTests: '正在运行测试...',
      runError: '运行错误',
      networkError: '运行失败，请检查网络连接',
      totalExecutionTime: '总执行时间',
      averageTime: '平均时间',
      memoryUsed: '内存使用',
      totalMemory: '总内存',
      input: '输入'
    },
    tags: {
      'array': '数组',
      'hash-table': '哈希表',
      'math': '数学',
      'string': '字符串',
      'stack': '栈',
      'linked-list': '链表',
      'recursion': '递归',
      'two-pointers': '双指针',
      'binary-search': '二分查找',
      'divide-and-conquer': '分治',
      'dynamic-programming': '动态规划',
      'memoization': '记忆化'
    }
  },
  en: {
    common: {
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      home: 'Home',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },
    header: {
      title: 'Offline LeetCode Practice',
      subtitle: 'Local problem set, supports editing and running tests in browser (JavaScript)'
    },
    homepage: {
      title: '🚀 Offline LeetCode Practice',
      subtitle: 'Local problem set, supports editing and running tests in browser (JavaScript)',
      problemList: '📚 Problem List',
      problems: 'problems',
      difficulty: {
        Easy: 'Easy',
        Medium: 'Medium',
        Hard: 'Hard'
      }
    },
    problemPage: {
      description: 'Problem Description',
      examples: 'Examples',
      solution: 'Reference Solution',
      showSolution: 'Show Solution',
      hideSolution: 'Hide Solution',
      solutionHidden: 'Click the button above to view the reference solution (try solving it yourself first)',
      example: 'Example',
      input: 'Input',
      output: 'Output'
    },
    codeRunner: {
      title: '💻 Code Editor',
      submit: '🚀 Submit & Run Tests',
      running: 'Running...',
      testResults: '📋 Test Results',
      passed: 'Passed',
      failed: 'Failed',
      testCase: 'Test Case',
      expected: 'Expected Output',
      actual: 'Actual Output',
      executionTime: 'Execution Time',
      ms: 'ms',
      runningTests: 'Running tests...',
      runError: 'Runtime Error',
      networkError: 'Failed to run, please check network connection',
      totalExecutionTime: 'Total Execution Time',
      averageTime: 'Average Time',
      memoryUsed: 'Memory Used',
      totalMemory: 'Total Memory',
      input: 'Input'
    },
    tags: {
      'array': 'Array',
      'hash-table': 'Hash Table',
      'math': 'Math',
      'string': 'String',
      'stack': 'Stack',
      'linked-list': 'Linked List',
      'recursion': 'Recursion',
      'two-pointers': 'Two Pointers',
      'binary-search': 'Binary Search',
      'divide-and-conquer': 'Divide and Conquer',
      'dynamic-programming': 'Dynamic Programming',
      'memoization': 'Memoization'
    }
  }
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { locale = 'zh' } = router;

  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          break;
        }
      }
      
      if (typeof value === 'string') {
        // 简单的参数替换
        if (params) {
          return Object.entries(params).reduce(
            (str, [paramKey, paramValue]) => 
              str.replace(`{{${paramKey}}}`, String(paramValue)),
            value
          );
        }
        return value;
      }
      
      // 如果找不到翻译，返回key或者使用中文作为fallback
      if (locale !== 'zh') {
        let fallbackValue: any = translations.zh;
        for (const k of keys) {
          if (fallbackValue && typeof fallbackValue === 'object') {
            fallbackValue = fallbackValue[k];
          } else {
            break;
          }
        }
        if (typeof fallbackValue === 'string') {
          return fallbackValue;
        }
      }
      
      return key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const switchLocale = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <I18nContext.Provider value={{ locale, t, switchLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// 便捷的翻译hook
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}