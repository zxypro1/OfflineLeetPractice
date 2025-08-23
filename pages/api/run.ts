import { NextApiRequest, NextApiResponse } from 'next';
import { NodeVM } from 'vm2';
import fs from 'fs';
import path from 'path';
import { LanguageExecutor } from '../../src/services/LanguageExecutor';

const languageExecutor = new LanguageExecutor();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { id, code, language = 'javascript' } = req.body;
  
  try {
    // Read problems.json from public folder at runtime
    const problemsPath = path.join(process.cwd(), 'public', 'problems.json');
    const problemsData = fs.readFileSync(problemsPath, 'utf8');
    const problems = JSON.parse(problemsData);
    
    const problem = problems.find((p: any) => p.id === id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const tests = problem.tests || [];
    const results: any[] = [];
    let passedCount = 0;
  
  // 记录总开始时间和初始内存
  const totalStartTime = Date.now();
  const initialMemory = process.memoryUsage();

  // Execute each test case
  if (language === 'javascript') {
    // Use existing VM-based execution for JavaScript
    for (const test of tests) {
      try {
        // Create a new VM instance for each test
        const vm = new NodeVM({
          console: 'inherit',
          sandbox: {},
          timeout: 5000, // 5-second timeout
          require: {
            external: false,
            builtin: []
          },
          wrapper: 'none',
          strict: false
        });

        // Parse input parameters
        const args = parseTestInput(test.input);
        const expected = parseTestOutput(test.output);
        
        // Build complete execution code
        const executeCode = `
          // Reset module.exports
          module.exports = null;
          
          ${code}
          
          // Check export
          if (typeof module.exports !== 'function') {
            throw new Error('Must use module.exports = yourFunction to export function');
          }
          
          // Execute function
          const userFunction = module.exports;
          const args = ${JSON.stringify(args)};
          const result = userFunction(...args);
          
          console.log('Execution result:', result, 'type:', typeof result);
          
          // Explicitly return result
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
  } else {
    // Use LanguageExecutor for other languages
    for (const test of tests) {
      try {
        const args = parseTestInput(test.input);
        const expected = parseTestOutput(test.output);
        
        // Create test wrapper code based on language
        const testCode = createTestWrapper(code, language, args, problem.template?.[language] || '', expected);
        
        const startTime = Date.now();
        const executionResult = await languageExecutor.executeCode(testCode, language);
        const executionTime = Date.now() - startTime;
        
        if (executionResult.success) {
          // Parse the output
          let actual;
          try {
            const output = executionResult.output.trim();
            actual = JSON.parse(output);
          } catch {
            actual = executionResult.output.trim();
          }
          
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
        } else {
          results.push({
            input: test.input,
            expected: expected,
            actual: null,
            passed: false,
            executionTime: executionTime,
            error: executionResult.error
          });
        }
        
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
  } catch (error) {
    console.error('Error in run API:', error);
    res.status(500).json({ error: 'Failed to execute code or load problems' });
  }
}

// Create test wrapper code for different languages
function createTestWrapper(userCode: string, language: string, args: any[], template: string, expected?: any): string {
  const argsStr = JSON.stringify(args);
  
  switch (language) {
    case 'python':
      return `
import json
import sys

${userCode}

# Test execution
args = json.loads('${argsStr}')
result = ${extractFunctionName(template, language)}(*args)
print(json.dumps(result))
`;
      
    case 'java':
      const functionName = extractFunctionName(template, language, userCode);
      const className = 'Solution';
      const escapedArgs = argsStr.replace(/"/g, '\\"').replace(/\\/g, '\\\\');
      
      // Check if userCode already contains a complete class declaration
      const hasClassDeclaration = userCode.includes('public class') || userCode.includes('class Solution');
      
      if (hasClassDeclaration) {
        // If user code already has class declaration, rename it to TestRunner and use TestRunner as main class
        const modifiedUserCode = userCode
          .replace(/public class Solution/g, 'class Solution')
          .replace(/class Solution/g, 'class TestRunner');
        
        return `
import java.util.*;

${modifiedUserCode}

class TestRunnerMain {
    public static void main(String[] args) {
        try {
            Object[] testArgs = parseJsonArgs("${escapedArgs}");
            Object result;
            
            // Create instance and invoke method
            TestRunner solution = new TestRunner();
            result = invokeMethod(solution, "${functionName}", testArgs);
            
            System.out.println(formatResult(result));
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static Object[] parseJsonArgs(String jsonStr) {
        jsonStr = jsonStr.trim();
        if (!jsonStr.startsWith("[") || !jsonStr.endsWith("]")) {
            throw new RuntimeException("Invalid JSON array format");
        }
        
        String content = jsonStr.substring(1, jsonStr.length() - 1);
        if (content.trim().isEmpty()) {
            return new Object[0];
        }
        
        java.util.List<Object> args = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();
        int bracketCount = 0;
        boolean inQuotes = false;
        
        for (int i = 0; i < content.length(); i++) {
            char c = content.charAt(i);
            
            if (c == '"' && (i == 0 || content.charAt(i-1) != '\\\\')) {
                inQuotes = !inQuotes;
                current.append(c);
            } else if (!inQuotes && (c == '[' || c == '{')) {
                bracketCount++;
                current.append(c);
            } else if (!inQuotes && (c == ']' || c == '}')) {
                bracketCount--;
                current.append(c);
            } else if (!inQuotes && c == ',' && bracketCount == 0) {
                args.add(parseValue(current.toString().trim()));
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        
        if (current.length() > 0) {
            args.add(parseValue(current.toString().trim()));
        }
        
        return args.toArray();
    }
    
    public static Object parseValue(String value) {
        value = value.trim();
        
        if (value.equals("null")) return null;
        if (value.equals("true")) return true;
        if (value.equals("false")) return false;
        
        if (value.length() >= 2 && value.charAt(0) == '"' && value.charAt(value.length()-1) == '"') {
            return value.substring(1, value.length() - 1);
        }
        
        if (value.startsWith("[") && value.endsWith("]")) {
            String content = value.substring(1, value.length() - 1).trim();
            if (content.isEmpty()) return new int[0];
            
            String[] parts = content.split(",");
            int[] array = new int[parts.length];
            for (int i = 0; i < parts.length; i++) {
                array[i] = Integer.parseInt(parts[i].trim());
            }
            return array;
        }
        
        try {
            if (value.contains(".")) {
                return Double.parseDouble(value);
            } else {
                return Integer.parseInt(value);
            }
        } catch (NumberFormatException e) {
            return value;
        }
    }
    
    public static Object invokeMethod(Object obj, String methodName, Object[] args) throws Exception {
        Class<?> clazz = obj.getClass();
        java.lang.reflect.Method[] methods = clazz.getDeclaredMethods();
        
        for (java.lang.reflect.Method method : methods) {
            if (method.getName().equals(methodName) && method.getParameterCount() == args.length) {
                try {
                    return method.invoke(obj, args);
                } catch (Exception e) {
                    Class<?>[] paramTypes = method.getParameterTypes();
                    Object[] convertedArgs = new Object[args.length];
                    
                    for (int i = 0; i < args.length; i++) {
                        convertedArgs[i] = convertArg(args[i], paramTypes[i]);
                    }
                    
                    return method.invoke(obj, convertedArgs);
                }
            }
        }
        
        throw new RuntimeException("Method not found: " + methodName);
    }
    
    public static Object convertArg(Object arg, Class<?> targetType) {
        if (arg == null) return null;
        if (targetType.isAssignableFrom(arg.getClass())) return arg;
        
        if (targetType.isArray() && arg instanceof int[]) {
            return arg;
        }
        
        if (targetType == int.class || targetType == Integer.class) {
            if (arg instanceof Number) return ((Number) arg).intValue();
        }
        
        return arg;
    }
    
    public static String formatResult(Object result) {
        if (result == null) return "null";
        if (result instanceof int[]) {
            return java.util.Arrays.toString((int[]) result);
        }
        if (result instanceof String) {
            String quote = String.valueOf('"');
            return quote + result.toString() + quote;
        }
        if (result instanceof Boolean) {
            return result.toString();
        }
        if (result instanceof Number) {
            return result.toString();
        }
        return result.toString();
    }
}
`;
      } else {
        // If user code doesn't have class declaration, wrap it
        return `
import java.util.*;

public class ${className} {
    ${userCode}
    
    public static void main(String[] args) {
        try {
            Object[] testArgs = parseJsonArgs("${escapedArgs}");
            Object result;
            
            // Create instance and invoke method
            Solution solution = new Solution();
            result = invokeMethod(solution, "${functionName}", testArgs);
            
            System.out.println(formatResult(result));
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static Object[] parseJsonArgs(String jsonStr) {
        jsonStr = jsonStr.trim();
        if (!jsonStr.startsWith("[") || !jsonStr.endsWith("]")) {
            throw new RuntimeException("Invalid JSON array format");
        }
        
        String content = jsonStr.substring(1, jsonStr.length() - 1);
        if (content.trim().isEmpty()) {
            return new Object[0];
        }
        
        java.util.List<Object> args = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();
        int bracketCount = 0;
        boolean inQuotes = false;
        
        for (int i = 0; i < content.length(); i++) {
            char c = content.charAt(i);
            
            if (c == '"' && (i == 0 || content.charAt(i-1) != '\\\\')) {
                inQuotes = !inQuotes;
                current.append(c);
            } else if (!inQuotes && (c == '[' || c == '{')) {
                bracketCount++;
                current.append(c);
            } else if (!inQuotes && (c == ']' || c == '}')) {
                bracketCount--;
                current.append(c);
            } else if (!inQuotes && c == ',' && bracketCount == 0) {
                args.add(parseValue(current.toString().trim()));
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        
        if (current.length() > 0) {
            args.add(parseValue(current.toString().trim()));
        }
        
        return args.toArray();
    }
    
    public static Object parseValue(String value) {
        value = value.trim();
        
        if (value.equals("null")) return null;
        if (value.equals("true")) return true;
        if (value.equals("false")) return false;
        
        if (value.length() >= 2 && value.charAt(0) == '"' && value.charAt(value.length()-1) == '"') {
            return value.substring(1, value.length() - 1);
        }
        
        if (value.startsWith("[") && value.endsWith("]")) {
            String content = value.substring(1, value.length() - 1).trim();
            if (content.isEmpty()) return new int[0];
            
            String[] parts = content.split(",");
            int[] array = new int[parts.length];
            for (int i = 0; i < parts.length; i++) {
                array[i] = Integer.parseInt(parts[i].trim());
            }
            return array;
        }
        
        try {
            if (value.contains(".")) {
                return Double.parseDouble(value);
            } else {
                return Integer.parseInt(value);
            }
        } catch (NumberFormatException e) {
            return value;
        }
    }
    
    public static Object invokeMethod(Object obj, String methodName, Object[] args) throws Exception {
        Class<?> clazz = obj.getClass();
        java.lang.reflect.Method[] methods = clazz.getDeclaredMethods();
        
        for (java.lang.reflect.Method method : methods) {
            if (method.getName().equals(methodName) && method.getParameterCount() == args.length) {
                try {
                    return method.invoke(obj, args);
                } catch (Exception e) {
                    Class<?>[] paramTypes = method.getParameterTypes();
                    Object[] convertedArgs = new Object[args.length];
                    
                    for (int i = 0; i < args.length; i++) {
                        convertedArgs[i] = convertArg(args[i], paramTypes[i]);
                    }
                    
                    return method.invoke(obj, convertedArgs);
                }
            }
        }
        
        throw new RuntimeException("Method not found: " + methodName);
    }
    
    public static Object convertArg(Object arg, Class<?> targetType) {
        if (arg == null) return null;
        if (targetType.isAssignableFrom(arg.getClass())) return arg;
        
        if (targetType.isArray() && arg instanceof int[]) {
            return arg;
        }
        
        if (targetType == int.class || targetType == Integer.class) {
            if (arg instanceof Number) return ((Number) arg).intValue();
        }
        
        return arg;
    }
    
    public static String formatResult(Object result) {
        if (result == null) return "null";
        if (result instanceof int[]) {
            return java.util.Arrays.toString((int[]) result);
        }
        if (result instanceof String) {
            String quote = String.valueOf('"');
            return quote + result.toString() + quote;
        }
        if (result instanceof Boolean) {
            return result.toString();
        }
        if (result instanceof Number) {
            return result.toString();
        }
        return result.toString();
    }
}
`;
      }
      
    case 'cpp':
      const cppFunctionName = extractFunctionName(template, language, userCode);
      const escapedArgsCpp = argsStr.replace(/"/g, '\\"').replace(/\\/g, '\\\\');
      
      // Check if userCode contains a complete class Solution
      const hasClassSolution = userCode.includes('class Solution');
      
      if (hasClassSolution) {
        // User provided complete class, use it directly
        return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <climits>

using namespace std;

${userCode}

// Helper function to parse JSON string and extract integer
int parseIntFromJson(const string& jsonStr) {
    string trimmed = jsonStr;
    
    // Remove leading/trailing whitespace
    trimmed.erase(0, trimmed.find_first_not_of(" \\t\\n\\r"));
    trimmed.erase(trimmed.find_last_not_of(" \\t\\n\\r") + 1);
    
    // Remove quotes if present
    if (trimmed.front() == '"' && trimmed.back() == '"') {
        trimmed = trimmed.substr(1, trimmed.length() - 2);
    }
    
    // Convert to integer
    return stoi(trimmed);
}

int main() {
    try {
        string jsonArgs = "${escapedArgsCpp}";
        
        Solution solution;
        
        // Parse the argument and call the function
        try {
            int arg = parseIntFromJson(jsonArgs);
            auto result = solution.${cppFunctionName}(arg);
            cout << result << endl;
            return 0;
        } catch (const exception& e) {
            cout << "Error parsing argument: " << e.what() << endl;
            return 1;
        }
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
}
`;
      } else {
        // User provided standalone function, wrap it
        return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <climits>

using namespace std;

${userCode}

// Helper function to parse JSON string and extract integer
int parseIntFromJson(const string& jsonStr) {
    string trimmed = jsonStr;
    
    // Remove leading/trailing whitespace
    trimmed.erase(0, trimmed.find_first_not_of(" \\t\\n\\r"));
    trimmed.erase(trimmed.find_last_not_of(" \\t\\n\\r") + 1);
    
    // Remove quotes if present
    if (trimmed.front() == '"' && trimmed.back() == '"') {
        trimmed = trimmed.substr(1, trimmed.length() - 2);
    }
    
    // Convert to integer
    return stoi(trimmed);
}

int main() {
    try {
        string jsonArgs = "${escapedArgsCpp}";
        
        // Parse the argument and call the function
        try {
            int arg = parseIntFromJson(jsonArgs);
            auto result = ${cppFunctionName}(arg);
            cout << result << endl;
            return 0;
        } catch (const exception& e) {
            cout << "Error parsing argument: " << e.what() << endl;
            return 1;
        }
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
}
`;
      }
      
    case 'c':
      const cFunctionName = extractFunctionName(template, language, userCode);
      const escapedArgsC = argsStr.replace(/"/g, '\\"').replace(/\\/g, '\\\\');
      return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

${userCode}

// Helper function to parse JSON string and extract integer
int parseIntFromJson(const char* jsonStr) {
    char* trimmed = malloc(strlen(jsonStr) + 1);
    strcpy(trimmed, jsonStr);
    
    // Remove leading whitespace
    while (*trimmed == ' ' || *trimmed == '\\t' || *trimmed == '\\n' || *trimmed == '\\r') {
        trimmed++;
    }
    
    // Remove trailing whitespace
    char* end = trimmed + strlen(trimmed) - 1;
    while (end > trimmed && (*end == ' ' || *end == '\\t' || *end == '\\n' || *end == '\\r')) {
        *end = '\\0';
        end--;
    }
    
    // Remove quotes if present
    if (trimmed[0] == '"' && trimmed[strlen(trimmed)-1] == '"') {
        trimmed[strlen(trimmed)-1] = '\\0';
        trimmed++;
    }
    
    int result = atoi(trimmed);
    return result;
}

int main() {
    const char* jsonArgs = "${escapedArgsC}";
    
    // Parse the argument and call the function
    int arg = parseIntFromJson(jsonArgs);
    int result = ${cFunctionName}(arg);
    printf("%d\\n", result);
    
    return 0;
}
`;
      
    default:
      return userCode;
  }
}

// Extract function name from template or user code
function extractFunctionName(template: string, language: string, userCode?: string): string {
  switch (language) {
    case 'python':
      const pythonMatch = template.match(/def\s+(\w+)\s*\(/)
      return pythonMatch ? pythonMatch[1] : 'solution';
      
    case 'java':
      // Extract from template first, then try user code
      let javaMatch = template.match(/public\s+\w+\s+(\w+)\s*\(/)
      if (!javaMatch && userCode) {
        // Try to extract from user code
        javaMatch = userCode.match(/public\s+\w+\s+(\w+)\s*\(/)
      }
      return javaMatch ? javaMatch[1] : 'solution';
      
    case 'cpp':
    case 'c':
      const cppMatch = template.match(/(\w+)\s*\([^)]*\)\s*{/)
      return cppMatch ? cppMatch[1] : 'solution';
      
    default:
      return 'solution';
  }
}

// Parse test input
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
