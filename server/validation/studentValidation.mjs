import { checkSchema } from "express-validator";

export const studentValidationSchema = {
  createStudent: checkSchema({
    userId: {
      in: ["params"],
      isInt: {
        options: { min: 1 },
        errorMessage: "User ID must be a positive integer",
      },
      notEmpty: {
        errorMessage: "User ID is required",
      },
    },
    dateOfBirth: {
      isISO8601: {
        errorMessage: "Valid date of birth is required (YYYY-MM-DD)",
      },
      notEmpty: {
        errorMessage: "Date of birth is required",
      },
    },
    phoneNumber: {
      matches: {
        options: [/^\+370\d{8}$/],
        errorMessage: "Phone number must start with +370 and be 11 digits long",
      },
      notEmpty: {
        errorMessage: "Phone number is required",
      },
    },
    address: {
      notEmpty: {
        errorMessage: "Address is required",
      },
    },
    enrollmentDate: {
      isISO8601: {
        errorMessage: "Valid enrollment date is required (YYYY-MM-DD)",
      },
      notEmpty: {
        errorMessage: "Enrollment date is required",
      },
    },
  }),

  updateStudent: checkSchema({
    studentId: {
      in: ["params"],
      isInt: {
        errorMessage: "Student ID must be an integer",
      },
    },
    dateOfBirth: {
      isISO8601: {
        errorMessage: "Valid date of birth is required (YYYY-MM-DD)",
      },
      notEmpty: {
        errorMessage: "Date of birth is required",
      },
    },
    phoneNumber: {
      matches: {
        options: [/^\+370\d{8}$/],
        errorMessage: "Phone number must start with +370 and be 11 digits long",
      },
      notEmpty: {
        errorMessage: "Phone number is required",
      },
    },
    address: {
      notEmpty: {
        errorMessage: "Address is required",
      },
    },
  }),

  partiallyUpdateStudent: checkSchema({
    studentId: {
      in: ["params"],
      isInt: {
        errorMessage: "Student ID must be an integer",
      },
    },
    dateOfBirth: {
      in: ["body"],
      optional: true,
      isDate: {
        errorMessage: "Date of birth must be a valid date",
      },
    },
    phoneNumber: {
      in: ["body"],
      optional: true,
      isMobilePhone: {
        errorMessage: "Phone number must be a valid phone number",
      },
      isLength: {
        options: { max: 12 },
        errorMessage: "Phone number cannot be longer than 12 characters",
      },
    },
    address: {
      in: ["body"],
      optional: true,
      isString: {
        errorMessage: "Address must be a string",
      },
      notEmpty: {
        errorMessage: "Address cannot be empty",
      },
      isLength: {
        options: { max: 255 },
        errorMessage: "Address cannot be longer than 255 characters",
      },
    },
    enrollmentDate: {
      in: ["body"],
      optional: true,
      isDate: {
        errorMessage: "Enrollment date must be a valid date",
      },
    },
  }),

  getStudentsSortedByGrade: checkSchema({
    sortOrder: {
      in: ["query"],
      optional: true,
      isIn: {
        options: [["asc", "desc"]],
        errorMessage: "Sort order must be either asc or desc",
      },
    },
  }),

  getFilteredStudentsByCourse: checkSchema({
    course: {
      in: ["query"],
      notEmpty: {
        errorMessage: "Course query parameter is required",
      },
    },
  }),

  getPaginatedStudents: checkSchema({
    page: {
      in: ["query"],
      isInt: {
        options: { min: 1 },
        errorMessage: "Page must be an integer greater than 0",
      },
      toInt: true,
    },

    limit: {
      in: ["query"],
      isInt: {
        options: { min: 1 },
        errorMessage: "Limit must be an integer greater than 0",
      },
      toInt: true,
    },
  }),
};
