# OfflineLeetPractice

> 本地运行的 LeetCode 风格编程练习系统，让你在 100% 离线环境下浏览、编码和测试算法题目——非常适合飞机上、游轮上或任何无网络场景。

## 为什么选择 OfflineLeetPractice？

**专为无网环境设计：**
- **飞行途中**: 充分利用长途飞行时间练习编程
- **游轮和偏远地区**: 在网络不稳定的地方继续学习
- **旅行和露营**: 随时随地练习算法
- **安全敏感环境**: 数据不会离开你的电脑
- **无需订阅**: 完全免费，无在线依赖

**为什么选择离线而非在线平台？**
- **即时响应**: 无网络延迟，代码立即执行
- **隐私保护**: 你的代码绝不离开你的电脑
- **始终可用**: 无需任何网络连接即可工作
- **可定制**: 添加你自己的题目和测试用例
- **专注学习**: 没有在线功能的干扰

## 功能特性

### 核心功能
- **本地题库**: 内置 10+ 道经典算法题目
- **AI 题目生成器**: 使用 DeepSeek-V3 AI 生成无限自定义题目
- **多语言支持**: 支持 JavaScript、Python、Java、C++ 和 C 语言编码和测试
- **Monaco 代码编辑器**: VS Code 级别的编辑体验
- **即时测试**: 立即运行测试并查看详细结果
- **性能指标**: 执行时间和内存使用量跟踪
- **双语支持**: 完整的中英文界面
- **深色/浅色主题**: 适应任何光线环境的舒适编码
- **动态题目管理**: 无需重新构建即可添加/编辑题目

### 非常适合学习
- **教育导向**: 题目难度从简单到困难
- **标签分类**: 数组、哈希表、动态规划等
- **参考解法**: 学习最优实现方案
- **进度跟踪**: 测试结果的可视化反馈

### AI 智能题目生成

- **自定义题目创建**: 用中文或英文描述你想练习的内容
- **多语言模板**: 生成的题目支持 JavaScript、Python、Java、C++ 和 C
- **完整解法**: 每个题目都包含工作的参考解法
- **全面测试**: 自动生成包括边界情况的测试用例
- **即时集成**: 题目自动添加到你的本地库中
- **离线优先**: 在线生成题目，永久离线练习

**AI 请求示例：**
- "我想做一道动态规划题目"
- "Generate a medium difficulty array problem using two pointers"
- "创建一个关于字符串处理的题目，使用滑动窗口算法"

## AI 生成器设置（可选）

**生成无限自定义题目：**

### 获取 DeepSeek API 密钥
1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 创建账户并获取 API 密钥
3. 设置环境变量：

#### Windows (PowerShell)：
```powershell
$env:DEEPSEEK_API_KEY="your_api_key_here"
```

#### macOS/Linux：
```bash
export DEEPSEEK_API_KEY="your_api_key_here"
```

#### 或创建 `.env.local` 文件：
```bash
DEEPSEEK_API_KEY=your_api_key_here
```

**注意**：AI 生成器需要网络来生成题目，但生成的题目可以永久离线使用！

## 快速开始（无需网络）

