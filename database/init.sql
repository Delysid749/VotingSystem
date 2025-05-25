-- 投票系统数据库初始化脚本
CREATE DATABASE IF NOT EXISTS `voting_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `voting_system`;

-- 1. 问卷表（投票问卷表）
CREATE TABLE `polls` (
  `poll_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '问卷唯一主键，自增',
  `title` VARCHAR(255) NOT NULL COMMENT '问卷标题',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`poll_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COMMENT='投票问卷表';

-- 2. 选项表（投票选项表，含票数缓存以优化查询）
CREATE TABLE `options` (
  `option_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '选项唯一主键，自增',
  `poll_id` BIGINT UNSIGNED NOT NULL COMMENT '所属问卷ID，外键引用 polls.poll_id',
  `label` VARCHAR(100) NOT NULL COMMENT '选项文本',
  `vote_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计票数缓存，读时无需再聚合',
  PRIMARY KEY (`option_id`),
  KEY `idx_options_poll` (`poll_id`),
  CONSTRAINT `fk_options_poll`
    FOREIGN KEY (`poll_id`) REFERENCES `polls` (`poll_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COMMENT='投票选项表';

-- 3. 投票记录表（投票日志表，用于审计与防刷）
CREATE TABLE `votes` (
  `vote_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '投票记录唯一主键，自增',
  `option_id` BIGINT UNSIGNED NOT NULL COMMENT '所投选项ID，外键引用 options.option_id',
  `voted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投票时间戳',
  `client_id` VARCHAR(64) NULL COMMENT '客户端标识（如 UUID），可选，用于防刷校验',
  PRIMARY KEY (`vote_id`),
  KEY `idx_votes_option` (`option_id`),
  CONSTRAINT `fk_votes_option`
    FOREIGN KEY (`option_id`) REFERENCES `options` (`option_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COMMENT='投票记录表'; 