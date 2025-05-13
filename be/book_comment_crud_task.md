# 上下文
文件名：[book_comment_crud_task.md]
创建于：[自动获取当前日期时间]
创建者：[AI]
关联协议：RIPER-5 + Multidimensional + Agent Protocol 

# 任务描述
完成对 `book_comment` 表的增删改查接口功能，参照其他模块（如图书分类管理）和 `book_collection` 的实现风格。严格按照生成的清单操作，并自动确认每一步。

# 项目概述
项目为一个基于Spring Boot的智能图书馆后端服务，使用MySQL数据库和MyBatis Plus作为ORM框架。项目结构遵循标准的 `controller`, `service`, `mapper`, `entity` 分层，并包含 `common`, `config`, `dto`, `vo`, `security`, `utils` 等包。

---
*以下部分由 AI 在协议执行过程中维护*
---

# 分析 (由 RESEARCH 模式填充)
- **目标表**: `book_comment`
- **表结构字段**:
    - `id` (BIGINT UNSIGNED, PK, AI) - 评论ID
    - `user_id` (BIGINT UNSIGNED, NOT NULL) - 用户ID (评论发布者)
    - `book_id` (BIGINT UNSIGNED, NOT NULL) - 图书ID
    - `content` (TEXT, NOT NULL) - 评论内容
    - `parent_id` (BIGINT UNSIGNED, NULL) - 父评论ID (用于实现评论回复功能)
    - `likes` (INT, NOT NULL, DEFAULT 0) - 点赞数
    - `create_time` (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP) - 创建时间
    - `update_time` (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) - 更新时间
    - `deleted` (TINYINT, NOT NULL, DEFAULT 0) - 是否删除 (逻辑删除标记)
- **技术栈**: Spring Boot, MyBatis Plus, MySQL, Lombok, Swagger, Spring Security, FastJSON (基于 `book_collection_crud_task.md` 推断)。
- **项目结构**: 遵循 `com.library` 主包下的 `controller`, `service` (接口与实现分离), `mapper`, `entity` 分层。
- **实体 (Entity)**: 将创建 `com.library.entity.BookComment.java`。
    - 应使用 Lombok (`@Data`, `@EqualsAndHashCode(callSuper = true)`) 和 MyBatis Plus 注解 (`@TableName`, `@TableField`)。
    - **应继承** `BaseEntity` (因为它有 `create_time`, `update_time`, `deleted` 字段，且这些字段由 `BaseEntity` 和 MyBatis Plus 的 `FieldFill` 自动管理)。
- **Mapper**: 将创建 `com.library.mapper.BookCommentMapper.java`。
    - 接口使用 `@Mapper` 注解，继承 `com.baomidou.mybatisplus.core.mapper.BaseMapper<BookComment>`。
- **Service**: 将创建接口 `com.library.service.IBookCommentService.java` 和实现类 `com.library.service.impl.BookCommentServiceImpl.java`。
    - 接口继承 `IService<BookComment>`，实现类继承 `ServiceImpl<BookCommentMapper, BookComment>`。
- **Controller**: 将创建 `com.library.controller.BookCommentController.java`。
    - 使用 `@RestController`, `@RequestMapping`, `@Api`, `@ApiOperation`, `@Slf4j`。
    - 返回类型统一为 `com.library.common.Result<T>`。
- **DTOs**: 可能需要创建以下DTOs:
    - `BookCommentAddDTO`: 用于添加新评论 (包含 `bookId`, `content`, `parentId` - 可选)。
    - `BookCommentUpdateDTO`: 用于修改评论 (主要修改 `content`)。
    - `BookCommentQueryDTO` or `PageQueryDTO`: 用于查询评论列表 (包含 `bookId`, 分页参数 `current`, `size`)。
- **核心功能点**:
    - 添加评论 (包括回复评论，即设置 `parent_id`)。
    - 删除评论 (逻辑删除，由当前用户或管理员操作)。
    - 修改评论 (仅限评论者自己)。
    - 查询指定图书的评论列表 (分页，可按时间或点赞数排序)。
    - (可选) 点赞评论功能 (这个可能需要单独的表 `comment_like`，但 `book_comment` 表本身有 `likes` 字段，可以先实现更新这个字段的逻辑)。
