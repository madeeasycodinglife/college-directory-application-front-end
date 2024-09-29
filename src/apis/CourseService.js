import axios from "axios";

const API_URL = "http://localhost:8080/api/courses";

// Function to create a new course
export const createCourse = async (course, accessToken) => {
  try {
    const response = await axios.post(`${API_URL}/create`, course, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response);
    if (
      response.data ===
      "The Course Service is currently unavailable. Please try again later. If the problem persists, please contact our support team at support@madeeasy.com."
    ) {
      const error = new Error("The Course Service is currently unavailable !!");
      error.statusCode = 503;
      throw error;
    }
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Updated assignCourse function
export const assignCourse = async (courseId, courseAssignment, accessToken) => {
  try {
    const response = await axios.patch(
      `${API_URL}/update-course-assignment/${courseId}`,
      {
        facultyId: courseAssignment.facultyId,
        departmentId: courseAssignment.departmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response);
    if (
      response.data ===
      "The Course Service is currently unavailable. Please try again later. If the problem persists, please contact our support team at support@madeeasy.com."
    ) {
      const error = new Error("The Course Service is currently unavailable !!");
      error.statusCode = 503;
      throw error;
    }
    return response.data;
  } catch (error) {
    console.error("Error assigning course:", error);
    throw error;
  }
};

// Function to get all courses
export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("response : ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Function to get a course by ID
export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
};

export const getCourseByFacultyId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/faculty/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
};

export const getCourseByDepartmentId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/department/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
};

// Function to get a course by course code
export const getCourseByCourseCode = async (courseCode, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/code/${courseCode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching course with course code ${courseCode}:`,
      error
    );
    throw error;
  }
};

// Function to delete a course by ID
export const deleteCourseById = async (id, accessToken) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // response will be empty in case of 204 No Content
  } catch (error) {
    console.error(`Error deleting course with ID ${id}:`, error);
    throw error;
  }
};

const courseService = {
  createCourse,
  assignCourse,
  getAllCourses,
  getCourseById,
  getCourseByCourseCode,
  deleteCourseById,
  getCourseByDepartmentId,
  getCourseByFacultyId,
};

export default courseService;
