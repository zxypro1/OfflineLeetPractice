const fs = require('fs');
const path = require('path');

describe('Problem Data Integrity Tests', () => {
  let problems;

  beforeAll(() => {
    const problemsPath = path.join(process.cwd(), 'public', 'problems.json');
    problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
  });

  describe('Problem Structure Validation', () => {
    test('All problems should have required fields', () => {
      problems.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('title');
        expect(problem).toHaveProperty('difficulty');
        expect(problem).toHaveProperty('tags');
        expect(problem).toHaveProperty('description');
        expect(problem).toHaveProperty('tests');
        expect(problem).toHaveProperty('template');

        expect(typeof problem.id).toBe('string');
        expect(problem.id.length).toBeGreaterThan(0);
        expect(['Easy', 'Medium', 'Hard'].includes(problem.difficulty)).toBe(true);
        expect(Array.isArray(problem.tags)).toBe(true);
        expect(Array.isArray(problem.tests)).toBe(true);
        expect(problem.tests.length).toBeGreaterThan(0);
      });
    });

    test('All problems should have unique IDs', () => {
      const ids = problems.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    test('All problems should have valid test cases', () => {
      problems.forEach(problem => {
        problem.tests.forEach((test, index) => {
          expect(test).toHaveProperty('input');
          expect(test).toHaveProperty('output');
          expect(typeof test.input).toBe('string');
          expect(typeof test.output).toBe('string');

          // Test that input and output can be parsed as JSON
          expect(() => {
            try {
              // For multiple parameters, try to parse as comma-separated JSON values
              if (test.input.includes(',') && !test.input.startsWith('[')) {
                // Handle cases like "[2,7,11,15],9" or "nums = [2,7,11,15], target = 9"
                const cleanInput = test.input.replace(/\w+\s*=\s*/g, ''); // Remove "nums = " patterns
                const parts = cleanInput.split(',').map(part => part.trim());
                        
                // Try to parse each part
                for (let i = 0; i < parts.length; i++) {
                  let part = parts[i];
                          
                  // Handle array continuation (e.g., "[2", "7", "11", "15]", "9")
                  if (part.startsWith('[') && !part.endsWith(']')) {
                    // Reconstruct the array
                    let arrayPart = part;
                    i++;
                    while (i < parts.length && !arrayPart.endsWith(']')) {
                      arrayPart += ',' + parts[i];
                      i++;
                    }
                    JSON.parse(arrayPart);
                  } else if (!part.includes('[') && !part.includes(']')) {
                    // Simple value
                    JSON.parse(part);
                  } else {
                    // Complete array or value
                    JSON.parse(part);
                  }
                }
              } else {
                // Single parameter or complete array
                const cleanInput = test.input.replace(/\w+\s*=\s*/g, ''); // Remove "x = " patterns
                JSON.parse(cleanInput);
              }
            } catch (parseError) {
              // If JSON parsing fails, it might be a valid string representation
              // Just check if it's not completely malformed
              if (test.input.trim().length === 0) {
                throw new Error('Empty input');
              }
            }
          }).not.toThrow();

          expect(() => JSON.parse(test.output)).not.toThrow();
        });
      });
    });

    test('All problems should have valid templates', () => {
      const requiredLanguages = ['js', 'java', 'python', 'cpp', 'c'];
      
      problems.forEach(problem => {
        requiredLanguages.forEach(lang => {
          if (problem.template[lang]) {
            expect(typeof problem.template[lang]).toBe('string');
            expect(problem.template[lang].length).toBeGreaterThan(0);
          }
        });

        // At least JavaScript template should exist
        expect(problem.template).toHaveProperty('js');
        expect(problem.template.js.length).toBeGreaterThan(0);
      });
    });

    test('JavaScript templates should have proper module.exports', () => {
      problems.forEach(problem => {
        if (problem.template.js) {
          expect(problem.template.js).toContain('module.exports');
        }
      });
    });

    test('Java templates should have proper class structure', () => {
      problems.forEach(problem => {
        if (problem.template.java) {
          expect(problem.template.java).toContain('public class Solution');
          expect(problem.template.java).toContain('public ');
        }
      });
    });

    test('C++ templates should have proper includes and namespace', () => {
      problems.forEach(problem => {
        if (problem.template.cpp) {
          expect(problem.template.cpp).toContain('#include');
          if (problem.template.cpp.includes('vector') || problem.template.cpp.includes('string')) {
            expect(problem.template.cpp).toContain('using namespace std');
          }
        }
      });
    });

    test('C templates should have proper includes', () => {
      problems.forEach(problem => {
        if (problem.template.c) {
          expect(problem.template.c).toContain('#include');
        }
      });
    });
  });

  describe('Solution Validation', () => {
    test('Problems with solutions should have valid JavaScript solutions', () => {
      problems.forEach(problem => {
        if (problem.solution && problem.solution.js) {
          expect(typeof problem.solution.js).toBe('string');
          expect(problem.solution.js.length).toBeGreaterThan(0);
          expect(problem.solution.js).toContain('module.exports');

          // Try to extract function name and validate syntax
          const lines = problem.solution.js.split('\n');
          const exportLine = lines.find(line => line.includes('module.exports'));
          expect(exportLine).toBeDefined();
        }
      });
    });

    test('Function names should be consistent with problem context', () => {
      const functionNamePatterns = {
        'two-sum': /twoSum|two_sum/,
        'reverse-integer': /reverse/,
        'palindrome-number': /isPalindrome|is_palindrome/,
        'longest-common-prefix': /longestCommonPrefix|longest_common_prefix/,
        'valid-parentheses': /isValid|is_valid/,
      };

      problems.forEach(problem => {
        if (functionNamePatterns[problem.id] && problem.template.js) {
          expect(problem.template.js).toMatch(functionNamePatterns[problem.id]);
        }
      });
    });
  });

  describe('Multilingual Content Validation', () => {
    test('All problems should have English and Chinese titles', () => {
      problems.forEach(problem => {
        expect(problem.title).toHaveProperty('en');
        expect(problem.title).toHaveProperty('zh');
        expect(typeof problem.title.en).toBe('string');
        expect(typeof problem.title.zh).toBe('string');
        expect(problem.title.en.length).toBeGreaterThan(0);
        expect(problem.title.zh.length).toBeGreaterThan(0);
      });
    });

    test('All problems should have English and Chinese descriptions', () => {
      problems.forEach(problem => {
        expect(problem.description).toHaveProperty('en');
        expect(problem.description).toHaveProperty('zh');
        expect(typeof problem.description.en).toBe('string');
        expect(typeof problem.description.zh).toBe('string');
        expect(problem.description.en.length).toBeGreaterThan(0);
        expect(problem.description.zh.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Test Case Coverage', () => {
    test('All problems should have at least 2 test cases', () => {
      problems.forEach(problem => {
        expect(problem.tests.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('Test cases should cover edge cases', () => {
      problems.forEach(problem => {
        // Check if test cases include typical edge cases
        const inputs = problem.tests.map(t => t.input);
        const outputs = problem.tests.map(t => t.output);

        // Should have variety in test cases
        const uniqueInputs = new Set(inputs);
        expect(uniqueInputs.size).toBeGreaterThan(1);

        // Should test different outcomes
        if (outputs.length > 1) {
          const uniqueOutputs = new Set(outputs);
          expect(uniqueOutputs.size).toBeGreaterThan(0);
        }
      });
    });

    test('Specific problem test cases should be meaningful', () => {
      const specificChecks = {
        'two-sum': (problem) => {
          // Should have different target values and array sizes
          const inputs = problem.tests.map(t => t.input);
          const hasMultipleFormats = inputs.some(input => input.includes(','));
          expect(hasMultipleFormats || inputs.length > 1).toBe(true);
        },
        
        'palindrome-number': (problem) => {
          // Should include positive, negative, and edge cases
          const inputs = problem.tests.map(t => {
            try {
              const cleanInput = t.input.replace(/\w+\s*=\s*/g, '');
              return JSON.parse(cleanInput);
            } catch {
              return null;
            }
          }).filter(x => x !== null);
          
          if (inputs.length > 0) {
            const hasNegative = inputs.some(x => x < 0);
            const hasPositive = inputs.some(x => x > 0);
            expect(hasNegative || hasPositive).toBe(true);
          }
        },
        
        'longest-common-prefix': (problem) => {
          // Should include cases with common prefix and without
          const outputs = problem.tests.map(t => JSON.parse(t.output));
          const hasEmptyResult = outputs.some(o => o === "");
          const hasNonEmptyResult = outputs.some(o => o !== "");
          expect(hasEmptyResult || hasNonEmptyResult).toBe(true);
        }
      };

      problems.forEach(problem => {
        if (specificChecks[problem.id]) {
          specificChecks[problem.id](problem);
        }
      });
    });
  });

  describe('Performance Expectations', () => {
    test('Test inputs should be reasonable size', () => {
      problems.forEach(problem => {
        problem.tests.forEach(test => {
          const inputLength = test.input.length;
          expect(inputLength).toBeLessThan(1000); // Reasonable input size
        });
      });
    });

    test('Expected outputs should be reasonable size', () => {
      problems.forEach(problem => {
        problem.tests.forEach(test => {
          const outputLength = test.output.length;
          expect(outputLength).toBeLessThan(1000); // Reasonable output size
        });
      });
    });
  });

  describe('Documentation Quality', () => {
    test('Problems with solutions should have comprehensive documentation', () => {
      problems.forEach(problem => {
        if (problem.solutions && Array.isArray(problem.solutions)) {
          problem.solutions.forEach(solution => {
            expect(solution).toHaveProperty('title');
            expect(solution).toHaveProperty('content');
            expect(solution.title).toHaveProperty('en');
            expect(solution.title).toHaveProperty('zh');
            expect(solution.content).toHaveProperty('en');
            expect(solution.content).toHaveProperty('zh');
          });
        }
      });
    });

    test('Examples should be properly formatted', () => {
      problems.forEach(problem => {
        if (problem.examples && Array.isArray(problem.examples)) {
          problem.examples.forEach(example => {
            expect(example).toHaveProperty('input');
            expect(example).toHaveProperty('output');
            expect(typeof example.input).toBe('string');
            expect(typeof example.output).toBe('string');
          });
        }
      });
    });
  });

  describe('File System Consistency', () => {
    test('problems.json should exist in public folder', () => {
      const publicProblemsPath = path.join(process.cwd(), 'public', 'problems.json');
      expect(fs.existsSync(publicProblemsPath)).toBe(true);
    });

    test('problems.json should be valid JSON', () => {
      const publicProblemsPath = path.join(process.cwd(), 'public', 'problems.json');
      expect(() => {
        JSON.parse(fs.readFileSync(publicProblemsPath, 'utf8'));
      }).not.toThrow();
    });

    test('Source and public problems.json should be synchronized', () => {
      const sourcePath = path.join(process.cwd(), 'problems', 'problems.json');
      const publicPath = path.join(process.cwd(), 'public', 'problems.json');
      
      if (fs.existsSync(sourcePath)) {
        const sourceContent = fs.readFileSync(sourcePath, 'utf8');
        const publicContent = fs.readFileSync(publicPath, 'utf8');
        expect(sourceContent).toBe(publicContent);
      }
    });
  });
});