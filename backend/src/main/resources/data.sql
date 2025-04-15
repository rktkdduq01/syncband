-- 관리자 계정 생성 (비밀번호: admin123, BCrypt 암호화)
INSERT INTO users (username, email, password, full_name, created_at, updated_at, profile_image_url, bio, is_active, role)
VALUES ('admin', 'admin@syncband.com', '$2a$10$EqKP2HRBzUn4UQws.A9qQuJjoKGWJqXRAUvOOhbPkZ6.CkH4qkKpe', '관리자', NOW(), NOW(), NULL, '시스템 관리자 계정입니다.', true, 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 커뮤니티 카테고리 생성
INSERT INTO categories (name, description, display_order, is_active)
VALUES ('일반', '일반적인 음악 관련 토론을 위한 카테고리입니다.', 1, true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, display_order, is_active)
VALUES ('기술 토론', '음악 제작 기술과 장비에 관한 토론을 위한 카테고리입니다.', 2, true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, display_order, is_active)
VALUES ('곡 공유', '작곡한 곡을 공유하고 피드백을 받는 카테고리입니다.', 3, true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, display_order, is_active)
VALUES ('협업 제안', '다른 뮤지션과의 협업을 제안하는 카테고리입니다.', 4, true)
ON CONFLICT (name) DO NOTHING;

-- 기본 태그 추가
INSERT INTO post_tags (name) VALUES ('기타') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('드럼') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('베이스') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('키보드') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('보컬') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('믹싱') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('작곡') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('편곡') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('마스터링') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('초보자') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('질문') ON CONFLICT (name) DO NOTHING;
INSERT INTO post_tags (name) VALUES ('팁') ON CONFLICT (name) DO NOTHING;