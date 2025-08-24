# OfflineLeetPractice

[中文](./README-zh.md)

> A local-run LeetCode-style coding practice system that lets you browse, code, and test problems 100% offline—perfect for planes, cruises, or any no-internet scenario.

<img width="2536" height="1219" alt="2025-08-24165250" src="https://github.com/user-attachments/assets/17846e96-32e8-479f-9193-02a2fc8db017" />

<img width="2545" height="1229" alt="2025-08-24165302" src="https://github.com/user-attachments/assets/93116550-60af-41aa-b0f3-cc2b10fd5ac5" />

## Why OfflineLeetPractice?

**Perfect for No-Internet Scenarios:**

- **On Flights**: Make productive use of long flights by practicing coding
- **Cruises & Remote Areas**: Continue learning where internet is unreliable
- **Camping & Travel**: Practice algorithms anywhere, anytime
- **Security-Conscious Environments**: No data leaves your machine
- **No Subscription Required**: Completely free, no online dependencies

**Why Choose Offline Over Online Platforms?**

- **Instant Response**: No network latency, immediate code execution
- **Privacy**: Your code never leaves your computer
- **Always Available**: Works without any internet connection
- **Customizable**: Add your own problems and test cases
- **Focused Learning**: No distractions from online features

## Features

### Core Functionality

- **Local Problem Library**: 10+ classic algorithm problems included
- **AI Problem Generator**: Generate unlimited custom problems with DeepSeek-V3 AI
- **Multi-Language Support**: Code and test in JavaScript, Python, Java, C++, or C
- **Monaco Code Editor**: VS Code-like editing experience
- **Instant Testing**: Run tests immediately with detailed results
- **Performance Metrics**: Execution time and memory usage tracking
- **Bilingual Support**: Full Chinese and English interface
- **Dark/Light Theme**: Comfortable coding in any lighting
- **Dynamic Problem Management**: Add/edit problems without rebuilding

### Perfect for Learning

- **Educational Focus**: Problems range from Easy to Hard difficulty
- **Tagged Categories**: Array, Hash Table, Dynamic Programming, etc.
- **Reference Solutions**: Study optimal implementations
- **Progress Tracking**: Visual feedback on test results

### AI-Powered Problem Generation

- **Custom Problem Creation**: Describe what you want to practice in Chinese or English
- **Multi-Language Templates**: Generated problems support JavaScript, Python, Java, C++, and C
- **Complete Solutions**: Each problem includes working reference solutions
- **Comprehensive Testing**: Auto-generated test cases including edge cases
- **Instant Integration**: Problems automatically added to your local library
- **Offline-First**: Generate problems online, practice them offline forever

**Example AI Requests:**
- "我想做一道动态规划题目" (Chinese: I want a dynamic programming problem)
- "Generate a medium difficulty array problem using two pointers"
- "创建一个关于字符串处理的题目" (Chinese: Create a string processing problem)

## AI Generator Setup (Optional)

**For unlimited custom problem generation:**

### Get DeepSeek API Key
1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Create account and obtain API key
3. Set up environment variable:

#### Windows (PowerShell):
```powershell
$env:DEEPSEEK_API_KEY="your_api_key_here"
```

#### macOS/Linux:
```bash
export DEEPSEEK_API_KEY="your_api_key_here"
```

#### Or create `.env.local` file:
```bash
DEEPSEEK_API_KEY=your_api_key_here
```

**Note**: AI Generator requires internet for generation, but generated problems work offline forever!

## Quick Start (No Internet Required)

### Prerequisites

