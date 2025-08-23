# OfflineLeetPractice ✈️

[中文](./README-zh.md)

> A local-run LeetCode-style coding practice system that lets you browse, code, and test problems 100% offline—perfect for planes, cruises, or any no-internet scenario.

## 🌟 Why OfflineLeetPractice?

**Perfect for No-Internet Scenarios:**

- ✈️ **On Flights**: Make productive use of long flights by practicing coding
- 🚢 **Cruises & Remote Areas**: Continue learning where internet is unreliable
- 🏕️ **Camping & Travel**: Practice algorithms anywhere, anytime
- 🔒 **Security-Conscious Environments**: No data leaves your machine
- 💰 **No Subscription Required**: Completely free, no online dependencies

**Why Choose Offline Over Online Platforms?**

- 🚀 **Instant Response**: No network latency, immediate code execution
- 🔐 **Privacy**: Your code never leaves your computer
- 📚 **Always Available**: Works without any internet connection
- 💻 **Customizable**: Add your own problems and test cases
- 🎯 **Focused Learning**: No distractions from online features

## 🎯 Features

### Core Functionality

- 📝 **Local Problem Library**: 10+ classic algorithm problems included
- 💻 **Monaco Code Editor**: VS Code-like editing experience
- ⚡ **Instant Testing**: Run tests immediately with detailed results
- 📊 **Performance Metrics**: Execution time and memory usage tracking
- 🌍 **Bilingual Support**: Full Chinese and English interface
- 🌙 **Dark/Light Theme**: Comfortable coding in any lighting

### Perfect for Learning

- 🎓 **Educational Focus**: Problems range from Easy to Hard difficulty
- 🏷️ **Tagged Categories**: Array, Hash Table, Dynamic Programming, etc.
- 💡 **Reference Solutions**: Study optimal implementations
- 📈 **Progress Tracking**: Visual feedback on test results

## 🚀 Quick Start (No Internet Required)

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

1. ✅ Check Node.js installation
2. 📦 Install dependencies (npm install)
3. 🔨 Build the application (npm run build)
4. 🌐 Start the local server

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

## 📱 How to Use

1. **Browse Problems**: View the problem list with difficulty and tags
2. **Select a Problem**: Click on any problem to open the detail page
3. **Code Your Solution**: Use the Monaco editor (supports autocomplete, syntax highlighting)
4. **Run Tests**: Click "Submit & Run Tests" to execute your code
5. **View Results**: See test results with performance metrics

### Performance Monitoring

Each test run shows:

- ⏱️ **Total Execution Time**: Time to run all test cases
- 📊 **Average Time**: Per test case execution time
- 💾 **Memory Usage**: Heap memory consumed
- 🔍 **Individual Test Results**: Pass/fail status for each case

## 🛫 Airplane Mode Setup Guide

### Before Your Flight

1. **Download & Setup**: Clone the repo and run setup while you have internet
2. **Test Run**: Ensure everything works: `npm run build && npm start`
3. **Verify Offline**: Disconnect internet and test the application

### During Flight

1. **Start Application**: Run `start-local.bat` (Windows) or `./start-local.sh` (Mac/Linux)
2. **Open Browser**: Navigate to `http://localhost:3000`
3. **Code Away**: Practice algorithms without any internet dependency!

### Flight Productivity Tips

- 🎯 **Focus on Fundamentals**: Practice core algorithms (sorting, searching, DP)
- 📝 **Take Notes**: Use the editor to document your learning
- 🔄 **Iterate Solutions**: Optimize your code for better performance
- 📊 **Track Progress**: Use the performance metrics to improve

## 🏗️ Technology Stack

- **Frontend**: React 18 + Next.js 13 + TypeScript
- **UI Framework**: Mantine v7 (Modern React components)
- **Code Editor**: Monaco Editor (VS Code engine)
- **Code Execution**: vm2 (Secure JavaScript sandbox)
- **Styling**: CSS Modules + Dark/Light themes
- **Internationalization**: Built-in i18n support

## 📂 Project Structure

```
OfflineLeetPractice/
├── pages/                  # Next.js pages and API routes
│   ├── api/
│   │   ├── problems.ts     # Problem data API
│   │   └── run.ts          # Code execution API
│   ├── problems/[id].tsx   # Problem detail page
│   └── index.tsx           # Homepage
├── problems/
│   └── problems.json       # Local problem database
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts (i18n, theme)
│   └── styles/            # Global styles
├── start-local.bat        # Windows startup script
├── start-local.sh         # Unix startup script
└── README-cross-platform.md
```

## 🔧 Customization

### Adding New Problems (No Rebuild Required!) 🎯

**The application supports adding/modifying problems in offline environments without rebuilding!**

1. **Edit the Problem Database**: Open `public/problems.json` in your built application folder
2. **Add Your Problem**: Follow the JSON format (see `MODIFY-PROBLEMS-GUIDE.md` for details)
3. **Save and Refresh**: Changes take effect immediately!

**Perfect for:**
- ✈️ Adding practice problems during flights
- 🏫 Teachers customizing problems for students
- 🎯 Creating company-specific coding challenges
- 📚 Building personal algorithm libraries

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

Currently supports **JavaScript** with plans to add:

- Python
- Java
- C++
- TypeScript (enhanced)

## 🌐 Language Support

- **English**: Full interface and problem descriptions
- **中文**: 完整的中文界面和题目描述
- **Switch Anytime**: Toggle between languages instantly

## 🎨 Themes

- **Light Theme**: Perfect for daytime coding
- **Dark Theme**: Easy on the eyes for night flights
- **Auto-Detection**: Follows system preference
- **Persistent**: Remembers your choice

## 🤝 Contributing

We welcome contributions! Areas for improvement:

- 📚 **More Problems**: Add classic algorithm challenges
- 🗣️ **More Languages**: Python, Java, C++ support
- 🎯 **Enhanced Features**: Better performance analytics
- 🌍 **Translations**: Additional language support

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🛟 Troubleshooting

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

### Need Help?

- 📖 Check `README-cross-platform.md` for detailed setup instructions
- 🔍 Review the startup script output for specific error messages
- 🛠️ Ensure Node.js 16+ is properly installed

---

**Happy Coding at 30,000 feet! ✈️💻**

*Perfect for your next flight, cruise, or anywhere without reliable internet!*