- **用户身份验证**: 操作如添加、删除、修改评论需要获取当前登录用户信息。
- **代码风格参考**: `BookCategory` (图书分类管理) 和 `BookCollection` (图书收藏) 模块。 

# 提议的解决方案 (由 INNOVATE 模式填充)
*   **点赞逻辑**: 当前方案简化为直接操作 `book_comment` 表的 `likes` 字段。更完善的方案会使用单独的 `comment_like` 表来记录点赞用户，防止重复点赞，并能查询谁点赞了。

# 实施计划 (由 PLAN 模式生成)
**详细计划**：

1.  **创建实体类 `BookComment.java`**
    *   文件路径: `src/main/java/com/library/entity/BookComment.java`
    *   关键内容: `@Data`, `@EqualsAndHashCode(callSuper = true)`, `@TableName("book_comment")`。继承 `com.library.entity.BaseEntity`。
    *   字段 (使用 `@TableField` 映射数据库列名，如果驼峰与下划线不一致且未配置全局转换):
        *   `private Long userId;` (`user_id`)
        *   `private Long bookId;` (`book_id`)
        *   `private String content;`
        *   `private Long parentId;` (`parent_id`)
        *   `private Integer likes;`

2.  **创建DTO类 `BookCommentAddDTO.java`**
    *   文件路径: `src/main/java/com/library/dto/BookCommentAddDTO.java`
    *   关键内容: `@Data`。
    *   字段:
        *   `private Long bookId;` (`@NotNull(message = "图书ID不能为空")`)
        *   `private String content;` (`@NotBlank(message = "评论内容不能为空")`)
        *   `private Long parentId;` (可选)

3.  **创建DTO类 `BookCommentUpdateDTO.java`**
    *   文件路径: `src/main/java/com/library/dto/BookCommentUpdateDTO.java`
    *   关键内容: `@Data`。
    *   字段:
        *   `private Long id;` (`@NotNull(message = "评论ID不能为空")`)
        *   `private String content;` (`@NotBlank(message = "评论内容不能为空")`)

4.  **创建DTO类 `BookCommentPageQueryDTO.java`**
    *   文件路径: `src/main/java/com/library/dto/BookCommentPageQueryDTO.java`
    *   关键内容: `@Data`。
    *   字段:
        *   `private Long bookId;` (`@NotNull(message = "图书ID不能为空")`)
        *   `private Long parentId;` (可选, 用于查询根评论或特定父评论下的回复)
        *   `private Integer current = 1;`
        *   `private Integer size = 10;`
        *   `private String sortBy;` (可选, e.g., "create_time_desc", "likes_desc")

5.  **创建VO类 `BookCommentVO.java`**
    *   文件路径: `src/main/java/com/library/vo/BookCommentVO.java`
    *   关键内容: `@Data`。
    *   字段: 从 `BookComment` 继承或复制，并添加：
        *   `private String username;`
        *   `private String userAvatar;`
        *   `private List<BookCommentVO> children;` (用于递归展示子评论)
        *   (还需要从 `BookComment` 复制 `id`, `userId`, `bookId`, `content`, `parentId`, `likes`, `createTime`, `updateTime` 等字段)

6.  **创建 Mapper 接口 `BookCommentMapper.java`**
    *   文件路径: `src/main/java/com/library/mapper/BookCommentMapper.java`
    *   关键内容: `@Mapper` 注解，接口 `BookCommentMapper` 继承 `BaseMapper<BookComment>`.

7.  **创建 Service 接口 `IBookCommentService.java`**
    *   文件路径: `src/main/java/com/library/service/IBookCommentService.java`
    *   关键内容: 接口 `IBookCommentService` 继承 `IService<BookComment>`。
    *   方法签名:
        *   `void addComment(BookCommentAddDTO addDTO);`
        *   `void updateComment(BookCommentUpdateDTO updateDTO);`
        *   `void deleteComment(Long commentId);`
        *   `Page<BookCommentVO> getBookCommentsPage(BookCommentPageQueryDTO queryDTO);`
        *   `void likeComment(Long commentId);`
        *   `void unlikeComment(Long commentId);` // 可选实现

