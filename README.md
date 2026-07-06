# 股票研究台

一个自用的 React/Vite 股票研究前端，用来发布研究报告、跟踪观察池、催化和下一步证据。

第一版基于 2026-07-06 的股票机会初筛，覆盖 TSLA、SPCX、AMD、NVDA、AVGO、RKLB。

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

初始界面参考 `docs/design-concept.png`：左侧导航、观察池表格、右侧单票研究面板、催化日历和来源质量记录。界面语言默认中文，因为这是自用研究系统。
