-- psql -U dev -d myapp

-- 1. 사용자
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    username VARCHAR(100),
    name VARCHAR(100),
    password VARCHAR(100),
    lastLogin VARCHAR(100),
    auths text[]
);

-- 값이 없을 때만 삽입
INSERT INTO users (username, name, password, lastLogin, auths)
SELECT 'admin', 'administartor', 'admin1234', '2025-05-01 00:00:00', ARRAY['admin'] 
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE username = 'admin'
);

-- 2. 게시판
CREATE TABLE IF NOT EXISTS board (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    title VARCHAR(100),
    content TEXT,
    userid VARCHAR(100),
    createdDay VARCHAR(100)
);

-- 3. 게시판 파일
CREATE TABLE IF NOT EXISTS boardFile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boardId UUID,
    fileName VARCHAR(100),
    filePath VARCHAR(100),
    fileSize VARCHAR(100),
    createdDay VARCHAR(100)
);

-- 4. 달력
CREATE TABLE IF NOT EXISTS calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    phoneNumber VARCHAR(100),
    content TEXT,
    userid VARCHAR(100),
    createdDay VARCHAR(100)
    scheduleday VARCHAR(24)
);

-- 5. 권한
CREATE TABLE IF NOT EXISTS auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    authCode VARCHAR(100),
    authName VARCHAR(100),
    createdDay VARCHAR(100)
);

-- 값이 없을 때만 삽입
INSERT INTO auth (authCode, authName, createdDay)
SELECT 'admin', 'admin', '2025-05-01 00:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM auth WHERE authCode = 'admin'
);

INSERT INTO auth (authCode, authName, createdDay)
SELECT 'user', 'user', '2025-05-01 00:00:00'
WHERE NOT EXISTS (
  SELECT 1 FROM auth WHERE authCode = 'user'
);

-- 6. 스크래핑
CREATE TABLE IF NOT EXISTS scrapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    contents TEXT,
    createdDay VARCHAR(100)
);
