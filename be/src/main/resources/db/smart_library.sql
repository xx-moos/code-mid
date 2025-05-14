/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 90300
 Source Host           : 192.168.75.129:3306
 Source Schema         : smart_library

 Target Server Type    : MySQL
 Target Server Version : 90300
 File Encoding         : 65001

 Date: 15/05/2025 00:34:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告内容',
  `publisher_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '发布人ID',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-发布，1-撤回',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_publisher_id`(`publisher_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书馆公告表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES (1, '45345345', '8768678678678678\nbfdbfd\ndfsef\ndsfe\n4545\nbgbgf\nngfgfnf\nmhmg\n11', 1, 0, '2025-05-13 22:38:01', '2025-05-13 17:12:19', 0);

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图书ID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书名',
  `author` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作者',
  `isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'ISBN',
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类ID',
  `publish_date` date NULL DEFAULT NULL COMMENT '出版日期',
  `publisher` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '出版社',
  `call_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '索书号',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '图书简介',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片路径',
  `stock` int NOT NULL DEFAULT 0 COMMENT '库存数量',
  `borrow_count` int NOT NULL DEFAULT 0 COMMENT '借阅次数',
  `avg_rating` decimal(3, 1) NOT NULL DEFAULT 0.0 COMMENT '综合评分(0-10)',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-可借，1-已下架',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category_id`(`category` ASC) USING BTREE,
  INDEX `idx_isbn`(`isbn` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book
-- ----------------------------
INSERT INTO `book` VALUES (1, '1231', '12314', '123', '002', '2025-05-11', '123123', NULL, NULL, '/bapi/upload/fbbfd769-680f-4e38-bebe-b7fdebcbd858.png', 343, 4, 0.0, 0, '2025-05-13 19:28:00', '2025-05-14 14:04:41', 0);
INSERT INTO `book` VALUES (2, '1231', '12314', '123', '002', '2025-05-11', '123123', NULL, 'hahsahdwbidbnaiwndfsivifdndfueifnesiufnseiufhsiufnsidhfnseuifheisufhsienwkjnriwneiufnisdufhis777', '/bapi/upload/d7321cca-48e9-455d-ac55-9bb4cf4d1968.png', 344, 0, 0.0, 0, '2025-05-13 19:30:55', '2025-05-13 19:36:10', 0);

-- ----------------------------
-- Table structure for book_category
-- ----------------------------
DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类编码',
  `parent_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '父分类ID',
  `level` int NOT NULL DEFAULT 1 COMMENT '分类层级',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_code`(`code` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book_category
-- ----------------------------
INSERT INTO `book_category` VALUES (1, 'ceshi4545', '001', NULL, 1, 0, '2025-05-13 18:53:58', '2025-05-13 19:39:06', 0);
INSERT INTO `book_category` VALUES (2, 'ceshi2566546', '002', NULL, 1, 0, '2025-05-13 18:54:13', '2025-05-13 19:39:19', 0);
INSERT INTO `book_category` VALUES (3, 'ceshi3', '003', 2, 2, 0, '2025-05-13 18:59:10', '2025-05-13 11:01:33', 1);
INSERT INTO `book_category` VALUES (5, 'ceshi4', '004', 2, 2, 0, '2025-05-13 19:03:38', '2025-05-13 19:03:38', 0);
INSERT INTO `book_category` VALUES (6, 'ceshi5', '005', NULL, 1, 0, '2025-05-13 19:05:12', '2025-05-13 19:05:12', 0);

-- ----------------------------
-- Table structure for book_collection
-- ----------------------------
DROP TABLE IF EXISTS `book_collection`;
CREATE TABLE `book_collection`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
  `book_id` bigint UNSIGNED NOT NULL COMMENT '图书ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_book`(`user_id` ASC, `book_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书收藏表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book_collection
-- ----------------------------

-- ----------------------------
-- Table structure for book_comment
-- ----------------------------
DROP TABLE IF EXISTS `book_comment`;
CREATE TABLE `book_comment`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
  `book_id` bigint UNSIGNED NOT NULL COMMENT '图书ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `parent_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '父评论ID（回复评论时使用）',
  `likes` int NOT NULL DEFAULT 0 COMMENT '点赞数',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-待审核, 1-审核通过，2-审核拒绝',
  `star` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书评论表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book_comment
-- ----------------------------
INSERT INTO `book_comment` VALUES (1, 6, 1, 'adwdawdawdadwvvv', NULL, 0, '2025-05-14 16:45:44', '2025-05-14 22:33:20', 1, 1, '4');
INSERT INTO `book_comment` VALUES (2, 6, 1, 'njkvnsensivseiunfsiuenfis', NULL, 0, '2025-05-14 16:46:29', '2025-05-14 16:46:29', 0, 1, '4');
INSERT INTO `book_comment` VALUES (3, 6, 1, '56756756756576757', NULL, 0, '2025-05-14 16:47:18', '2025-05-14 16:47:18', 0, 0, '4');
INSERT INTO `book_comment` VALUES (4, 6, 1, 'c aodwdawdwdv', NULL, 0, '2025-05-14 16:49:18', '2025-05-14 16:49:18', 0, 2, '3');
INSERT INTO `book_comment` VALUES (5, 6, 1, '你好哇是怎么样', 2, 0, '2025-05-14 17:28:47', '2025-05-14 17:28:47', 0, 1, '3');
INSERT INTO `book_comment` VALUES (6, 6, 1, '啊啊', 5, 0, '2025-05-14 17:44:48', '2025-05-14 17:44:48', 0, 1, '3');
INSERT INTO `book_comment` VALUES (7, 6, 1, '1151596567567', 2, 0, '2025-05-14 22:37:04', '2025-05-14 22:37:04', 0, 0, '4');

-- ----------------------------
-- Table structure for book_similarity
-- ----------------------------
DROP TABLE IF EXISTS `book_similarity`;
CREATE TABLE `book_similarity`  (
  `book_id_1` bigint NOT NULL COMMENT '图书ID 1',
  `book_id_2` bigint NOT NULL COMMENT '图书ID 2',
  `similarity_score` double NOT NULL COMMENT '相似度得分',
  PRIMARY KEY (`book_id_1`, `book_id_2`) USING BTREE,
  INDEX `idx_book_id_1_score`(`book_id_1` ASC, `similarity_score` DESC) USING BTREE,
  INDEX `idx_book_id_2`(`book_id_2` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书相似度表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of book_similarity
-- ----------------------------

-- ----------------------------
-- Table structure for borrow_record
-- ----------------------------
DROP TABLE IF EXISTS `borrow_record`;
CREATE TABLE `borrow_record`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '借阅记录ID',
  `user_id` bigint UNSIGNED NOT NULL COMMENT '用户ID',
  `book_id` bigint UNSIGNED NOT NULL COMMENT '图书ID',
  `borrow_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '借阅时间',
  `return_date` datetime NOT NULL COMMENT '应还时间',
  `actual_return_date` datetime NULL DEFAULT NULL COMMENT '实际归还时间',
  `renewed` tinyint NOT NULL DEFAULT 0 COMMENT '是否已续借：0-否，1-是',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-待审核, 1-借阅中，2-已归还，3-逾期未还',
  `rating` tinyint NULL DEFAULT NULL COMMENT '还书时评分(1-5)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  `renew_times` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_due_time`(`return_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '借阅记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of borrow_record
-- ----------------------------
INSERT INTO `borrow_record` VALUES (1, 6, 1, '2025-05-14 18:25:47', '2025-07-14 18:25:47', NULL, 0, 0, NULL, '2025-05-14 18:25:47', '2025-05-14 11:39:10', 0, '0');
INSERT INTO `borrow_record` VALUES (2, 6, 1, '2025-05-14 18:26:51', '2025-07-14 18:26:51', NULL, 0, 1, NULL, '2025-05-14 18:26:51', '2025-05-14 11:39:08', 0, '0');
INSERT INTO `borrow_record` VALUES (3, 6, 1, '2025-05-14 18:32:16', '2025-08-13 18:32:16', '2025-05-14 22:04:39', 0, 2, 4, '2025-05-14 18:32:16', '2025-05-14 11:39:08', 0, '1');
INSERT INTO `borrow_record` VALUES (4, 6, 1, '2025-05-14 18:47:21', '2025-06-21 10:46:57', NULL, 0, 1, NULL, '2025-05-14 18:47:21', '2025-05-14 14:04:32', 0, '0');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码(MD5加密)',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电子邮箱',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像路径',
  `role` tinyint NOT NULL DEFAULT 0 COMMENT '角色：0-读者，1-管理员',
  `credit_score` int NOT NULL DEFAULT 0 COMMENT '失信值',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-正常，1-禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE,
  INDEX `idx_role_status`(`role` ASC, `status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '系统管理员', NULL, NULL, NULL, 1, 0, 0, '2025-05-12 08:51:55', '2025-05-12 10:21:58', 0);
INSERT INTO `user` VALUES (6, '003', 'c6f057b86584942e415435ffb1fa93d4', 'aaa', NULL, NULL, '/bapi/upload/6c220cf7-587f-4771-9f98-d2a2317a23d2.png', 0, 0, 0, '2025-05-13 15:27:15', '2025-05-13 15:27:15', 0);
INSERT INTO `user` VALUES (7, '001', 'c6f057b86584942e415435ffb1fa93d4', 'aaw', NULL, NULL, NULL, 0, 0, 0, '2025-05-13 15:28:28', '2025-05-14 11:15:35', 0);
INSERT INTO `user` VALUES (8, '002', 'c6f057b86584942e415435ffb1fa93d4', 'aa', NULL, NULL, NULL, 0, 0, 0, '2025-05-13 15:29:54', '2025-05-13 17:59:58', 1);
INSERT INTO `user` VALUES (9, 'r001', 'c6f057b86584942e415435ffb1fa93d4', 'aaa', NULL, NULL, '/bapi/upload/2b244163-e7bb-411d-bf21-1160b1439b5c.png', 1, 0, 0, '2025-05-13 17:51:45', '2025-05-13 17:51:45', 0);

SET FOREIGN_KEY_CHECKS = 1;
