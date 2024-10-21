import { usersModel, studentsModel } from "../models/index.mjs";

const studentsController = {
  getStudents: async (req, res) => {
    try {
      const students = await studentsModel.getStudents();
      res.status(200).json({
        status: "success",
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  getPaginatedStudents: async (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    try {
      const students = await studentsModel.getPaginatedStudents(limit, offset);
      const totalStudents = await studentsModel.getTotalStudentsCount();

      const totalPages = Math.ceil(totalStudents / limit);

      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
      const links = [];

      if (page > 1) {
        links.push(`<${baseUrl}?page=1&limit=${limit}>; rel="first"`);
        links.push(`<${baseUrl}?page=${page - 1}&limit=${limit}>; rel="prev"`);
      }
      if (page < totalPages) {
        links.push(`<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`);
        links.push(
          `<${baseUrl}?page=${totalPages}&limit=${limit}>; rel="last"`,
        );
      }
      res.set("Link", links.join(", "));

      res.status(200).json({
        status: "success",
        message: "Students retrieved successfully",
        data: students,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalStudents: totalStudents,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  getStudentsSortedByGrade: async (req, res) => {
    const { sortOrder = "asc" } = req.query;
    try {
      const students = await studentsModel.getStudentsSortedByGrade(sortOrder);

      res.status(200).json({
        status: "success",
        message: "Students sorted by grade successfully",
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  getFilteredStudentsByCourse: async (req, res) => {
    const { courseName } = req.query;

    try {
      const students =
        await studentsModel.getFilteredStudentsByCourse(courseName);

      res.status(200).json({
        status: "success",
        message: "Students filtered by course successfully",
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  getStudentById: async (req, res) => {
    const { userId, studentId } = req.params;
    try {
      const student = await studentsModel.getStudentById(studentId);
      console.log(`Retrieved student: ${JSON.stringify(student)}`);
      if (!student || student.user_id !== parseInt(userId, 10)) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  createStudent: async (req, res) => {
    const { userId } = req.params;
    const { dateOfBirth, phoneNumber, address, enrollmentDate } = req.body;
    try {
      const user = await usersModel.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      const newStudent = await studentsModel.createStudent({
        userId,
        dateOfBirth,
        phoneNumber,
        address,
        enrollmentDate,
      });

      res.status(201).json({
        status: "success",
        message: "Student added successfully",
        data: newStudent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  updateStudent: async (req, res) => {
    const { userId, studentId } = req.params;
    const studentData = req.body;

    try {
      const updatedStudent = await studentsModel.updateStudent(
        userId,
        studentId,
        studentData,
      );

      if (!updatedStudent) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student updated successfully",
        data: updatedStudent,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  partiallyUpdateStudent: async (req, res) => {
    const { userId, studentId } = req.params;
    const studentData = req.body;
    try {
      const updatedStudent = await studentsModel.partiallyUpdateStudent(
        userId,
        studentId,
        studentData,
      );

      if (!updatedStudent) {
        return res.status(404).json({
          status: "error",
          message: "Student not found or does not belong to the specified user",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student updated successfully",
        data: updatedStudent,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },
};

export default studentsController;
