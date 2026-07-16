# 股票研究台

一个自用的 React/Vite 股票研究前端，用来发布研究报告、跟踪观察池、催化和下一步证据。

研究台目前覆盖 TSLA、RIVN、SPCX、AMD、NVDA、GOOGL、AVGO、RKLB；其中 Google 与 Rivian 研究更新至 2026-07-15 收盘。

生产环境只对外使用根路径作为统一入口。首页是交互式研究台，里面索引正式报告、单票备忘录、催化日历和来源质量记录；独立 HTML 报告仍保留为站内资源，但不作为主要分享链接。

当前站内报告：

- `/equity_idea_triage_2026-07-06.html`：股票机会初筛报告
- `/amd_deep_dive_2026-07-06.html`：AMD 深挖备忘录

`/hub` 继续保留为兼容入口，并回到同一个研究台。

## 命令

```bash
npm install
npm run dev
npm run build
npm run lint
```

## 设计

当前界面沿用已确认的“方案 2”机构研究台：左侧导航、AI 机会图谱、公司对比、右侧单票研究面板与底部催化剂轨道。视觉验收记录见 `design-qa.md`；界面语言默认中文，因为这是自用研究系统。
