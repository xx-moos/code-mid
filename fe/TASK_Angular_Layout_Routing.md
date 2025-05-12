# 上下文
文件名：TASK_Angular_Layout_Routing.md
创建于：[获取当前日期时间]
创建者：AI Assistant
关联协议：RIPER-5 + Multidimensional + Agent Protocol 

# 任务描述
理解 Angular 项目，完成下列需求：angular 前端的布局，除了类别检索与后台管理入口对读者不可见，其他和原 vue 项目类似。原 vue 项目首页有轮播图，希望老师可以实现。当没有登录的时候默认展示首页，登录之后根据用户类型展示不同的页面。做好登录的 token 检查，当访问某些页面没有 token 的时候去登录页。写好逻辑，组件代码用户来写，划分好文件夹关系，做好归类。

# 项目概述
一个 Angular 前端项目，需要实现基于用户登录状态和角色的布局和路由。布局参考之前的 Vue 项目。

---
*以下部分由 AI 在协议执行过程中维护*
---

# 分析 (由 RESEARCH 模式填充)
- Angular 项目结构初步分析完成。
- 核心应用代码位于 `src/app` 目录下。
- 关键文件包括 `app.module.ts`, `app-routing.module.ts`, 和根组件 `app.component.*`。
- 存在 `pages/` 目录，推测用于存放页面组件。
- 存在 `common-header/` 目录，可能包含共享的头部组件。
- 缺少原 Vue 项目的布局信息，无法进行详细对比。

# 提议的解决方案 (由 INNOVATE 模式填充)
- **文件夹结构:**
  - `src/app/core/`: 放置核心服务 (`AuthService`) 和守卫 (`AuthGuard`, `RoleGuard` - 可选)。
  - `src/app/layout/`: 放置主布局组件 (`main-layout.component`)。
  - `src/app/pages/`: 存放页面组件 (`home/`, `login/`, `reader/`, `admin/`, `public/`)。
  - `src/app/shared/`: 放置共享组件 (如轮播图 `carousel/`)、指令、管道。
- **路由 (`app-routing.module.ts`):**
  - 公共路由 (`/login`, `/`)。
  - 受保护路由 (`/reader/*`, `/admin/*`) 使用 `AuthGuard`。
  - `AuthGuard` 检查 Token，无效则重定向到 `/login`。
  - 可选 `RoleGuard` 或在 `AuthGuard` 中集成角色检查，控制对 `/admin/*` 的访问。
  - 登录后根据角色导航。
- **认证 (`AuthService`, `AuthGuard`):**
  - `AuthService` 管理 Token、用户信息、登录/注销逻辑、角色获取和状态通知。
  - `AuthGuard` 实现 `CanActivate` (及可能的 `CanActivateChild`) 进行路由保护。
- **布局组件 (`main-layout.component`):**
  - 包含 `<router-outlet>`、公共页眉/页脚。
  - 导航菜单项根据用户角色动态显示/隐藏 (使用 `*ngIf` 和 `AuthService`)
- **首页轮播图:**
  - 实现于 `home.component` 或提取到 `shared/components/carousel/`。

# 实施计划 (由 PLAN 模式生成)
**[更改计划]**

1.  **创建核心文件夹和文件:**
    *   文件: `src/app/core/guards/auth.guard.ts`
        *   理由: 创建认证守卫，用于保护需要登录才能访问的路由。
    *   文件: `src/app/core/services/auth.service.ts`
        *   理由: 创建认证服务，用于处理登录、注销、Token 管理和用户角色获取。
    *   文件: `src/app/core/core.module.ts` (可选，但推荐)
        *   理由: 创建核心模块，用于提供单例服务 (`AuthService`) 和守卫 (`AuthGuard`)。
2.  **创建布局文件夹和文件:**
    *   文件: `src/app/layout/main-layout/main-layout.component.ts`
    *   文件: `src/app/layout/main-layout/main-layout.component.html`
    *   文件: `src/app/layout/main-layout/main-layout.component.scss`
        *   理由: 创建主布局组件的骨架，包含路由出口和可能的公共页眉/页脚。
    *   文件: `src/app/layout/layout.module.ts` (可选，但推荐)
        *   理由: 创建布局模块，用于声明和导出布局组件。
3.  **创建页面文件夹和组件骨架:**
    *   文件夹: `src/app/pages/home/`
        *   文件: `home.component.ts`, `home.component.html`, `home.component.scss`
        *   理由: 首页组件，对所有用户可见。轮播图将在此实现（由用户）。
    *   文件夹: `src/app/pages/login/`
        *   文件: `login.component.ts`, `login.component.html`, `login.component.scss`
        *   理由: 登录页面组件。
    *   文件夹: `src/app/pages/reader/`
        *   文件: `reader-dashboard.component.ts`, `reader-dashboard.component.html`, `reader-dashboard.component.scss` (示例，具体页面由用户定)
        *   理由: 读者区域的占位符页面。
    *   文件夹: `src/app/pages/admin/`
        *   文件: `admin-dashboard.component.ts`, `admin-dashboard.component.html`, `admin-dashboard.component.scss` (示例)
        *   理由: 管理员区域的占位符页面。
    *   文件: `src/app/pages/pages.module.ts` (可选，但推荐)
        *   理由: 创建页面模块，用于声明页面组件。