- **Node.js** 16+ ([Download here](https://nodejs.org/))
- Any modern web browser

### One-Click Setup

#### Windows

```bash
# Double-click or run in terminal
start-local.bat
```

#### macOS / Linux

```bash
# Make executable (first time only)
chmod +x start-local.sh

# Run the startup script
./start-local.sh
```

The scripts will automatically:

1. Check Node.js installation
2. Install dependencies (npm install)
3. Build the application (npm run build)
4. Start the local server

Then open **http://localhost:3000** in your browser!

### Manual Setup (Alternative)

```bash
# Clone the repository
git clone https://github.com/yourusername/OfflineLeetPractice.git
cd OfflineLeetPractice

# Install dependencies
npm install

# Build for production
npm run build

# Start the server
npm start
```

## How to Use

### Basic Problem Solving
1. **Browse Problems**: View the problem list with difficulty and tags
2. **Select a Problem**: Click on any problem to open the detail page
3. **Choose Language**: Select your preferred programming language from the dropdown
4. **Code Your Solution**: Use the Monaco editor (supports autocomplete, syntax highlighting)
5. **Run Tests**: Click "Submit & Run Tests" to execute your code
6. **View Results**: See test results with performance metrics

### AI Problem Generation
1. **Access AI Generator**: Click the "AI Generator" button on the homepage
2. **Describe Your Need**: Enter what type of problem you want in Chinese or English:
   - "我想做一道中等难度的动态规划题目"
   - "Generate a medium array manipulation problem using sliding window"
3. **Generate Problem**: AI creates a complete problem with test cases and solutions
4. **Practice Immediately**: Generated problem is auto-added to your library
5. **Go Offline**: Once generated, practice the problem completely offline

### Adding Custom Problems
1. **Manual Addition**: Use the "Add Problem" page for custom problems
2. **JSON Import**: Upload or paste problem data in JSON format
3. **Direct Edit**: Modify `public/problems.json` for immediate changes (no rebuild needed)

### Performance Monitoring

Each test run shows:

- **Total Execution Time**: Time to run all test cases
- **Average Time**: Per test case execution time
- **Memory Usage**: Heap memory consumed
- **Individual Test Results**: Pass/fail status for each case

## Airplane Mode Setup Guide

### Before Your Flight

1. **Download & Setup**: Clone the repo and run setup while you have internet
2. **Test Run**: Ensure everything works: `npm run build && npm start`
3. **Verify Offline**: Disconnect internet and test the application

### During Flight

1. **Start Application**: Run `start-local.bat` (Windows) or `./start-local.sh` (Mac/Linux)
2. **Open Browser**: Navigate to `http://localhost:3000`
3. **Code Away**: Practice algorithms without any internet dependency!

### Flight Productivity Tips

- **Focus on Fundamentals**: Practice core algorithms (sorting, searching, DP)
- **Take Notes**: Use the editor to document your learning
- **Iterate Solutions**: Optimize your code for better performance
- **Track Progress**: Use the performance metrics to improve

## Technology Stack

- **Frontend**: React 18 + Next.js 13 + TypeScript
- **UI Framework**: Mantine v7 (Modern React components)
- **Code Editor**: Monaco Editor (VS Code engine)
- **Code Execution**: vm2 (Secure JavaScript sandbox)
- **Styling**: CSS Modules + Dark/Light themes
- **Internationalization**: Built-in i18n support

## Project Structure

```
OfflineLeetPractice/
├── pages/                  # Next.js pages and API routes
│   ├── api/
│   │   ├── problems.ts     # Problem data API
│   │   ├── run.ts          # Code execution API
│   │   ├── generate-problem.ts # AI problem generation API
│   │   └── add-problem.ts  # Manual problem addition API
│   ├── problems/[id].tsx   # Problem detail page
│   ├── generator.tsx       # AI Generator page
│   ├── add-problem.tsx     # Manual problem addition page
│   └── index.tsx           # Homepage
├── problems/
│   └── problems.json       # Local problem database
├── src/
│   ├── components/         # React components
│   │   ├── ProblemGenerator.tsx # AI Generator component
│   │   ├── ProblemForm.tsx     # Manual problem form
│   │   └── LanguageThemeControls.tsx # Language/theme switcher
│   ├── contexts/          # React contexts (i18n, theme)
│   └── styles/            # Global styles
├── locales/              # Internationalization files
│   ├── en.json           # English translations
│   └── zh.json           # Chinese translations
├── start-local.bat        # Windows startup script
├── start-local.sh         # Unix startup script
└── AI_GENERATOR_README.md # AI Generator detailed docs
```

## Customization

### Adding New Problems (No Rebuild Required!) 🎯

**The application supports adding/modifying problems in offline environments without rebuilding!**

1. **Edit the Problem Database**: Open `public/problems.json` in your built application folder
2. **Add Your Problem**: Follow the JSON format (see `MODIFY-PROBLEMS-GUIDE.md` for details)
3. **Save and Refresh**: Changes take effect immediately!

**Perfect for:**
- **Adding practice problems during flights**
- **Teachers customizing problems for students**
- **Creating company-specific coding challenges**
- **Building personal algorithm libraries**

**Example**: Add a new problem by editing `public/problems.json`:
```json
{
  "id": "reverse-string",
  "title": { "en": "Reverse String", "zh": "反转字符串" },
  "difficulty": "Easy",
  "tags": ["string"],
  "description": { "en": "Reverse a string...", "zh": "反转字符串..." },
  "template": { "js": "function reverse(s) {\n  // Your code\n}\nmodule.exports = reverse;" },
  "tests": [{ "input": "\"hello\"", "output": "\"olleh\"" }]
}
```

See **`MODIFY-PROBLEMS-GUIDE.md`** for complete instructions!

### Adding New Problems

Edit `problems/problems.json`:

```json
{
  "id": "your-problem",
  "title": { "en": "Your Problem", "zh": "你的问题" },
  "difficulty": "Easy",
  "tags": ["array", "hash-table"],
  "description": { "en": "Problem description...", "zh": "问题描述..." },
  "template": { "js": "function solve() {\n  // Your code here\n}" },
  "tests": [
    { "input": "[1,2,3]", "output": "6" }
  ]
}
```

### Supported Languages

Currently supports multiple programming languages for problem solving:

- **JavaScript** - Full support with VM sandbox execution
- **Python** - Full support with interpreter execution
- **Java** - Full support with compilation and execution
- **C++** - Full support with compilation and execution
- **C** - Full support with compilation and execution

All languages are supported in the AI problem generator with appropriate templates and test cases.

## Language Support

- **English**: Full interface and problem descriptions
- **中文**: 完整的中文界面和题目描述
- **Switch Anytime**: Toggle between languages instantly

## Themes

- **Light Theme**: Perfect for daytime coding
- **Dark Theme**: Easy on the eyes for night flights
- **Auto-Detection**: Follows system preference
- **Persistent**: Remembers your choice

## Contributing

We welcome contributions! Areas for improvement:

- **More Problems**: Add classic algorithm challenges
- **More Languages**: Python, Java, C++ support
- **Enhanced Features**: Better performance analytics
- **Translations**: Additional language support

## License

MIT License - Feel free to use, modify, and distribute!

## Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
npm start -- -p 3001
# Or use the startup scripts which handle this automatically
```

**Node.js not found:**

- Download from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation

**Permission denied (Mac/Linux):**

```bash
chmod +x start-local.sh
```

**AI Generator not working:**

```bash
# Check if DEEPSEEK_API_KEY is set
echo $DEEPSEEK_API_KEY  # Unix
echo %DEEPSEEK_API_KEY% # Windows CMD
echo $env:DEEPSEEK_API_KEY # Windows PowerShell

# Set the API key (see AI Generator Setup section)
```

**Generated problem format errors:**

- Try rephrasing your request to be more specific
- Check your DeepSeek API key and account credits
- Ensure you have a stable internet connection during generation

### Need Help?

- Review the startup script output for specific error messages
- Ensure Node.js 16+ is properly installed
- See `AI_GENERATOR_README.md` for detailed AI Generator documentation

---

**Happy Coding at 30,000 feet! ✈️💻**

*Perfect for your next flight, cruise, or anywhere without reliable internet!*
