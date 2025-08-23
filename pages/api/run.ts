import { NextApiRequest, NextApiResponse } from 'next';
import { NodeVM } from 'vm2';
import problems from '../../problems/problems.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { id, code } = req.body;
  const problem = problems.find((p: any) => p.id === id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  const tests = problem.tests || [];
  const results: any[] = [];
  let passedCount = 0;
  
  // 记录总开始时间和初始内存
  const totalStartTime = Date.now();
  const initialMemory = process.memoryUsage();

  // 执行每个测试用例
  for (const test of tests) {
    try {
      // 创建一个新的VM实例用于每个测试
      const vm = new NodeVM({
        console: 'inherit',
        sandbox: {},
        timeout: 5000, // 5秒超时
        require: {
          external: false,
          builtin: []
        },
        wrapper: 'none',
        strict: false
      });

      // 解析输入参数
      const args = parseTestInput(test.input);
      const expected = parseTestOutput(test.output);
      
      // 构建完整的执行代码
      const executeCode = `
        // 重置module.exports
        module.exports = null;
        
        ${code}
        
        // 检查导出
        if (typeof module.exports !== 'function') {
          throw new Error('必须使用 module.exports = yourFunction 导出函数');
        }
        
        // 执行函数
        const userFunction = module.exports;
        const args = ${JSON.stringify(args)};
        const result = userFunction(...args);
        
        console.log('Execution result:', result, 'type:', typeof result);
        
        // 明确返回结果
        return result;
      `;

      const startTime = Date.now();
      const actual = vm.run(executeCode);
      const executionTime = Date.now() - startTime;
      
      console.log('Final actual result:', actual);
      console.log('Final actual type:', typeof actual);
      
      const passed = deepEqual(actual, expected);
      if (passed) passedCount++;
      
      results.push({
        input: test.input,
        expected: expected,
        actual: actual,
        passed: passed,
        executionTime: executionTime,
        error: null
      });
      
    } catch (error: any) {
      results.push({
        input: test.input,
        expected: parseTestOutput(test.output),
        actual: null,
        passed: false,
        executionTime: 0,
        error: error.message || String(error)
      });
    }
  }

  // 计算总执行时间和内存使用
  const totalExecutionTime = Date.now() - totalStartTime;
  const finalMemory = process.memoryUsage();
  const memoryUsed = {
    heapUsed: Math.round((finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024 * 100) / 100, // MB
    heapTotal: Math.round(finalMemory.heapTotal / 1024 / 1024 * 100) / 100, // MB
    external: Math.round(finalMemory.external / 1024 / 1024 * 100) / 100, // MB
    rss: Math.round(finalMemory.rss / 1024 / 1024 * 100) / 100 // MB
  };

  res.json({
    status: 'success',
    total: tests.length,
    passed: passedCount,
    results: results,
    performance: {
      totalExecutionTime: totalExecutionTime, // ms
      averageExecutionTime: Math.round(totalExecutionTime / tests.length * 100) / 100, // ms
      memoryUsage: memoryUsed
    }
  });
}

// 解析测试输入
function parseTestInput(input: string): any[] {
  try {
    // 处理多个参数的情况，如 "[1,2,3],4" -> [[1,2,3], 4]
    if (input.includes(',')) {
      const parts = splitCommaNotInBrackets(input);
      return parts.map(part => {
        const trimmed = part.trim();
        return JSON.parse(trimmed);
      });
    } else {
      // 单个参数
      return [JSON.parse(input)];
    }
  } catch (error) {
    throw new Error(`无法解析输入参数: ${input}`);
  }
}

// 解析测试输出
function parseTestOutput(output: string): any {
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`无法解析期望输出: ${output}`);
  }
}

// 分割逗号但不分割括号内的逗号
function splitCommaNotInBrackets(str: string): string[] {
  const result: string[] = [];
  let current = '';
  let bracketCount = 0;
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if ((char === '"' || char === "'") && str[i - 1] !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
    }
    
    if (!inQuotes) {
      if (char === '[' || char === '(' || char === '{') {
        bracketCount++;
      } else if (char === ']' || char === ')' || char === '}') {
        bracketCount--;
      }
    }
    
    if (char === ',' && bracketCount === 0 && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    result.push(current.trim());
  }
  
  return result;
}

// 深度比较两个值
function deepEqual(a: any, b: any): boolean {
  try {
    // 特殊情况：数组
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    
    // 特殊情况：对象
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    
    // 基本类型比较
    return a === b;
  } catch (error) {
    // 回退到JSON字符串比较
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return a === b;
    }
  }
}