4.  **创建共享文件夹和组件骨架 (轮播图):**
    *   文件夹: `src/app/shared/components/carousel/`
        *   文件: `carousel.component.ts`, `carousel.component.html`, `carousel.component.scss`
        *   理由: 创建轮播图组件的骨架，供首页或其他地方使用。
    *   文件: `src/app/shared/shared.module.ts` (可选，但推荐)
        *   理由: 创建共享模块，用于声明和导出共享组件、指令、管道。
5.  **更新主应用模块 (`app.module.ts`):**
    *   文件: `src/app/app.module.ts`
        *   理由: 导入 `CoreModule`, `LayoutModule`, `PagesModule`, `SharedModule` (如果创建了这些模块) 以及 `HttpClientModule` (AuthService 可能需要)。配置 `AuthService` 和 `AuthGuard` 为提供者 (如果未使用 `CoreModule`)。
6.  **配置路由 (`app-routing.module.ts`):**
    *   文件: `src/app/app-routing.module.ts`
        *   理由: 定义路由规则，包括公共路由、使用 `AuthGuard` 的保护路由，以及可能的子路由和重定向。区分读者和管理员路由。

**实施检查清单:**

1.  创建文件夹 `src/app/core/guards` 和 `src/app/core/services`.
2.  创建文件 `src/app/core/guards/auth.guard.ts` 并添加基础守卫逻辑 (检查 Token, 重定向到 `/login`)。
3.  创建文件 `src/app/core/services/auth.service.ts` 并添加基础服务框架 (方法签名: `login`, `logout`, `isAuthenticated`, `getUserRole`)。
4.  (可选) 创建 `src/app/core/core.module.ts` 并提供 `AuthService` 和 `AuthGuard`。
5.  创建文件夹 `src/app/layout/main-layout`.
6.  创建文件 `src/app/layout/main-layout/main-layout.component.ts`, `.html`, `.scss` 并添加基础组件结构 (HTML 中包含 `<router-outlet>`)。
7.  (可选) 创建 `src/app/layout/layout.module.ts` 并声明/导出 `MainLayoutComponent`。
8.  创建文件夹 `src/app/pages/home`, `src/app/pages/login`, `src/app/pages/reader`, `src/app/pages/admin`.
9.  为 `home`, `login`, `reader-dashboard`, `admin-dashboard` 创建对应的 `.ts`, `.html`, `.scss` 组件骨架文件。
10. (可选) 创建 `src/app/pages/pages.module.ts` 并声明页面组件。
11. 创建文件夹 `src/app/shared/components/carousel`.
12. 为 `carousel` 创建对应的 `.ts`, `.html`, `.scss` 组件骨架文件。
13. (可选) 创建 `src/app/shared/shared.module.ts` 并声明/导出 `CarouselComponent`。
14. 更新 `src/app/app.module.ts`：导入所需模块 (Core, Layout, Pages, Shared, HttpClientModule)，在 `providers` 中添加 `AuthService`, `AuthGuard` (如果未使用 `CoreModule`)。
15. 更新 `src/app/app-routing.module.ts`：
    *   添加 `/login` 路由指向 `LoginComponent`。
    *   添加 `/` 路由，该路由外层包裹 `MainLayoutComponent`，内部默认展示 `HomeComponent`。
    *   添加 `/reader` 路由，外层包裹 `MainLayoutComponent`，使用 `AuthGuard` 保护，内部包含指向 `ReaderDashboardComponent` 的子路由 (例如 `/reader/dashboard`)。
    *   添加 `/admin` 路由，外层包裹 `MainLayoutComponent`，使用 `AuthGuard` (可能需要增加角色检查逻辑) 保护，内部包含指向 `AdminDashboardComponent` 的子路由 (例如 `/admin/dashboard`)。
    *   添加通配符路由 `**` 重定向到 `/` 或特定错误页面。

# 当前执行步骤 (由 EXECUTE 模式在开始执行某步骤时更新)
> 所有步骤执行完毕

