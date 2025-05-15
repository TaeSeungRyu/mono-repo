-- psql -U dev -d myapp

-- 1. 테이블이 없을 때만 생성
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    username VARCHAR(100),
    name VARCHAR(100),
    password VARCHAR(100),
    lastLogin VARCHAR(100)
);

-- 2. 특정 값이 없을 때만 삽입
INSERT INTO users (username, name, password, lastLogin)
SELECT 'admin', 'administartor', 'admin1234', '2025-05-01 00:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE username = 'admin'
);

CREATE TABLE IF NOT EXISTS board (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    title VARCHAR(100),
    content TEXT,
    userid VARCHAR(100),
    createdDay VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS boardFile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boardId UUID,
    fileName VARCHAR(100),
    filePath VARCHAR(100),
    fileSize VARCHAR(100),
    createdDay VARCHAR(100)
);


CREATE TABLE IF NOT EXISTS calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    phoneNumber VARCHAR(100),
    content TEXT,
    userid VARCHAR(100),
    createdDay VARCHAR(100)
    scheduleday VARCHAR(24)
);