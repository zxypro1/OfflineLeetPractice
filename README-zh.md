# OfflineLeetPractice

> 本地运行的 LeetCode 风格编程练习系统，让你在 100% 离线环境下浏览、编码和测试算法题目——非常适合飞机上、游轮上或任何无网络场景。

<img width="2524" height="1223" alt="2025-08-24165202" src="https://github.com/user-attachments/assets/0c5a4952-77c1-41be-9cdc-fd8fe1db4b8a" />

<img width="2542" height="1221" alt="2025-08-2165223" src="https://github.com/user-attachments/assets/5b9298e2-fa5b-4596-9694-733132ea509f" />

<img width="1302" height="1001" alt="2025-08-24210533" src="https://github.com/user-attachments/assets/efa542ae-137a-4150-892b-0608255cef8c" />

## 快速开始

### 系统要求
- **Node.js** 16+ ([点击下载](https://nodejs.org/))
- 任意现代网页浏览器

> **注意**: 仅在首次设置和构建时需要网络连接。构建完成后，应用可完全离线使用。

### 一键启动

#### Windows 用户
```bash
# 双击运行或在终端中执行
start-local.bat
```

#### macOS / Linux 用户
```bash
# 首次使用需要赋予执行权限
chmod +x start-local.sh

# 运行启动脚本
./start-local.sh
```

启动脚本会自动：
1. 检查 Node.js 安装
2. 安装依赖 (npm install) - *需要网络*
3. 构建应用 (npm run build) - *需要网络*
4. 启动本地服务器

然后在浏览器中打开 **http://localhost:3000** 即可！

> **注意**: 首次构建完成后，您可以离线使用应用而无需重新构建。

### 手动安装（备选方案）
```bash
# 克隆仓库
git clone https://github.com/yourusername/OfflineLeetPractice.git
cd OfflineLeetPractice

# 安装依赖 - 需要网络
npm install

# 构建生产版本 - 需要网络
npm run build

# 启动服务器（可离线工作）
npm start
```

## 功能特性

### 核心功能
- **本地题库**: 内置 10+ 道经典算法题目
- **AI 题目生成器**: 使用 DeepSeek-V3 AI 生成无限自定义题目
- **多语言支持**: 支持 JavaScript、Python、Java、C++ 和 C 语言编码和测试
- **Monaco 代码编辑器**: VS Code 级别的编辑体验
- **即时测试**: 立即运行测试并查看详细结果
- **性能指标**: 执行时间和内存使用量跟踪
- **动态题目管理**: 无需重新构建即可添加/编辑题目

### AI 智能题目生成

- **自定义题目创建**: 用中文描述你想练习的内容
- **完整解法**: 每个题目都包含工作的参考解法
- **全面测试**: 自动生成包括边界情况的测试用例
- **即时集成**: 题目自动添加到你的本地库中

## 使用方法

### 基本题目解决
1. **浏览题目**: 查看包含难度和标签的题目列表
2. **选择题目**: 点击任意题目打开详情页面
3. **编写解法**: 使用 Monaco 编辑器（支持自动补全、语法高亮）
4. **运行测试**: 点击"提交并运行测试"执行你的代码
5. **查看结果**: 查看测试结果和性能指标

### AI 题目生成
1. **访问 AI 生成器**: 点击首页的"AI 生成器"按钮
2. **描述你的需求**: 输入你想要的题目类型
3. **生成题目**: AI 创建包含测试用例和解法的完整题目
4. **立即练习**: 生成的题目自动添加到你的库中

### 添加自定义题目
1. **手动添加**: 使用"添加题目"页面添加自定义题目
2. **JSON 导入**: 上传或粘贴 JSON 格式的题目数据
3. **直接编辑**: 修改 `public/problems.json` 即时生效（无需重新构建）

## 技术栈

- **前端**: React 18 + Next.js 13 + TypeScript
- **UI 框架**: Mantine v7 (现代 React 组件)
- **代码编辑器**: Monaco Editor (VS Code 引擎)
- **代码执行**: vm2 (安全的 JavaScript 沙箱)

## 项目结构

```
OfflineLeetPractice/
├── pages/                  # Next.js 页面和 API 路由
│   ├── api/
│   │   ├── problems.ts     # 题目数据 API
│   │   ├── run.ts          # 代码执行 API
│   │   ├── generate-problem.ts # AI 题目生成 API
│   │   └── add-problem.ts  # 手动添加题目 API
│   ├── problems/[id].tsx   # 题目详情页面
│   ├── generator.tsx       # AI 生成器页面
│   ├── add-problem.tsx     # 手动添加题目页面
│   └── index.tsx           # 首页
├── problems/
│   └── problems.json       # 本地题目数据库
├── src/
│   ├── components/         # React 组件
│   │   ├── ProblemGenerator.tsx # AI 生成器组件
│   │   ├── ProblemForm.tsx     # 手动添加题目表单
│   │   └── LanguageThemeControls.tsx # 语言/主题切换器
│   └── styles/            # 全局样式
├── start-local.bat        # Windows 启动脚本
├── start-local.sh         # Unix 启动脚本
└── AI_GENERATOR_README.md # AI 生成器详细文档
```

## 自定义

### 添加新题目（无需重新构建！）🎯

**应用支持在离线环境下添加/修改题目，无需重新构建！**

1. **编辑题目数据库**: 在构建后的应用文件夹中打开 `public/problems.json`
2. **添加你的题目**: 按照 JSON 格式（详见 `MODIFY-PROBLEMS-GUIDE.md`）
3. **保存并刷新**: 更改立即生效！

**例子**: 通过编辑 `public/problems.json` 添加新题目：
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
    "js": "function reverseString(s) {\n  // 你的代码\n}\nmodule.exports = reverseString;"
  },
  "tests": [
    { "input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]" }
  ]
}
```

查看 **`MODIFY-PROBLEMS-GUIDE.md`** 获取完整说明！

### 添加新题目

编辑 `public/problems.json`:

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
    "js": "function solve() {\n  // 在这里编写代码\n}\nmodule.exports = solve;"
  },
  "tests": [
    { "input": "[1,2,3]", "output": "6" }
  ]
}
```

## 贡献

我们欢迎贡献！改进方向：
- **更多题目**: 添加经典算法挑战
- **更多语言**: Python、Java、C++ 支持
- **增强功能**: 更好的性能分析

## 许可证

MIT 许可证 - 随意使用、修改和分发！

---

**在 30,000 英尺高空愉快编程！ ✈️💻**

*完美适用于你的下一次飞行、游轮旅行或任何没有可靠网络的地方！*