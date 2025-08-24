const request = require('supertest');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

describe('Language-Specific API Tests', () => {
  let app;
  let server;

  beforeAll(async () => {
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

  describe('Java Template Handling', () => {
    test('Java class with existing class declaration', async () => {
      const javaCodeWithClass = `public class Solution {
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
          code: javaCodeWithClass,
          language: 'java'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Java method-only code without class', async () => {
      const javaMethodOnly = `public int reverse(int x) {
    long result = 0;
    while (x != 0) {
        result = result * 10 + x % 10;
        x /= 10;
    }
    return (result > Integer.MAX_VALUE || result < Integer.MIN_VALUE) ? 0 : (int) result;
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: javaMethodOnly,
          language: 'java'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Java String array handling for longest common prefix', async () => {
      const javaStringArrayCode = `public class Solution {
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
          code: javaStringArrayCode,
          language: 'java'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
      
      // Verify specific test case that was problematic
      const testCase = response.body.results.find(r => r.input === '["ab", "a"]');
      expect(testCase).toBeDefined();
      expect(testCase.actual).toBe('a');
      expect(testCase.passed).toBe(true);
    });

    test('Java boolean return type handling', async () => {
      const javaBooleanCode = `public class Solution {
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
          code: javaBooleanCode,
          language: 'java'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
      
      // Check boolean formatting
      response.body.results.forEach(result => {
        expect(typeof result.actual).toBe('boolean');
      });
    });

    test('Java int array return type handling', async () => {
      const javaIntArrayCode = `public class Solution {
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
          code: javaIntArrayCode,
          language: 'java'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
      
      // Check array formatting
      response.body.results.forEach(result => {
        expect(Array.isArray(result.actual)).toBe(true);
      });
    });
  });

  describe('C++ Template Handling', () => {
    test('C++ class Solution format', async () => {
      const cppClassCode = `#include <vector>
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
          code: cppClassCode,
          language: 'cpp'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('C++ standalone function format', async () => {
      const cppStandaloneCode = `#include <climits>

int reverse(int x) {
    long result = 0;
    while (x != 0) {
        result = result * 10 + x % 10;
        x /= 10;
    }
    return (result > INT_MAX || result < INT_MIN) ? 0 : result;
}`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'reverse-integer',
          code: cppStandaloneCode,
          language: 'cpp'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('C++ string parameter handling', async () => {
      const cppStringCode = `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                char top = st.top();
                st.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) {
                    return false;
                }
            }
        }
        return st.empty();
    }
};`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'valid-parentheses',
          code: cppStringCode,
          language: 'cpp'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('C++ boolean return type formatting', async () => {
      const cppBoolCode = `#include <string>
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
          code: cppBoolCode,
          language: 'cpp'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
      
      // Check boolean formatting - should be "true"/"false" strings
      response.body.results.forEach(result => {
        expect(['true', 'false'].includes(result.actual)).toBe(true);
      });
    });
  });

  describe('C Template Handling', () => {
    test('C standalone function format', async () => {
      const cStandaloneCode = `#include <stdio.h>
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
          code: cStandaloneCode,
          language: 'c'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('C boolean return type handling', async () => {
      const cBoolCode = `#include <stdio.h>
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
          code: cBoolCode,
          language: 'c'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
      
      // Check boolean formatting
      response.body.results.forEach(result => {
        expect(['true', 'false'].includes(result.actual)).toBe(true);
      });
    });
  });

  describe('Python Template Handling', () => {
    test('Python function with proper naming convention', async () => {
      const pythonCode = `def two_sum(nums, target):
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
          code: pythonCode,
          language: 'python'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Python string array handling', async () => {
      const pythonStringCode = `def longest_common_prefix(strs):
    if not strs:
        return ""
    
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'longest-common-prefix',
          code: pythonStringCode,
          language: 'python'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });

    test('Python boolean return type', async () => {
      const pythonBoolCode = `def is_palindrome(x):
    if x < 0:
        return False
    return str(x) == str(x)[::-1]`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'palindrome-number',
          code: pythonBoolCode,
          language: 'python'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(response.body.total);
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    test('Empty function body should handle gracefully', async () => {
      const emptyFunction = `function twoSum(nums, target) {
  // Empty implementation
}
module.exports = twoSum;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: emptyFunction,
          language: 'javascript'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(0);
    });

    test('Large input handling', async () => {
      const jsCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
module.exports = twoSum;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: jsCode,
          language: 'javascript'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.performance.totalExecutionTime).toBeLessThan(10000); // Should complete within 10 seconds
    });

    test('Memory usage tracking', async () => {
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

      expect(response.body.performance.memoryUsage).toBeDefined();
      expect(response.body.performance.memoryUsage.heapUsed).toBeDefined();
      expect(response.body.performance.memoryUsage.heapTotal).toBeDefined();
    });

    test('Timeout handling for infinite loops', async () => {
      const infiniteLoopCode = `function twoSum(nums, target) {
  while (true) {
    // Infinite loop
  }
}
module.exports = twoSum;`;

      const response = await request(app)
        .post('/api/run')
        .send({
          id: 'two-sum',
          code: infiniteLoopCode,
          language: 'javascript'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.passed).toBe(0);
      expect(response.body.results.every(r => r.error !== null)).toBe(true);
    }, 10000); // Extended timeout for this test
  });

  describe('Language Support Validation', () => {
    test('All supported languages should be available', async () => {
      const supportedLanguages = ['javascript', 'java', 'python', 'cpp', 'c'];
      
      for (const language of supportedLanguages) {
        let testCode;
        switch (language) {
          case 'javascript':
            testCode = 'function reverse(x) { return 321; }\nmodule.exports = reverse;';
            break;
          case 'java':
            testCode = 'public class Solution { public int reverse(int x) { return 321; } }';
            break;
          case 'python':
            testCode = 'def reverse(x):\n    return 321';
            break;
          case 'cpp':
            testCode = 'class Solution {\npublic:\n    int reverse(int x) { return 321; }\n};';
            break;
          case 'c':
            testCode = 'int reverse(int x) { return 321; }';
            break;
        }

        const response = await request(app)
          .post('/api/run')
          .send({
            id: 'reverse-integer',
            code: testCode,
            language: language
          })
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.results.length).toBeGreaterThan(0);
      }
    });
  });
});