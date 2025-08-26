const request = require('supertest');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

describe('Solution Validation Tests', () => {
  let app;
  let server;
  let problems;

  beforeAll(async () => {
    // Load problems data
    const problemsPath = path.join(process.cwd(), 'public', 'problems.json');
    problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

    // Create Next.js app instance for testing
    const nextApp = next({ dev: false, quiet: true });
    await nextApp.prepare();

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      nextApp.getRequestHandler()(req, res, parsedUrl);
    });

    app = server;
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('JavaScript Solutions Validation', () => {
    test('All JavaScript solutions should pass their test cases', async () => {
      const problemsWithJSSolutions = problems.filter(problem => 
        problem.solution && problem.solution.js
      );
      
      expect(problemsWithJSSolutions.length).toBeGreaterThan(0);
      
      for (const problem of problemsWithJSSolutions) {
        console.log(`Testing ${problem.id} JavaScript solution...`);
        
        const response = await request(app)
          .post('/api/run')
          .send({
            id: problem.id,
            code: problem.solution.js,
            language: 'javascript'
          })
          .expect(200);

        // Validate API response structure
        global.testUtils.validateAPIResponse(response.body);
        
        // Check that solution passes all tests
        expect(response.body.status).toBe('success');
        expect(response.body.passed).toBe(response.body.total);
        expect(response.body.passed).toBe(problem.tests.length);
        
        // Verify each individual test case
        response.body.results.forEach((result, index) => {
          expect(result.passed).toBe(true);
          expect(result.error).toBeNull();
          expect(result).toHaveProperty('executionTime');
          expect(typeof result.executionTime).toBe('number');
          expect(result.executionTime).toBeGreaterThanOrEqual(0);
        });

        // Performance validation
        expect(response.body.performance.totalExecutionTime).toBeGreaterThan(0);
        expect(response.body.performance.averageExecutionTime).toBeGreaterThan(0);
        expect(response.body.performance.totalExecutionTime).toBeLessThan(10000); // Should complete within 10 seconds
      }
    });
  });

  describe('Template Validation', () => {
    const templateSolutions = {
      'two-sum': {
        js: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}
module.exports = twoSum;`,
        java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
        python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
        cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
        c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize - 1; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`
      },
      
      'reverse-integer': {
        js: `function reverse(x) {
  const sign = x < 0 ? -1 : 1;
  const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''));
  if (reversed > 2**31 - 1) return 0;
  return sign * reversed;
}
module.exports = reverse;`,
        java: `public class Solution {
    public int reverse(int x) {
        long result = 0;
        while (x != 0) {
            result = result * 10 + x % 10;
            x /= 10;
        }
        return (result > Integer.MAX_VALUE || result < Integer.MIN_VALUE) ? 0 : (int) result;
    }
}`,
        python: `def reverse(x):
    sign = -1 if x < 0 else 1
    x = abs(x)
    result = 0
    while x:
        result = result * 10 + x % 10
        x //= 10
    result *= sign
    return result if -2**31 <= result <= 2**31 - 1 else 0`,
        cpp: `#include <climits>
using namespace std;

class Solution {
public:
    int reverse(int x) {
        long result = 0;
        while (x != 0) {
            result = result * 10 + x % 10;
            x /= 10;
        }
        return (result > INT_MAX || result < INT_MIN) ? 0 : result;
    }
};`,
        c: `#include <stdio.h>
#include <limits.h>

int reverse(int x) {
    long result = 0;
    while (x != 0) {
        result = result * 10 + x % 10;
        x /= 10;
    }
    return (result > INT_MAX || result < INT_MIN) ? 0 : (int)result;
}`
      },

      'palindrome-number': {
        js: `function isPalindrome(x) {
  if (x < 0) return false;
  const str = x.toString();
  return str === str.split('').reverse().join('');
}
module.exports = isPalindrome;`,
        java: `public class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        String str = String.valueOf(x);
        String reversed = new StringBuilder(str).reverse().toString();
        return str.equals(reversed);
    }
}`,
        python: `def is_palindrome(x):
    if x < 0:
        return False
    return str(x) == str(x)[::-1]`,
        cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0) return false;
        string s = to_string(x);
        string rev = s;
        reverse(rev.begin(), rev.end());
        return s == rev;
    }
};`,
        c: `#include <stdio.h>
#include <stdbool.h>

bool isPalindrome(int x) {
    if (x < 0) return false;
    
    long original = x;
    long reversed = 0;
    
    while (x > 0) {
        reversed = reversed * 10 + x % 10;
        x /= 10;
    }
    
    return original == reversed;
}`
      },

      'longest-common-prefix': {
        js: `function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}
module.exports = longestCommonPrefix;`,
        java: `public class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`,
        python: `def longest_common_prefix(strs):
    if not strs:
        return ""
    
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`
      },

      'valid-parentheses': {
        js: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
module.exports = isValid;`,
        java: `public class Solution {
    public boolean isValid(String s) {
        java.util.Stack<Character> stack = new java.util.Stack<>();
        java.util.Map<Character, Character> map = new java.util.HashMap<>();
        map.put(')', '(');
        map.put('}', '{');
        map.put(']', '[');
        
        for (char c : s.toCharArray()) {
            if (map.containsKey(c)) {
                if (stack.isEmpty() || stack.pop() != map.get(c)) {
                    return false;
                }
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }
}`,
        python: `def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0`
      }
    };

    Object.keys(templateSolutions).forEach(problemId => {
      const problemSolutions = templateSolutions[problemId];
      
      Object.keys(problemSolutions).forEach(language => {
        test(`${problemId} ${language} template solution should pass all tests`, async () => {
          const response = await request(app)
            .post('/api/run')
            .send({
              id: problemId,
              code: problemSolutions[language],
              language: language
            })
            .expect(200);

          global.testUtils.validateAPIResponse(response.body);
          expect(response.body.status).toBe('success');
          expect(response.body.passed).toBe(response.body.total);
          
          // All test results should pass
          response.body.results.forEach(result => {
            expect(result.passed).toBe(true);
            expect(result.error).toBeNull();
          });
        });
      });
    });
  });

  describe('Solution Performance Benchmarks', () => {
    test('JavaScript solutions should complete within reasonable time', async () => {
      for (const problem of problems) {
        if (problem.solution && problem.solution.js) {
          const response = await request(app)
            .post('/api/run')
            .send({
              id: problem.id,
              code: problem.solution.js,
              language: 'javascript'
            })
            .expect(200);

          // Performance benchmarks
          expect(response.body.performance.totalExecutionTime).toBeLessThan(5000); // 5 seconds max
          expect(response.body.performance.averageExecutionTime).toBeLessThan(1000); // 1 second per test max
        }
      }
    });

    test('Memory usage should be reasonable', async () => {
      for (const problem of problems) {
        if (problem.solution && problem.solution.js) {
          const response = await request(app)
            .post('/api/run')
            .send({
              id: problem.id,
              code: problem.solution.js,
              language: 'javascript'
            })
            .expect(200);

          // Memory should be tracked
          expect(response.body.performance.memoryUsage).toBeDefined();
          expect(response.body.performance.memoryUsage.heapUsed).toBeDefined();
          expect(response.body.performance.memoryUsage.heapTotal).toBeDefined();
        }
      }
    });
  });

  describe('Cross-Language Consistency', () => {
    const problemsWithMultipleSolutions = ['two-sum', 'reverse-integer', 'palindrome-number'];

    problemsWithMultipleSolutions.forEach(problemId => {
      test(`${problemId} should produce consistent results across all languages`, async () => {
        const solutions = templateSolutions[problemId];
        const results = {};

        // Run solution in each language
        for (const [language, code] of Object.entries(solutions)) {
          const response = await request(app)
            .post('/api/run')
            .send({
              id: problemId,
              code: code,
              language: language
            })
            .expect(200);

          expect(response.body.status).toBe('success');
          expect(response.body.passed).toBe(response.body.total);
          
          results[language] = response.body.results.map(r => r.actual);
        }

        // Compare results across languages
        const languages = Object.keys(results);
        if (languages.length > 1) {
          const referenceResults = results[languages[0]];
          
          for (let i = 1; i < languages.length; i++) {
            const currentResults = results[languages[i]];
            expect(currentResults).toEqual(referenceResults);
          }
        }
      });
    });
  });

  describe('Error Handling in Solutions', () => {
    test('Malformed solutions should be handled gracefully', async () => {
      const malformedSolutions = {
        'syntax-error': `function twoSum(nums, target) {
  // Missing closing brace and return
  const map = new Map();
  for (let i = 0; i < nums.length; i++
}
module.exports = twoSum;`,
        
        'runtime-error': `function twoSum(nums, target) {
  nums.nonExistentMethod();
  return [0, 1];
}
module.exports = twoSum;`,
        
        'infinite-loop': `function twoSum(nums, target) {
  while (true) {
    // Infinite loop
  }
}
module.exports = twoSum;`,
        
        'wrong-return-type': `function twoSum(nums, target) {
  return "not an array";
}
module.exports = twoSum;`
      };

      for (const [errorType, code] of Object.entries(malformedSolutions)) {
        const response = await request(app)
          .post('/api/run')
          .send({
            id: 'two-sum',
            code: code,
            language: 'javascript'
          })
          .expect(200);

        global.testUtils.validateAPIResponse(response.body);
        expect(response.body.status).toBe('success');
        expect(response.body.passed).toBe(0);
        expect(response.body.results.every(r => r.error !== null)).toBe(true);
      }
    });
  });

  describe('Solution Completeness', () => {
    test('All problems should have at least JavaScript solutions', () => {
      problems.forEach(problem => {
        if (!problem.solution || !problem.solution.js) {
          console.warn(`Problem ${problem.id} is missing JavaScript solution`);
        }
      });
    });

    test('Critical problems should have multi-language solutions', () => {
      const criticalProblems = ['two-sum', 'reverse-integer', 'palindrome-number'];
      
      criticalProblems.forEach(problemId => {
        const problem = problems.find(p => p.id === problemId);
        expect(problem).toBeDefined();
        
        // Check if solutions exist in templateSolutions
        expect(templateSolutions[problemId]).toBeDefined();
        expect(templateSolutions[problemId].js).toBeDefined();
        expect(templateSolutions[problemId].java).toBeDefined();
        expect(templateSolutions[problemId].python).toBeDefined();
      });
    });
  });
});