### 系统要求
- **Node.js** 16+ ([点击下载](https://nodejs.org/))
- 任意现代网页浏览器

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
2. 安装依赖 (npm install)
3. 构建应用 (npm run build)
4. 启动本地服务器

然后在浏览器中打开 **http://localhost:3000** 即可！

### 手动安装（备选方案）
```bash
# 克隆仓库
git clone https://github.com/yourusername/OfflineLeetPractice.git
cd OfflineLeetPractice

# 安装依赖
npm install

# 构建生产版本
npm run build

# 启动服务器
npm start
```

## 使用方法

### 基本题目解决
1. **浏览题目**: 查看包含难度和标签的题目列表
2. **选择题目**: 点击任意题目打开详情页面
3. **选择语言**: 从下拉菜单中选择你喜欢的编程语言
4. **编写解法**: 使用 Monaco 编辑器（支持自动补全、语法高亮）
5. **运行测试**: 点击"提交并运行测试"执行你的代码
6. **查看结果**: 查看测试结果和性能指标

### AI 题目生成
1. **访问 AI 生成器**: 点击首页的"AI 生成器"按钮
2. **描述你的需求**: 用中文或英文输入你想要的题目类型：
   - "我想做一道中等难度的动态规划题目"
   - "Generate a medium array manipulation problem using sliding window"
3. **生成题目**: AI 创建包含测试用例和解法的完整题目
4. **立即练习**: 生成的题目自动添加到你的库中
5. **离线使用**: 一旦生成，就可以完全离线练习题目

### 添加自定义题目
1. **手动添加**: 使用"添加题目"页面添加自定义题目
2. **JSON 导入**: 上传或粘贴 JSON 格式的题目数据
3. **直接编辑**: 修改 `public/problems.json` 即时生效（无需重新构建）

### 性能监控
每次测试运行都会显示：
- **总执行时间**: 运行所有测试用例的时间
- **平均时间**: 每个测试用例的平均执行时间
- **内存使用**: 消耗的堆内存
- **单独测试结果**: 每个用例的通过/失败状态

## 飞机模式使用指南

### 起飞前准备
1. **下载和设置**: 在有网络时克隆仓库并运行设置
2. **测试运行**: 确保一切正常：`npm run build && npm start`
3. **验证离线**: 断开网络连接并测试应用

### 飞行途中
1. **启动应用**: 运行 `start-local.bat` (Windows) 或 `./start-local.sh` (Mac/Linux)
2. **打开浏览器**: 导航到 `http://localhost:3000`
3. **开始编程**: 无网络依赖地练习算法！

### 飞行中的生产力技巧
- **专注基础**: 练习核心算法（排序、搜索、动态规划）
- **做笔记**: 使用编辑器记录你的学习心得
- **迭代解法**: 优化代码以获得更好的性能
- **跟踪进度**: 使用性能指标来改进

## 技术栈

- **前端**: React 18 + Next.js 13 + TypeScript
- **UI 框架**: Mantine v7 (现代 React 组件)
- **代码编辑器**: Monaco Editor (VS Code 引擎)
- **代码执行**: vm2 (安全的 JavaScript 沙箱)
- **样式**: CSS Modules + 深色/浅色主题
- **国际化**: 内置 i18n 支持

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
│   ├── contexts/          # React 上下文 (国际化, 主题)
│   └── styles/            # 全局样式
├── locales/              # 国际化文件
│   ├── en.json           # 英文翻译
│   └── zh.json           # 中文翻译
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

**非常适合：**
- ✈️ 飞行过程中添加练习题目
- 🏫 教师为学生定制题目
- 🎯 创建公司专属编程挑战
- 📚 构建个人算法库

**例子**: 通过编辑 `public/problems.json` 添加新题目：
```json
{
  "id": "reverse-string",
  "title": { "en": "Reverse String", "zh": "反转字符串" },
  "difficulty": "Easy",
  "tags": ["string"],
  "description": { "en": "Reverse a string...", "zh": "反转字符串..." },
  "template": { "js": "function reverse(s) {\n  // 你的代码\n}\nmodule.exports = reverse;" },
  "tests": [{ "input": "\"hello\"", "output": "\"olleh\"" }]
}
```

查看 **`MODIFY-PROBLEMS-GUIDE.md`** 获取完整说明！

### 添加新题目
编辑 `problems/problems.json`:
```json
{
  "id": "your-problem",
  "title": { "en": "Your Problem", "zh": "你的问题" },
  "difficulty": "Easy",
  "tags": ["array", "hash-table"],
  "description": { "en": "Problem description...", "zh": "问题描述..." },
  "template": { "js": "function solve() {\n  // 在这里编写代码\n}" },
  "tests": [
    { "input": "[1,2,3]", "output": "6" }
  ]
}
```

### 支持的语言

当前支持多种编程语言进行问题求解：

- **JavaScript** - 完整支持，通过 VM 沙箱执行
- **Python** - 完整支持，通过解释器执行
- **Java** - 完整支持，支持编译和执行
- **C++** - 完整支持，支持编译和执行
- **C** - 完整支持，支持编译和执行

所有语言都在 AI 问题生成器中得到支持，配有相应的模板和测试用例。

## 语言支持

- **English**: 完整的英文界面和题目描述
- **中文**: 完整的中文界面和题目描述
- **随时切换**: 即时在语言间切换
- **记住选择**: 保存你的语言偏好

## 主题

- **浅色主题**: 适合日间编程
- **深色主题**: 夜间飞行护眼模式
- **自动检测**: 跟随系统偏好
- **持久化**: 记住你的选择

## 贡献

我们欢迎贡献！改进方向：
- **更多题目**: 添加经典算法挑战
- **更多语言**: Python、Java、C++ 支持
- **增强功能**: 更好的性能分析
- **翻译**: 更多语言支持

## 许可证

MIT 许可证 - 随意使用、修改和分发！

## 故障排除

### 常见问题

**端口 3000 已被占用：**
```bash
npm start -- -p 3001
# 或使用启动脚本，它们会自动处理这个问题
```

**未找到 Node.js：**
- 从 [nodejs.org](https://nodejs.org/) 下载
- 安装后重启终端

**权限被拒绝 (Mac/Linux)：**
```bash
chmod +x start-local.sh
```

**AI 生成器无法工作：**
```bash
# 检查 DEEPSEEK_API_KEY 是否设置
echo $DEEPSEEK_API_KEY  # Unix
echo %DEEPSEEK_API_KEY% # Windows CMD
echo $env:DEEPSEEK_API_KEY # Windows PowerShell

# 设置 API 密钥（参见 AI 生成器设置部分）
```

**生成的题目格式错误：**
- 尝试更具体地描述你的需求
- 检查你的 DeepSeek API 密钥和账户余额
- 确保生成过程中网络连接稳定

### 需要帮助？
- 🔍 查看启动脚本输出的具体错误信息
- 🛠️ 确保正确安装了 Node.js 16+
- 🤖 查看 `AI_GENERATOR_README.md` 获取 AI 生成器详细说明

---

**在 30,000 英尺高空愉快编程！ ✈️💻**

*完美适用于你的下一次飞行、游轮旅行或任何没有可靠网络的地方！*