# 任务进度 (由 EXECUTE 模式在每步完成后追加)
*   [日期时间]
    *   步骤：1. 创建文件夹 `src/app/core/guards` 和 `src/app/core/services`.
    *   修改：创建了文件夹 `src/app/core/guards`, `src/app/core/services`。
    *   更改摘要：创建核心功能文件夹。
    *   原因：执行计划步骤 1。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：2. 创建文件 `src/app/core/guards/auth.guard.ts` 并添加基础守卫逻辑 (检查 Token, 重定向到 `/login`)。
    *   修改：创建了 `src/app/core/guards/auth.guard.ts`。暂时注释了对 AuthService 的依赖。
    *   更改摘要：创建认证守卫骨架。
    *   原因：执行计划步骤 2。
    *   阻碍：AuthService 尚未创建，导致 Linter 错误，已临时解决。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：3. 创建文件 `src/app/core/services/auth.service.ts` 并添加基础服务框架 (方法签名: `login`, `logout`, `isAuthenticated`, `getUserRole`)。
    *   修改：创建了 `src/app/core/services/auth.service.ts`。
    *   更改摘要：创建认证服务骨架，包含模拟登录逻辑。
    *   原因：执行计划步骤 3。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：(修正) 恢复 `auth.guard.ts` 中对 `AuthService` 的依赖。
    *   修改：更新了 `src/app/core/guards/auth.guard.ts`。
    *   更改摘要：取消对 AuthService 的注释。
    *   原因：AuthService 已创建。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：5. 创建文件夹 `src/app/layout/main-layout`.
    *   修改：创建了文件夹 `src/app/layout/main-layout`。
    *   更改摘要：创建布局组件文件夹。
    *   原因：执行计划步骤 5。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：6. 创建文件 `src/app/layout/main-layout/main-layout.component.ts`, `.html`, `.scss` 并添加基础组件结构 (HTML 中包含 `<router-outlet>`)。
    *   修改：创建了 `main-layout.component.ts`, `.html`, `.scss`。
    *   更改摘要：创建主布局组件骨架。
    *   原因：执行计划步骤 6。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：8. 创建文件夹 `src/app/pages/home`, `src/app/pages/login`, `src/app/pages/reader`, `src/app/pages/admin`.
    *   修改：创建了 `src/app/pages/home`, `src/app/pages/login`, `src/app/pages/reader`, `src/app/pages/admin` 文件夹。
    *   更改摘要：创建页面组件文件夹。
    *   原因：执行计划步骤 8。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：9. 为 `home`, `login`, `reader-dashboard`, `admin-dashboard` 创建对应的 `.ts`, `.html`, `.scss` 组件骨架文件。
    *   修改：创建了 `home.component.*`, `login.component.*`, `reader-dashboard.component.*`, `admin-dashboard.component.*` 文件。
    *   更改摘要：创建页面组件骨架。
    *   原因：执行计划步骤 9。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：11. 创建文件夹 `src/app/shared/components/carousel`.
    *   修改：创建了文件夹 `src/app/shared/components/carousel`。
    *   更改摘要：创建共享轮播图组件文件夹。
    *   原因：执行计划步骤 11。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：12. 为 `carousel` 创建对应的 `.ts`, `.html`, `.scss` 组件骨架文件。
    *   修改：创建了 `carousel.component.*` 文件。
    *   更改摘要：创建轮播图组件骨架。
    *   原因：执行计划步骤 12。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：14. 更新 `src/app/app.module.ts`：导入所需模块 (HttpClientModule)，声明所有新创建的组件，并在 `providers` 中添加 `AuthService`, `AuthGuard`。
    *   修改：更新了 `src/app/app.module.ts`。
    *   更改摘要：在主模块中注册新组件和服务。
    *   原因：执行计划步骤 14。
    *   阻碍：无。
    *   用户确认状态：成功
*   [日期时间]
    *   步骤：15. 更新 `src/app/app-routing.module.ts`：添加公共路由、受保护路由、布局应用和通配符路由。
    *   修改：更新了 `src/app/app-routing.module.ts`。
    *   更改摘要：配置应用路由。
    *   原因：执行计划步骤 15。
    *   阻碍：无。
    *   用户确认状态：成功

# 最终审查 (由 REVIEW 模式填充)
实施与最终计划（包含执行过程中报告的微小修正）完全匹配。
- 所有请求的文件夹结构均已创建。
- AuthGuard 和 AuthService 的基础框架已建立，AuthGuard 能进行基础的 Token 检查和重定向。
- 主布局组件 MainLayoutComponent 已创建并包含 router-outlet。
- 各页面组件 (Home, Login, ReaderDashboard, AdminDashboard) 和共享组件 (Carousel) 的骨架已创建。
- AppModule 已更新，正确声明了新组件并提供了核心服务和守卫。
- AppRoutingModule 已配置，包含公共路由、使用 MainLayoutComponent 的布局路由、使用 AuthGuard 保护的 reader 和 admin 路由（admin 路由包含角色数据传递），以及通配符路由。
- 注意：AuthGuard 中具体的角色检查逻辑需要用户根据实际需求取消注释并完善。 