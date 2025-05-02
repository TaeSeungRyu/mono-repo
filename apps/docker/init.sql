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
-- psql -U dev -d myapp