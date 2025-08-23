# How to Add/Modify Problems in Offline Mode 📝

This guide explains how to add your own problems or modify existing ones in the built application without needing to rebuild or have internet access.

## 🎯 Quick Overview

The application is designed to allow users to modify the problem database even in offline environments like airplanes, remote locations, or secure networks. All problem data is stored in a single JSON file that you can edit directly.

## 📍 Problem File Location

After building the application, the problem database is located at:

```
your-app-folder/public/problems.json
```

**Important**: Always edit the file in the `public` folder, not the original `problems` folder, as the application reads from the public location at runtime.

## 🚀 How It Works

1. **No Rebuild Required**: Changes to `problems.json` take effect immediately
2. **Runtime Loading**: The application reads the file on each request
3. **Offline Friendly**: Works completely without internet connection
4. **Real-time Updates**: Refresh your browser to see changes

## 📝 Adding a New Problem

### Step 1: Open the Problems File

Navigate to your built application folder and open:
```
public/problems.json
```

### Step 2: Add Your Problem

Copy this template and add it to the problems array:

```json
{
  "id": "your-problem-id",
  "title": {
    "en": "Your Problem Title",
    "zh": "你的问题标题"
  },
  "difficulty": "Easy",
  "tags": ["array", "hash-table"],
  "description": {
    "en": "Your problem description in English...",
    "zh": "你的问题描述中文版..."
  },
  "examples": [
    {
      "input": "nums = [1,2,3], target = 4",
      "output": "1"
    }
  ],
  "template": {
    "js": "function yourFunction(nums, target) {\n  // Write your code here\n  return -1;\n}\nmodule.exports = yourFunction;"
  },
  "solution": {
    "js": "function yourFunction(nums, target) {\n  // Reference solution\n  return nums.indexOf(target);\n}\nmodule.exports = yourFunction;"
  },
  "tests": [
    { "input": "[1,2,3],2", "output": "1" },
    { "input": "[4,5,6],7", "output": "-1" }
  ]
}
```

### Step 3: Save and Test

1. Save the file
2. Refresh your browser (or visit the app)
3. Your new problem should appear immediately!

## 🔧 Field Explanations

### Required Fields

- **`id`**: Unique identifier (use lowercase with hyphens)
- **`title`**: Problem title in English and Chinese
- **`difficulty`**: "Easy", "Medium", or "Hard"
- **`description`**: Problem description in both languages
- **`template`**: Starting code template for users
- **`tests`**: Array of test cases for validation

### Optional Fields

- **`tags`**: Array of tags like ["array", "hash-table"]
- **`examples`**: Sample input/output for clarification
- **`solution`**: Reference solution (hidden by default)

## 🧪 Testing Your Changes

### Quick Test
1. Add a problem using the template above
2. Visit the homepage to see it in the list
3. Click on it to test the code editor
4. Submit some code to verify the tests work

### Automated Testing
```bash
# Add a test problem
npm run test:dynamic

# Visit the app to verify it appears

# Remove the test problem
npm run test:cleanup
```

## 💡 Best Practices

### Problem ID Guidelines
- Use lowercase letters and hyphens: `two-sum`, `binary-search`
- Keep it descriptive but concise
- Ensure uniqueness across all problems

### Test Case Guidelines
- Include edge cases (empty arrays, single elements)
- Test both positive and negative scenarios
- Keep input/output format consistent

### Code Template Tips
- Provide a meaningful function signature
- Include helpful comments
- Always end with `module.exports = yourFunction;`

## 🔍 Example: Adding "Reverse String" Problem

```json
{
  "id": "reverse-string",
  "title": {
    "en": "Reverse String",
    "zh": "反转字符串"
  },
  "difficulty": "Easy",
  "tags": ["string", "two-pointers"],
  "description": {
    "en": "Write a function that reverses a string. The input string is given as an array of characters.",
    "zh": "编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组的形式给出。"
  },
  "examples": [
    {
      "input": "s = ['h','e','l','l','o']",
      "output": "['o','l','l','e','h']"
    }
  ],
  "template": {
    "js": "function reverseString(s) {\n    // Write your code here\n    // Modify s in-place\n}\nmodule.exports = reverseString;"
  },
  "solution": {
    "js": "function reverseString(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n}\nmodule.exports = reverseString;"
  },
  "tests": [
    { "input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
    { "input": "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
  ]
}
```

## 🚨 Common Issues

### JSON Syntax Errors
- Always validate JSON syntax before saving
- Watch out for trailing commas
- Ensure proper quote escaping in strings

### Test Format Issues
- Input parameters must be JSON-parseable
- Multiple parameters: use comma separation like `"[1,2,3],5"`
- String inputs: use proper JSON string format `"\"hello\""`

### Function Export Issues
- Always include `module.exports = yourFunction;`
- Function name must match the one being exported
- Ensure function signature matches test expectations

## 🛟 Troubleshooting

### Problem Not Appearing
1. Check JSON syntax validity
2. Ensure the file is saved in `public/problems.json`
3. Refresh the browser page
4. Check browser console for errors

### Tests Failing
1. Verify input/output formats match
2. Check function signature
3. Ensure `module.exports` is correct
4. Test function logic independently

### Performance Issues
- Large problem sets (100+ problems) may load slower
- Consider splitting into categories if needed
- Each problem adds ~1-2KB to the JSON file

## 🌟 Advanced Tips

### Organizing Problems
Group related problems using consistent naming:
- `array-easy-1`, `array-easy-2`
- `dp-medium-1`, `dp-medium-2`

### Multi-language Support
Always provide both English and Chinese translations for:
- Title
- Description
- Consider adding comments in both languages

### Custom Tags
Create your own tag system:
- `custom-algorithm`
- `interview-prep`
- `company-specific`

---

**Happy Coding! ✈️💻**

*Perfect for offline algorithm practice anywhere!*