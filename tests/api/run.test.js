const request = require('supertest');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

describe('/api/run API Tests', () => {
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

    // Create server
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

  describe('JavaScript Solutions', () => {
    test('Two Sum problem with JavaScript solution', async () => {
      const twoSumSolution = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}
module.exports = twoSum;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: twoSumSolution,
          language: 'javascript'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
      expect(response.body.results.every(r => r.passed)).toBe(true);
    });

    test('Reverse Integer problem with JavaScript solution', async () => {
      const reverseIntegerSolution = `function reverse(x) {
  const sign = x < 0 ? -1 : 1;
  const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''));
  if (reversed > 2**31 - 1) return 0;
  return sign * reversed;
}
module.exports = reverse;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: reverseIntegerSolution,
          language: 'javascript'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Palindrome Number problem with JavaScript solution', async () => {
      const palindromeSolution = `function isPalindrome(x) {
  if (x < 0) return false;
  const str = x.toString();
  return str === str.split('').reverse().join('');
}
module.exports = isPalindrome;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'palindrome-number',
          code: palindromeSolution,
          language: 'javascript'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Longest Common Prefix problem with JavaScript solution', async () => {
      const longestCommonPrefixSolution = `function longestCommonPrefix(strs) {
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
module.exports = longestCommonPrefix;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'longest-common-prefix',
          code: longestCommonPrefixSolution,
          language: 'javascript'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Valid Parentheses problem with JavaScript solution', async () => {
      const validParenthesesSolution = `function isValid(s) {
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
module.exports = isValid;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'valid-parentheses',
          code: validParenthesesSolution,
          language: 'javascript'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });
  });

  describe('Java Solutions', () => {
    test('Two Sum problem with Java solution', async () => {
      const javaTwoSumSolution = `public class Solution {
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
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: javaTwoSumSolution,
          language: 'java'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Reverse Integer problem with Java solution', async () => {
      const javaReverseIntegerSolution = `public class Solution {
    public int reverse(int x) {
        long result = 0;
        while (x != 0) {
            result = result * 10 + x % 10;
            x /= 10;
        }
        return (result > Integer.MAX_VALUE || result < Integer.MIN_VALUE) ? 0 : (int) result;
    }
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: javaReverseIntegerSolution,
          language: 'java'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Palindrome Number problem with Java solution', async () => {
      const javaPalindromeSolution = `public class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        String str = String.valueOf(x);
        String reversed = new StringBuilder(str).reverse().toString();
        return str.equals(reversed);
    }
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'palindrome-number',
          code: javaPalindromeSolution,
          language: 'java'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Longest Common Prefix problem with Java solution', async () => {
      const javaLongestCommonPrefixSolution = `public class Solution {
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
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'longest-common-prefix',
          code: javaLongestCommonPrefixSolution,
          language: 'java'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Valid Parentheses problem with Java solution', async () => {
      const javaValidParenthesesSolution = `public class Solution {
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
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'valid-parentheses',
          code: javaValidParenthesesSolution,
          language: 'java'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });
  });

  describe('Python Solutions', () => {
    test('Two Sum problem with Python solution', async () => {
      const pythonTwoSumSolution = `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: pythonTwoSumSolution,
          language: 'python'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Reverse Integer problem with Python solution', async () => {
      const pythonReverseIntegerSolution = `def reverse(x):
    sign = -1 if x < 0 else 1
    x = abs(x)
    result = 0
    while x:
        result = result * 10 + x % 10
        x //= 10
    result *= sign
    return result if -2**31 <= result <= 2**31 - 1 else 0`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: pythonReverseIntegerSolution,
          language: 'python'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Palindrome Number problem with Python solution', async () => {
      const pythonPalindromeSolution = `def is_palindrome(x):
    if x < 0:
        return False
    return str(x) == str(x)[::-1]`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'palindrome-number',
          code: pythonPalindromeSolution,
          language: 'python'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });
  });

  describe('C++ Solutions', () => {
    test('Two Sum problem with C++ solution', async () => {
      const cppTwoSumSolution = `#include <vector>
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
};`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: cppTwoSumSolution,
          language: 'cpp'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Reverse Integer problem with C++ solution', async () => {
      const cppReverseIntegerSolution = `#include <climits>
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
};`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: cppReverseIntegerSolution,
          language: 'cpp'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Palindrome Number problem with C++ solution', async () => {
      const cppPalindromeSolution = `#include <string>
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
};`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'palindrome-number',
          code: cppPalindromeSolution,
          language: 'cpp'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });
  });

  describe('C Solutions', () => {
    test('Reverse Integer problem with C solution', async () => {
      const cReverseIntegerSolution = `#include <stdio.h>
#include <limits.h>

int reverse(int x) {
    long result = 0;
    while (x != 0) {
        result = result * 10 + x % 10;
        x /= 10;
    }
    return (result > INT_MAX || result < INT_MIN) ? 0 : (int)result;
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: cReverseIntegerSolution,
          language: 'c'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Palindrome Number problem with C solution', async () => {
      const cPalindromeSolution = `#include <stdio.h>
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
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'palindrome-number',
          code: cPalindromeSolution,
          language: 'c'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });
  });

  describe('Error Handling', () => {
    test('Invalid problem ID should return 404', async () => {
      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'non-existent-problem',
          code: 'function test() { return 42; }',
          language: 'javascript'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Problem not found');
    });

    test('Invalid HTTP method should return 405', async () => {
      const response = await request(app)
        .get('/api/run')
        .expect(405);
    });

    test('Compilation error should be handled gracefully', async () => {
      const invalidJavaCode = `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Missing return statement and syntax error
        int invalid syntax here
    }
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: invalidJavaCode,
          language: 'java'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(0);
      expect(response.body.results.every(r => r.error !== null)).toBe(true);
    });

    test('Runtime error should be handled gracefully', async () => {
      const runtimeErrorCode = `function twoSum(nums, target) {
  throw new Error('Intentional runtime error');
}
module.exports = twoSum;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: runtimeErrorCode,
          language: 'javascript'
        })
        .expect(200);

      global.testUtils.validateAPIResponse(response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(0);
      expect(response.body.results.every(r => r.error !== null)).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    test('Response should include performance metrics', async () => {
      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}
module.exports = twoSum;`,
          language: 'javascript'
        })
        .expect(200);

      expect(response.body).toHaveProperty('performance');
      expect(response.body.performance).toHaveProperty('totalExecutionTime');
      expect(response.body.performance).toHaveProperty('averageExecutionTime');
      expect(response.body.performance).toHaveProperty('memoryUsage');
      expect(typeof response.body.performance.totalExecutionTime).toBe('number');
      expect(typeof response.body.performance.averageExecutionTime).toBe('number');
    });
  });

  describe('All Problems Smoke Test', () => {
    test('All problems should have valid structure', () => {
      problems.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('title');
        expect(problem).toHaveProperty('tests');
        expect(Array.isArray(problem.tests)).toBe(true);
        expect(problem.tests.length).toBeGreaterThan(0);
        
        problem.tests.forEach(test => {
          expect(test).toHaveProperty('input');
          expect(test).toHaveProperty('output');
        });
      });
    });

    test('All problems should be accessible via API', async () => {
      for (const problem of problems) {
        const response = await request(app)
          .post('/api/run')
          .send({
            id: problem.id,
            code: 'function test() { return null; }',
            language: 'javascript'
          })
          .expect(200);

        global.testUtils.validateAPIResponse(response.body);
        expect(response.body.total).toBe(problem.tests.length);
      }
    });
  });
});