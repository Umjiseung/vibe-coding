-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 선택
USE blog_db;

-- 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS `like`;
DROP TABLE IF EXISTS `comment`;
DROP TABLE IF EXISTS `board`;
DROP TABLE IF EXISTS `user`;

-- User 테이블
CREATE TABLE `user` (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(30) NOT NULL UNIQUE,
    nickname VARCHAR(20) NOT NULL,
    password VARCHAR(200) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(100) NULL,
    reset_token_expires TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Board 테이블
CREATE TABLE `board` (
    board_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(20) NOT NULL,
    content VARCHAR(300) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    comment_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    category VARCHAR(20) NULL,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment 테이블
CREATE TABLE `comment` (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    board_id BIGINT NOT NULL,
    content VARCHAR(200) NOT NULL,
    likes INT DEFAULT 0,
    parent_comment BIGINT NULL,
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (board_id) REFERENCES `board`(board_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment) REFERENCES `comment`(comment_id) ON DELETE CASCADE,
    INDEX idx_board_id (board_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_comment (parent_comment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Like 테이블
CREATE TABLE `like` (
    like_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    board_id BIGINT NULL,
    comment_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (board_id) REFERENCES `board`(board_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES `comment`(comment_id) ON DELETE CASCADE,
    UNIQUE KEY unique_board_like (user_id, board_id),
    UNIQUE KEY unique_comment_like (user_id, comment_id),
    INDEX idx_user_id (user_id),
    INDEX idx_board_id (board_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
