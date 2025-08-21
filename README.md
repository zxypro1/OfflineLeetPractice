离线 LeetCode 练习系统 (最小可运行骨架)

目标
- Next.js + TypeScript 前后端同构项目
- 本地题库（JSON）包含题目、测试用例、标准答案
- 页面内可浏览题目、编辑代码（Monaco）、提交并在本地执行测试用例
- 本示例实现核心流程，便于后续扩展 AI 出题/批卷

运行
1. 在项目根目录运行：

```powershell
npm install
npm run dev
```

2. 打开浏览器访问 http://localhost:3000

说明
- 使用 `vm2` 在服务器端安全地运行用户提交的 JS 代码并对其进行测试（仅支持 JS/TS -> JS 运行）。
- UI 使用 Mantine（漂亮、轻量）。
- Monaco 编辑器用于题目作答。

后续建议
- 增加题目管理 UI、用户账户、提交记录
- 支持更多语言（通过 docker 或沙箱运行）
- 增强安全策略，限制资源与运行时间
