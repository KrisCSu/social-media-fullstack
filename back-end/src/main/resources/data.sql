-- 删除旧的表，确保没有冲突
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS message_likes;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS account;

-- 重新创建 `account` 表
CREATE TABLE account (
    accountId INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    bio VARCHAR(255)
);

-- 重新创建 `message` 表
CREATE TABLE message (
    messageId INT PRIMARY KEY AUTO_INCREMENT,
    postedBy INT,
    title VARCHAR(255),
    messageText VARCHAR(255),
    timePostedEpoch BIGINT,
    FOREIGN KEY (postedBy) REFERENCES account(accountId) ON DELETE CASCADE
);

-- 重新创建 `message_likes` 表
CREATE TABLE message_likes (
    messageLikeId INT PRIMARY KEY AUTO_INCREMENT,
    messageId INT,
    likedBy INT,
    timePostedEpoch BIGINT,
    FOREIGN KEY (likedBy) REFERENCES account(accountId) ON DELETE CASCADE,
    FOREIGN KEY (messageId) REFERENCES message(messageId) ON DELETE CASCADE
);

-- 重新创建 `comment` 表
CREATE TABLE comment (
    commentId INT PRIMARY KEY AUTO_INCREMENT,
    postedBy INT,
    messageId INT,
    commentText VARCHAR(255),
    timePostedEpoch BIGINT,
    FOREIGN KEY (postedBy) REFERENCES account(accountId),
    FOREIGN KEY (messageId) REFERENCES message(messageId) ON DELETE CASCADE
);

-- 重新创建 `follows` 表
CREATE TABLE follows (
    followId INT PRIMARY KEY AUTO_INCREMENT,
    followerId INT NOT NULL,
    followeeId INT NOT NULL,
    followTimeEpoch BIGINT NOT NULL,
    UNIQUE(followerId, followeeId),
    FOREIGN KEY (followerId) REFERENCES account(accountId) ON DELETE CASCADE,
    FOREIGN KEY (followeeId) REFERENCES account(accountId) ON DELETE CASCADE
);

-- 插入测试数据到 `account` 表
INSERT INTO account (username, password, bio) 
VALUES ('testuser1', 'password1', 'Bio for testuser1'),
       ('testuser2', 'password2', 'Bio for testuser2');

-- 插入测试数据到 `message` 表
INSERT INTO message (postedBy, title, messageText, timePostedEpoch) 
VALUES (1, 'First Title', 'This is the first message text.', 1669947792),
       (2, 'Second Title', 'This is the second message text.', 1669947793);

-- 插入测试数据到 `comment` 表
INSERT INTO comment (postedBy, messageId, commentText, timePostedEpoch) 
VALUES (2, 1, 'This is a comment on the first message.', 1669947800),
       (1, 2, 'This is a comment on the second message.', 1669947810);

-- 插入测试数据到 `message_likes` 表
INSERT INTO message_likes (messageId, likedBy, timePostedEpoch) 
VALUES (1, 2, 1669947900),
       (2, 1, 1669947910);

-- 插入测试数据到 `follows` 表
INSERT INTO follows (followerId, followeeId, followTimeEpoch)
VALUES (1, 2, 1669948000);