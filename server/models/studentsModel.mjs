import { pool } from "../db/postgresConnection.mjs";

const studentsModel = {
  getStudents: async () => {
    const client = await pool.connect();
    try {
      const query = `
            SELECT student_id, user_id, date_of_birth, phone_number, address, enrollment_date
            FROM students;
          `;
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  },

  getStudentById: async (studentId) => {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          students.student_id, 
          students.user_id, 
          students.date_of_birth, 
          students.phone_number, 
          students.address, 
          students.enrollment_date,
          users.first_name, 
          users.last_name, 
          users.email,
          users.role
        FROM students
        JOIN users ON students.user_id = users.user_id
        WHERE students.student_id = $1;
      `;

      const values = [studentId];
      const result = await client.query(query, values);

      return result.rows[0];
    } finally {
      client.release();
    }
  },

  getPaginatedStudents: async (limit, offset) => {
    const client = await pool.connect();
    try {
      const query = `
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
          users.role
        FROM students
        JOIN users ON students.user_id = users.user_id
        ORDER BY students.student_id
        LIMIT $1
        OFFSET $2;
      `;
      const values = [limit, offset];
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  },

  createStudent: async (student) => {
    const { userId, dateOfBirth, phoneNumber, address, enrollmentDate } =
      student;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertStudentQuery = `
            INSERT INTO students (user_id, date_of_birth, phone_number, address, enrollment_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING student_id, user_id, date_of_birth, phone_number, address, enrollment_date;
          `;

      const values = [
        userId,
        dateOfBirth,
        phoneNumber,
        address,
        enrollmentDate,
      ];

      const studentResult = await client.query(insertStudentQuery, values);

      await client.query("COMMIT");

      return studentResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  updateStudent: async (userId, studentId, studentData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query = `
        UPDATE students
        SET 
          date_of_birth = $1,
          phone_number = $2,
          address = $3,
          enrollment_date = $4
        WHERE student_id = $5 AND user_id = $6
        RETURNING *;
      `;

      const values = [
        studentData.dateOfBirth,
        studentData.phoneNumber,
        studentData.address,
        studentData.enrollmentDate,
        studentId,
        userId,
      ];

      const result = await client.query(query, values);
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  partiallyUpdateStudent: async (userId, studentId, studentData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updates = [];
      const values = [];

      let placeholderIndex = 1;

      if (studentData.dateOfBirth) {
        updates.push(`date_of_birth = $${placeholderIndex++}`);
        values.push(studentData.dateOfBirth);
      }
      if (studentData.phoneNumber) {
        updates.push(`phone_number = $${placeholderIndex++}`);
        values.push(studentData.phoneNumber);
      }
      if (studentData.address) {
        updates.push(`address = $${placeholderIndex++}`);
        values.push(studentData.address);
      }
      if (studentData.enrollmentDate) {
        updates.push(`enrollment_date = $${placeholderIndex++}`);
        values.push(studentData.enrollmentDate);
      }

      if (updates.length === 0) {
        throw new Error("No fields to update");
      }

      values.push(studentId);
      values.push(userId);

      const query = `
        UPDATE students
        SET ${updates.join(", ")}
        WHERE student_id = $${placeholderIndex++} AND user_id = $${placeholderIndex}
        RETURNING *;
      `;

      const result = await client.query(query, values);
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getTotalStudentsCount: async () => {
    const client = await pool.connect();
    try {
      const query = "SELECT COUNT(*) FROM students;";
      const result = await client.query(query);
      return parseInt(result.rows[0].count, 10);
    } finally {
      client.release();
    }
  },
};

export default studentsModel;
