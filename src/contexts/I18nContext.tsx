import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
// Dynamically import locale files
import en from '../../locales/en.json';
import zh from '../../locales/zh.json';

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
    settings: string;
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
    aiGenerator: string;
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
    solutions?: string;
    showSolution: string;
    hideSolution: string;
    solutionHidden: string;
    example: string;
    input: string;
    output: string;
    solutionTitle?: string;
    noSolutions?: string;
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
    copy: string;
    copied: string;
  };
  aiGenerator: {
    title: string;
    subtitle: string;
    backToHome: string;
    tryLastProblem: string;
    requestLabel: string;
    requestPlaceholder: string;
    suggestedRequests: string;
    generateButton: string;
    generating: string;
    cancel: string;
    errorTitle: string;
    successTitle: string;
    previewTitle: string;
    problemId: string;
    howToUse: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    instruction4: string;
    instruction5: string;
    pleaseEnterRequest: string;
    poweredBy: string;
    unlimitedProblems: string;
  };
  settings: {
    title: string;
    description: string;
    save: string;
    saving: string;
    deepseek: {
      apiKey: string;
      apiKeyPlaceholder: string;
      model: string;
      modelPlaceholder: string;
      timeout: string;
      timeoutPlaceholder: string;
      maxTokens: string;
      maxTokensPlaceholder: string;
    };
    openai: {
      apiKey: string;
      apiKeyPlaceholder: string;
      model: string;
      modelPlaceholder: string;
    };
    qwen: {
      apiKey: string;
      apiKeyPlaceholder: string;
      model: string;
      modelPlaceholder: string;
    };
    claude: {
      apiKey: string;
      apiKeyPlaceholder: string;
      model: string;
      modelPlaceholder: string;
    };
    ollama: {
      endpoint: string;
      endpointPlaceholder: string;
      model: string;
      modelPlaceholder: string;
    };
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

interface I18nContextType {
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
  switchLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Load translations from locale files
const translations: Record<string, Translations> = {
  en,
  zh
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