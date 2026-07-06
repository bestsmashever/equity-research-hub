# 股票研究台

一个自用的 React/Vite 股票研究前端，用来发布研究报告、跟踪观察池、催化和下一步证据。

第一版基于 2026-07-06 的股票机会初筛，覆盖 TSLA、SPCX、AMD、NVDA、AVGO、RKLB。

生产环境首页会进入 `/equity_idea_triage_2026-07-06.html` 这份报告；交互式研究台在 `/hub`。

## 命令

```bash
npm install
npm run dev
npm run build
npm run lint
```

## 设计

初始界面参考 `docs/design-concept.png`：左侧导航、观察池表格、右侧单票研究面板、催化日历和来源质量记录。界面语言默认中文，因为这是自用研究系统。
