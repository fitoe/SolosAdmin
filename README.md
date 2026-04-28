# Solos Admin

通用后台模板，基于 `Vue 3 + Vite + TypeScript`。

## 技术栈

- `Vue 3` + `<script setup>`
- `Vue Router` + `unplugin-vue-router`
- `Pinia`
- `Element Plus`
- `UnoCSS` + `Iconify`
- `alova`
- `ECharts`
- `MdEditorV3`
- `xlsx`

## 已实现能力

- 页面路由驱动：页面文件即入口，权限和标题等放 `definePage().meta`
- 自动导入：Vue API、Router API、Pinia、stores、composables、components
- 后台壳子：侧边栏、顶栏、标签页、面包屑、内容区
- 无限层级菜单：从路由树递归派生
- 权限：登录态、角色路由权限、按钮 permission keys
- 请求层：`alova/fetch` 统一封装，示例里带 mock fetch
- 页面模板：列表、表单、详情
- 增强页：图表、Markdown、上传、Excel、全局搜索

## 目录约定

- `src/pages`: 页面路由与页面 meta 唯一配置源
- `src/layouts`: 后台布局壳子
- `src/components/admin`: 后台模板通用组件
- `src/stores`: `app/user/permission/tabs`
- `src/api`: `alova` 客户端、mock、模块 API
- `src/composables`: 页面查询、权限、tabs、搜索等复用逻辑
- `src/router`: 路由守卫、菜单派生、权限过滤

## 本地运行

```bash
pnpm install
pnpm dev
```

## 后端模式切换

默认开发环境走 `mock`。

- `VITE_API_MODE=mock`
  - 使用 `src/api/mock.ts`
  - 适合模板演示和本地开发
- `VITE_API_MODE=real`
  - 走真实后端
  - 需要配置 `VITE_API_BASE_URL`

环境文件：

- `.env.development`: 默认本地 mock
- `.env.production`: 默认真实后端
- `.env.example`: 环境变量示例

真实后端接入时，至少需要提供：

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/profile`
- `GET /auth/access`

以及你的业务模块 API。

## 测试与构建

```bash
pnpm test
pnpm build
pnpm lint
pnpm format:check
```

## 新增页面方式

1. 在 `src/pages` 下新增 `.vue` 页面。
2. 在页面里写 `definePage({ meta: ... })`。
3. 如果要进菜单，给 `meta.title`，不要设 `hidden`。
4. 如果要权限控制，补 `roles` 或 `permissions`。
5. 如果有接口，去 `src/api/modules` 新增 `alova` method。

## 当前默认

- 桌面优先，不做移动端适配
- 多标签页默认开启
- 表单页默认单栏
- `mock fetch` 作为首版演示数据源
- 生产环境默认示例为真实后端模式，需自行替换 `VITE_API_BASE_URL`

## 路由 Meta 约定

- `title`: 菜单、标签页、面包屑文案
- `icon`: 菜单图标
- `requiresAuth`: 是否需要登录，默认需要
- `roles`: 路由级角色控制
- `permissions`: 按钮级权限 key
- `hidden`: 是否从菜单隐藏
- `keepAlive`: 是否参与缓存
- `affix`: 是否固定标签页
- `activeMenu`: 高亮指定菜单

## 质量门槛

- `pnpm test`: 运行 Vitest
- `pnpm build`: 校验类型并执行生产构建
- `pnpm lint`: 运行 ESLint
- `pnpm format:check`: 检查 Prettier 格式

## 后续建议

- 给 `vendor-echarts` 和 `vendor-markdown` 再做路由级预取策略
- 增加更细的组件测试