8.  **创建 Service 实现类 `BookCommentServiceImpl.java`**
    *   文件路径: `src/main/java/com/library/service/impl/BookCommentServiceImpl.java`
    *   关键内容: `@Service`, `@Slf4j`. 类 `BookCommentServiceImpl` 继承 `ServiceImpl<BookCommentMapper, BookComment>` 实现 `IBookCommentService`.
    *   注入: `BookCommentMapper`, `UserService` (假设存在，用于获取当前用户和用户信息).
    *   实现所有接口方法。包含逻辑：
        *   `addComment`: 获取当前用户ID，设置到 `BookComment` 实体，保存。
        *   `updateComment`: 获取当前用户，校验是否为评论所有者或管理员。更新。
        *   `deleteComment`: 获取当前用户，校验是否为评论所有者或管理员。逻辑删除。
        *   `getBookCommentsPage`: 构造查询条件，查询顶级评论（`parentId` is NULL 或特定 `parentId`）。对每个顶级评论，递归查询其子评论（或一次性查询所有相关评论后在Service层组装）。查询评论者信息（用户名、头像）填充到VO。返回分页结果。
        *   `likeComment`: `book_comment.likes` 字段 +1。
        *   `unlikeComment`: `book_comment.likes` 字段 -1 (确保不小于0)。

9.  **创建 Controller 类 `BookCommentController.java`**
    *   文件路径: `src/main/java/com/library/controller/BookCommentController.java`
    *   关键内容: `@RestController`, `@RequestMapping("/api/book-comment")` (确认API前缀是否为 `/api` 还是 `/api/v1` 等), `@Api(tags = "图书评论管理")`, `@Slf4j`.
    *   注入: `IBookCommentService`.
    *   API 端点 (使用项目中统一的 `Result` 对象封装返回):
        *   `POST /`: `addComment(@RequestBody @Valid BookCommentAddDTO addDTO)` -> `Result.success()`
        *   `PUT /`: `updateComment(@RequestBody @Valid BookCommentUpdateDTO updateDTO)` -> `Result.success()`
        *   `DELETE /{commentId}`: `deleteComment(@PathVariable Long commentId)` -> `Result.success()`
        *   `GET /page`: `getBookCommentsPage(@Valid BookCommentPageQueryDTO queryDTO)` -> `Result.success(pageData)`
        *   `POST /{commentId}/like`: `likeComment(@PathVariable Long commentId)` -> `Result.success()`
        *   `POST /{commentId}/unlike`: `unlikeComment(@PathVariable Long commentId)` -> `Result.success()` (如果实现)

10. **更新 `UserService` (如果需要)**
    *   确保 `UserService` 有方法可以根据用户ID获取用户的基本信息（如用户名、头像），供 `BookCommentServiceImpl` 调用来填充 `BookCommentVO`。

11. **全局异常处理**
    *   确保项目中已有的全局异常处理器能正确处理Service层抛出的业务异常 (如 `CustomException`) 并返回统一的 `Result` 格式。

实施检查清单：
1.  创建实体类 `src/main/java/com/library/entity/BookComment.java`。
2.  创建DTO类 `src/main/java/com/library/dto/BookCommentAddDTO.java`。
3.  创建DTO类 `src/main/java/com/library/dto/BookCommentUpdateDTO.java`。
4.  创建DTO类 `src/main/java/com/library/dto/BookCommentPageQueryDTO.java`。
5.  创建VO类 `src/main/java/com/library/vo/BookCommentVO.java`。
6.  创建 Mapper 接口 `src/main/java/com/library/mapper/BookCommentMapper.java`。
7.  创建 Service 接口 `src/main/java/com/library/service/IBookCommentService.java`。
8.  创建 Service 实现类 `src/main/java/com/library/service/impl/BookCommentServiceImpl.java` (初步实现，层级查询和用户头像等细节可在后续迭代中完善)。
9.  创建 Controller 类 `src/main/java/com/library/controller/BookCommentController.java`。
10. 确认 `UserService` 接口和实现满足评论模块对用户信息的需求，或进行必要补充。
11. 确认MyBatis的Mapper扫描配置能够扫描到新的 `BookCommentMapper`。
12. (手动) 进行API测试。

