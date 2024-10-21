CREATE TYPE user_role AS ENUM ('student', 'admin');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role user_role DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_credentials (
    credential_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(12),
    address VARCHAR(255),
    enrollment_date DATE NOT NULL
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE instructors (
    instructor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(11),
    hire_date DATE NOT NULL
);

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_head INT NOT NULL,
    FOREIGN KEY (department_head) REFERENCES instructors(instructor_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_description TEXT NOT NULL,
    credits INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    grade CHAR(2),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_courses_department_id ON courses(department_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- Creating a user and user_credentials 
INSERT INTO users (first_name, last_name, email, role)
VALUES ('Example', 'example', 'example@example.com', 'student')
RETURNING user_id, first_name, last_name, email, role;

INSERT INTO user_credentials (user_id, password)
VALUES (1, 'hashed_password_here');

-- Get user by user_id with the password
SELECT users.user_id, first_name, last_name, email, role, password FROM users
JOIN user_credentials ON users.user_id = user_credentials.user_id
WHERE users.user_id = 1;

-- Delete user by user_id
DELETE FROM users WHERE user_id = 1;

-- Creating an instructor
INSERT INTO instructors (first_name, last_name, email, phone_number, hire_date)
VALUES ('Example', 'example', 'example@example.com', '12345678901', '2021-0-01');

-- Creating a department
INSERT INTO departments (department_name, department_head)
VALUES ('Example Department', 1);

-- Creating a student
INSERT INTO students (user_id, date_of_birth, phone_number, address, enrollment_date)
VALUES (1, '2000-01-01', '12345678901', 'Example 1, Example City, EX 12345', '2022-01-01');

-- Get students
-- SELECT * FROM students;
SELECT student_id, user_id, date_of_birth, phone_number, address, enrollment_date FROM students

-- Get students with user information by user_id
SELECT 
    students.student_id,
    students.user_id, 
    students.date_of_birth,
    students.phone_number AS student_phone,
    students.address AS student_address,
    students.enrollment_date,
    users.first_name, 
    users.last_name, 
    users.email, 
    users.role,
    departments.department_name,
    courses.course_name,
    courses.course_description,
    enrollments.enrollment_date AS course_enrollment_date,
    enrollments.grade
FROM students
JOIN users ON students.user_id = users.user_id
LEFT JOIN enrollments ON students.student_id = enrollments.student_id
LEFT JOIN courses ON enrollments.course_id = courses.course_id
LEFT JOIN departments ON courses.department_id = departments.department_id
WHERE students.user_id = 1;

-- update student information by student_id
UPDATE students
SET 
    date_of_birth = '2001-02-02',
    phone_number = '09876543210',
    address = 'Updated Address, Updated City',
    enrollment_date = '2023-02-02'
WHERE user_id = 1;

-- Update specific columns of a student's information
UPDATE students
SET date_of_birth = '1991-02-02',
WHERE user_id = 1;

-- Get paginated students
SELECT 
    students.student_id, 
    students.user_id, 
    students.date_of_birth, 
    students.phone_number AS student_phone, 
    students.address AS student_address, 
    students.enrollment_date,
    users.first_name, 
    users.last_name, 
    users.email, 
    users.role,
    departments.department_name,
    courses.course_name,
    courses.course_description,
    enrollments.enrollment_date AS course_enrollment_date,
    enrollments.grade
FROM students
JOIN users ON students.user_id = users.user_id
LEFT JOIN enrollments ON students.student_id = enrollments.student_id
LEFT JOIN courses ON enrollments.course_id = courses.course_id
LEFT JOIN departments ON courses.department_id = departments.department_id
ORDER BY students.student_id
LIMIT 1
OFFSET 0;

-- Get student by name
SELECT 
    students.student_id, 
    students.user_id, 
    students.date_of_birth, 
    students.phone_number, 
    students.address, 
    students.enrollment_date,
    users.first_name, 
    users.last_name, 
    users.email
FROM students
JOIN users ON students.user_id = users.user_id
WHERE users.first_name = 'Example';

-- Creating a course
INSERT INTO courses (course_name, course_description, credits, department_id)
VALUES ('Example Course', 'This is an example course.', 3, 1);

-- Get students filtered by course
SELECT 
    students.student_id, 
    students.user_id, 
    users.first_name, 
    users.last_name, 
    users.email,
    students.date_of_birth, 
    students.phone_number, 
    students.address, 
    students.enrollment_date,
    enrollments.course_id,
    courses.course_name,
    departments.department_name
FROM students
JOIN users ON students.user_id = users.user_id
JOIN enrollments ON students.student_id = enrollments.student_id
JOIN courses ON enrollments.course_id = courses.course_id
JOIN departments ON courses.department_id = departments.department_id
WHERE courses.course_name = 'Example Course';

-- creating an enrollment
INSERT INTO enrollments (student_id, course_id, grade, enrollment_date)
VALUES (1, 1, NULL, '2022-01-01');

-- Get students sorted by grade ASC/DESC
SELECT
    students.student_id, 
    students.user_id, 
    users.first_name, 
    users.last_name, 
    enrollments.grade,
    courses.course_name,
    departments.department_name
FROM students
JOIN users ON students.user_id = users.user_id
JOIN enrollments ON students.student_id = enrollments.student_id
JOIN courses ON enrollments.course_id = courses.course_id
JOIN departments ON courses.department_id = departments.department_id
WHERE enrollments.grade IS NOT NULL
ORDER BY enrollments.grade ASC;

