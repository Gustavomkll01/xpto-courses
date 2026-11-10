-- XPTO courses - report queries (PostgreSQL)

-- SQL 01 - Users with the most courses
SELECT u.id, u.name, u.email, COUNT(c.id)::int AS total_courses
FROM users u
LEFT JOIN courses c ON c.user_id = u.id
GROUP BY u.id, u.name, u.email
ORDER BY total_courses DESC, u.name;

-- SQL 02 - Course(s) with the most contents (ties are all returned)
WITH course_totals AS (
  SELECT c.id, c.code, c.title, COUNT(ct.id)::int AS total_contents
  FROM courses c
  LEFT JOIN modules m ON m.course_id = c.id
  LEFT JOIN contents ct ON ct.module_id = m.id
  GROUP BY c.id, c.code, c.title
)
SELECT * FROM course_totals
WHERE total_contents = (SELECT MAX(total_contents) FROM course_totals)
ORDER BY id;

-- SQL 03 - All courses with total modules and total contents (single query)
SELECT c.id, c.code, c.title,
       COUNT(DISTINCT m.id)::int AS total_modules,
       COUNT(ct.id)::int         AS total_contents
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
LEFT JOIN contents ct ON ct.module_id = m.id
GROUP BY c.id, c.code, c.title
ORDER BY c.id;

-- SQL 04 - All contents with their course name (single query)
SELECT ct.id AS content_id, ct.title AS content_title,
       m.title AS module_title, c.title AS course_title
FROM contents ct
JOIN modules m ON m.id = ct.module_id
JOIN courses c ON c.id = m.course_id
ORDER BY c.id, m.id, ct.id;

-- SQL 05 - Users who watched content ID = 2
SELECT u.id, u.name, u.email, cv.watched_at
FROM content_views cv
JOIN users u ON u.id = cv.user_id
WHERE cv.content_id = 2
ORDER BY cv.watched_at;