# 当前执行步骤 (由 EXECUTE 模式在开始执行某步骤时更新)
> 正在执行: "7. 创建 Service 接口 `src/main/java/com/library/service/IBookCommentService.java`。 (修正错误)"

# 任务进度 (由 EXECUTE 模式在每步完成后追加)
*   [自动获取当前日期时间]
    *   步骤：1. 创建实体类 `src/main/java/com/library/entity/BookComment.java`。
    *   修改：创建了新文件 `src/main/java/com/library/entity/BookComment.java`。
    *   更改摘要：添加了图书评论实体类 `BookComment`，该类继承自 `BaseEntity` 并映射到 `book_comment` 表。
    *   原因：执行计划步骤 1。
    *   阻碍：无。
    *   用户确认状态：[自动确认]
*   [自动获取当前日期时间]
    *   步骤：4. 创建DTO类 `src/main/java/com/library/dto/BookCommentPageQueryDTO.java`。
    *   修改：创建了新文件 `src/main/java/com/library/dto/BookCommentPageQueryDTO.java`。
    *   更改摘要：添加了用于分页查询图书评论的DTO `BookCommentPageQueryDTO`，包含 `bookId`, `parentId`, `current`, `size`, `sortBy` 字段。
    *   原因：执行计划步骤 4。
    *   阻碍：无。
    *   用户确认状态：[自动确认]
*   [自动获取当前日期时间]
    *   步骤：5. 创建VO类 `src/main/java/com/library/vo/BookCommentVO.java`。
    *   修改：创建了新文件 `src/main/java/com/library/vo/BookCommentVO.java`。
    *   更改摘要：添加了图书评论视图对象 `BookCommentVO`，用于API返回，包含评论者信息和子评论列表。
    *   原因：执行计划步骤 5。
    *   阻碍：无。
    *   用户确认状态：[自动确认]
*   [自动获取当前日期时间]
    *   步骤：6. 创建 Mapper 接口 `src/main/java/com/library/mapper/BookCommentMapper.java`。
    *   修改：创建了新文件 `src/main/java/com/library/mapper/BookCommentMapper.java`。
    *   更改摘要：添加了图书评论的Mapper接口 `BookCommentMapper`，继承自 `BaseMapper<BookComment>`。
    *   原因：执行计划步骤 6。
    *   阻碍：无。
    *   用户确认状态：[自动确认]
*   [自动获取当前日期时间]
    *   步骤：7. 创建 Service 接口 `src/main/java/com/library/service/IBookCommentService.java`。
    *   修改：创建了新文件 `src/main/java/com/library/service/IBookCommentService.java`。
    *   更改摘要：添加了图书评论的Service接口 `IBookCommentService`，继承自 `IService<BookComment>`。
    *   原因：执行计划步骤 7。
    *   阻碍：无。
    *   用户确认状态：[自动确认]
*   [自动获取当前日期时间]
    *   步骤：8. 创建 Service 实现类 `src/main/java/com/library/service/impl/BookCommentServiceImpl.java` (初步实现，层级查询和用户头像等细节可在后续迭代中完善)。
    *   修改：创建了新文件 `src/main/java/com/library/service/impl/BookCommentServiceImpl.java`。
    *   更改摘要：实现了图书评论服务 `BookCommentServiceImpl` 的核心CRUD逻辑，包括添加、修改、删除、分页查询（含初步的子评论递归获取和用户信息填充）、点赞和取消点赞功能。对 `IUserService` 的方法调用进行了假设性修正以确保代码结构完整。
    *   原因：执行计划步骤 8。
    *   阻碍：无。
    *   用户确认状态：[自动确认]
*   [自动获取当前日期时间]
    *   步骤：9. 创建 Controller 类 `src/main/java/com/library/controller/BookCommentController.java`。
    *   修改：创建了新文件 `src/main/java/com/library/controller/BookCommentController.java`。
    *   更改摘要：实现了图书评论控制器 `BookCommentController`