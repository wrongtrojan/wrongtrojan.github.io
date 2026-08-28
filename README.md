## 个人博客

基于 Astro 的静态个人博客，记录数学、计算机科学与文学创作。视觉延续 Dracula 配色与 JetBrains Mono，部署在 [GitHub Pages](https://wrongtrojan.github.io/)。

## 本地开发

```bash
npm install
npm run dev
```

生产构建（包含 Pagefind 搜索索引）：

```bash
npm run build
npm run preview
```

内容位于 `src/content/note/` 与 `src/content/create/`。支持 Markdown 和 MDX。

## 项目结构

```text
src/
  content/note/      # 学习笔记（按文件夹分层）
  content/create/    # 创作内容
  pages/             # 路由（note/create 自动生成）
  components/        # 页面组件
  data/site.ts       # 站点信息与导航
public/              # 静态资源（PDF、pdf.js 等）
```

## 内容

- **学习笔记**：主要是数学学习和计算机科学学习
- **个人创作**：偶尔也有个人创作，大多是短篇小说
