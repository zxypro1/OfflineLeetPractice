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
    addProblem: string;
    search: string;
    searchPlaceholder: string;
    filterByDifficulty: string;
    filterByTags: string;
    allDifficulties: string;
    allTags: string;
    clearFilters: string;
    noResults: string;
    showingResults: string;
    of: string;
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
  addProblem: {
    title: string;
    manualForm: string;
    importJson: string;
    uploadJsonFile: string;
    selectJsonFile: string;
    pasteJson: string;
    importJsonButton: string;
    basicInformation: string;
    problemId: string;
    problemIdHint: string;
    difficulty: string;
    titles: string;
    englishTitle: string;
    chineseTitle: string;
    tagsLabel: string;
    tagsPlaceholder: string;
    descriptions: string;
    englishDescription: string;
    chineseDescription: string;
    testCases: string;
    input: string;
    expectedOutput: string;
    removeTestCase: string;
    addTestCase: string;
    addProblemButton: string;
    addingProblem: string;
    problemAddedSuccess: string;
    invalidJsonFormat: string;
    jsonImportedSuccess: string;
    networkError: string;
    backToProblems: string;
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
      addProblem: '添加题目',
      search: '搜索',
      searchPlaceholder: '搜索题目标题或描述...',
      filterByDifficulty: '按难度筛选',
      filterByTags: '按标签筛选',
      allDifficulties: '所有难度',
      allTags: '所有标签',
      clearFilters: '清除筛选',
      noResults: '没有找到匹配的题目',
      showingResults: '显示',
      of: '共',
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
    },
    addProblem: {
      title: '添加新题目',
      manualForm: '手动表单',
      importJson: '导入JSON',
      uploadJsonFile: '上传JSON文件：',
      selectJsonFile: '选择JSON文件',
      pasteJson: '或粘贴JSON：',
      importJsonButton: '导入JSON',
      basicInformation: '基本信息',
      problemId: '题目ID：',
      problemIdHint: '仅使用小写字母、数字和连字符',
      difficulty: '难度：',
      titles: '标题',
      englishTitle: '英文标题：',
      chineseTitle: '中文标题：',
      tagsLabel: '标签（逗号分隔）：',
      tagsPlaceholder: '例如：array, hash-table',
      descriptions: '描述',
      englishDescription: '英文描述：',
      chineseDescription: '中文描述：',
      testCases: '测试用例：',
      input: '输入：',
      expectedOutput: '期望输出：',
      removeTestCase: '删除测试用例',
      addTestCase: '添加测试用例',
      addProblemButton: '添加题目',
      addingProblem: '正在添加题目...',
      problemAddedSuccess: '题目添加成功！ID: {{id}}',
      invalidJsonFormat: 'JSON格式无效',
      jsonImportedSuccess: 'JSON导入成功',
      networkError: '网络错误',
      backToProblems: '返回题目列表'
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
      addProblem: 'Add Problem',
      search: 'Search',
      searchPlaceholder: 'Search problem title or description...',
      filterByDifficulty: 'Filter by Difficulty',
      filterByTags: 'Filter by Tags',
      allDifficulties: 'All Difficulties',
      allTags: 'All Tags',
      clearFilters: 'Clear Filters',
      noResults: 'No matching problems found',
      showingResults: 'Showing',
      of: 'of',
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
    },
    addProblem: {
      title: 'Add New Problem',
      manualForm: 'Manual Form',
      importJson: 'Import JSON',
      uploadJsonFile: 'Upload JSON File:',
      selectJsonFile: 'Select JSON file',
      pasteJson: 'Or paste JSON:',
      importJsonButton: 'Import JSON',
      basicInformation: 'Basic Information',
      problemId: 'Problem ID:',
      problemIdHint: 'Use lowercase letters, numbers, and hyphens only',
      difficulty: 'Difficulty:',
      titles: 'Titles',
      englishTitle: 'English Title:',
      chineseTitle: 'Chinese Title:',
      tagsLabel: 'Tags (comma-separated):',
      tagsPlaceholder: 'e.g., array, hash-table',
      descriptions: 'Descriptions',
      englishDescription: 'English Description:',
      chineseDescription: 'Chinese Description:',
      testCases: 'Test Cases:',
      input: 'Input:',
      expectedOutput: 'Expected Output:',
      removeTestCase: 'Remove Test Case',
      addTestCase: 'Add Test Case',
      addProblemButton: 'Add Problem',
      addingProblem: 'Adding Problem...',
      problemAddedSuccess: 'Problem added successfully! ID: {{id}}',
      invalidJsonFormat: 'Invalid JSON format',
      jsonImportedSuccess: 'JSON imported successfully',
      networkError: 'Network error occurred',
      backToProblems: 'Back to Problems'
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