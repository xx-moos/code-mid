-- 创建数据库
CREATE DATABASE IF NOT EXISTS smart_library DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE smart_library;

-- 用户表（包含读者和管理员）
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码(MD5加密)',
  `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '电子邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像路径',
  `role` TINYINT NOT NULL DEFAULT 0 COMMENT '角色：0-读者，1-管理员',
  `credit_score` INT NOT NULL DEFAULT 0 COMMENT '失信值',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-正常，1-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role_status` (`role`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 图书分类表
CREATE TABLE IF NOT EXISTS `book_category` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `code` VARCHAR(50) NOT NULL COMMENT '分类编码',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
  `level` INT NOT NULL DEFAULT 1 COMMENT '分类层级',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书分类表';

-- 图书表
CREATE TABLE IF NOT EXISTS `book` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图书ID',
  `title` VARCHAR(200) NOT NULL COMMENT '书名',
  `author` VARCHAR(200) DEFAULT NULL COMMENT '作者',
  `isbn` VARCHAR(20) DEFAULT NULL COMMENT 'ISBN',
  `category` VARCHAR(200) DEFAULT NULL COMMENT '分类',
  `publish_date` DATE DEFAULT NULL COMMENT '出版日期',
  `publisher` VARCHAR(100) DEFAULT NULL COMMENT '出版社',
  `call_number` VARCHAR(50) DEFAULT NULL COMMENT '索书号',
  `description` TEXT DEFAULT NULL COMMENT '图书简介',
  `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面图片路径',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `borrow_count` INT NOT NULL DEFAULT 0 COMMENT '借阅次数',
  `avg_rating` DECIMAL(2,1) NOT NULL DEFAULT 0.0 COMMENT '平均评分',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-可借，1-已下架',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_isbn` (`isbn`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书表';

-- 借阅记录表
CREATE TABLE IF NOT EXISTS `borrow_record` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '借阅记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `book_id` BIGINT UNSIGNED NOT NULL COMMENT '图书ID',
  `borrow_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '借阅时间',
  `due_time` DATETIME NOT NULL COMMENT '应还时间',
  `return_time` DATETIME DEFAULT NULL COMMENT '实际归还时间',
  `renewed` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已续借：0-否，1-是',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-借阅中，1-已归还，2-逾期未还',
  `rating` TINYINT DEFAULT NULL COMMENT '还书时评分(1-5)',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_book_id` (`book_id`),
  KEY `idx_status` (`status`),
  KEY `idx_due_time` (`due_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='借阅记录表';

-- 图书评论表
CREATE TABLE IF NOT EXISTS `book_comment` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `book_id` BIGINT UNSIGNED NOT NULL COMMENT '图书ID',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID（回复评论时使用）',
  `likes` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_book_id` (`book_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书评论表';

-- 评论点赞表（记录用户点赞关系）
CREATE TABLE IF NOT EXISTS `comment_like` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `comment_id` BIGINT UNSIGNED NOT NULL COMMENT '评论ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_comment` (`user_id`, `comment_id`),
  KEY `idx_comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论点赞表';

-- 图书收藏表
CREATE TABLE IF NOT EXISTS `book_collection` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `book_id` BIGINT UNSIGNED NOT NULL COMMENT '图书ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_book` (`user_id`, `book_id`),
  KEY `idx_book_id` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书收藏表';

-- 图书馆公告表
CREATE TABLE IF NOT EXISTS `announcement` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(200) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `publisher_id` BIGINT UNSIGNED NOT NULL COMMENT '发布人ID',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-发布，1-撤回',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_publisher_id` (`publisher_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书馆公告表';

-- 初始化管理员账号
INSERT INTO `user` (`username`, `password`, `real_name`, `role`, `status`)
VALUES ('admin', 'e10adc3949ba59abbe56e057f20f883e', '系统管理员', 1, 0); -- 密码： 123456
