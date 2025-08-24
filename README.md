# OfflineLeetPractice

[中文](./README-zh.md)

> A local-run LeetCode-style coding practice system that lets you browse, code, and test problems 100% offline—perfect for planes, cruises, or any no-internet scenario.

<img width="2536" height="1219" alt="2025-08-24165250" src="https://github.com/user-attachments/assets/17846e96-32e8-479f-9193-02a2fc8db017" />

<img width="2545" height="1229" alt="2025-08-24165302" src="https://github.com/user-attachments/assets/93116550-60af-41aa-b0f3-cc2b10fd5ac5" />

<img width="1236" height="1057" alt="屏幕截图 2025-08-24 210556" src="https://github.com/user-attachments/assets/6c1fe0f2-df1b-4cc9-a78e-8f0d88b87c24" />

## Quick Start

### Prerequisites

- **Node.js** 16+ ([Download here](https://nodejs.org/))
- Any modern web browser

> **Note**: Internet is only required for the initial setup and build. Once built, the application works completely offline.

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
2. Install dependencies (npm install) - *Requires internet*
3. Build the application (npm run build) - *Requires internet*
4. Start the local server

Then open **http://localhost:3000** in your browser!

> **Note**: After the initial build, you can use the application offline without rebuilding.

### Manual Setup (Alternative)

```bash
# Clone the repository
git clone https://github.com/yourusername/OfflineLeetPractice.git
cd OfflineLeetPractice

# Install dependencies - Requires internet
npm install

# Build for production - Requires internet
npm run build

# Start the server (works offline)
npm start
```

## Features

### Core Functionality

- **Local Problem Library**: 10+ classic algorithm problems included
- **AI Problem Generator**: Generate unlimited custom problems with DeepSeek-V3 AI
- **Multi-Language Support**: Code and test in JavaScript, Python, Java, C++, or C
- **Monaco Code Editor**: VS Code-like editing experience
- **Instant Testing**: Run tests immediately with detailed results
- **Performance Metrics**: Execution time and memory usage tracking
- **Dynamic Problem Management**: Add/edit problems without rebuilding

### AI-Powered Problem Generation

- **Custom Problem Creation**: Describe what you want to practice
- **Complete Solutions**: Each problem includes working reference solutions
- **Comprehensive Testing**: Auto-generated test cases including edge cases
- **Instant Integration**: Problems automatically added to your local library

## How to Use

### Basic Problem Solving
1. **Browse Problems**: View the problem list with difficulty and tags
2. **Select a Problem**: Click on any problem to open the detail page
3. **Code Your Solution**: Use the Monaco editor (supports autocomplete, syntax highlighting)
4. **Run Tests**: Click "Submit & Run Tests" to execute your code
5. **View Results**: See test results with performance metrics

### AI Problem Generation
1. **Access AI Generator**: Click the "AI Generator" button on the homepage
2. **Describe Your Need**: Enter what type of problem you want
3. **Generate Problem**: AI creates a complete problem with test cases and solutions
4. **Practice Immediately**: Generated problem is auto-added to your library

### Adding Custom Problems
1. **Manual Addition**: Use the "Add Problem" page for custom problems
2. **JSON Import**: Upload or paste problem data in JSON format
3. **Direct Edit**: Modify `public/problems.json` for immediate changes (no rebuild needed)

## Technology Stack

- **Frontend**: React 18 + Next.js 13 + TypeScript
- **UI Framework**: Mantine v7 (Modern React components)
- **Code Editor**: Monaco Editor (VS Code engine)
- **Code Execution**: vm2 (Secure JavaScript sandbox)

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
│   └── styles/            # Global styles
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

**Example**: Add a new problem by editing `public/problems.json`:
```json
{
  "id": "reverse-string",
  "title": {
    "en": "Reverse String",
    "zh": "反转字符串"
  },
  "difficulty": "Easy",
  "tags": ["string"],
  "description": {
    "en": "Write a function that reverses a string.",
    "zh": "编写一个函数来反转字符串。"
  },
  "template": {
    "js": "function reverseString(s) {\n  // Your code here\n}\nmodule.exports = reverseString;"
  },
  "tests": [
    { "input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]" }
  ]
}
```

See **`MODIFY-PROBLEMS-GUIDE.md`** for complete instructions!

### Adding New Problems

Edit `public/problems.json`:

```json
{
  "id": "your-problem",
  "title": {
    "en": "Your Problem",
    "zh": "你的问题"
  },
  "difficulty": "Easy",
  "tags": ["array", "hash-table"],
  "description": {
    "en": "Problem description...",
    "zh": "问题描述..."
  },
  "template": {
    "js": "function solve() {\n  // Your code here\n}\nmodule.exports = solve;"
  },
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

## Contributing

We welcome contributions! Areas for improvement:

- **More Problems**: Add classic algorithm challenges
- **More Languages**: Python, Java, C++ support
- **Enhanced Features**: Better performance analytics

## License

MIT License - Feel free to use, modify, and distribute!

---

**Happy Coding at 30,000 feet! ✈️💻**
*Perfect for your next flight, cruise, or anywhere without reliable internet!*