-- 投票系统测试数据
USE `voting_system`;

-- 插入测试问卷
INSERT INTO `polls` (`title`) VALUES ('最受欢迎的编程语言投票');

-- 插入测试选项
INSERT INTO `options` (`poll_id`, `label`, `vote_count`) VALUES 
(1, 'JavaScript', 15),
(1, 'Python', 23),
(1, 'Java', 18),
(1, 'TypeScript', 12),
(1, 'Go', 8);

-- 插入一些测试投票记录
INSERT INTO `votes` (`option_id`, `client_id`) VALUES 
(1, 'client_001'),
(1, 'client_002'),
(1, 'client_003'),
(2, 'client_004'),
(2, 'client_005'),
(2, 'client_006'),
(2, 'client_007'),
(3, 'client_008'),
(3, 'client_009'),
(4, 'client_010'),
(5, 'client_011'); 