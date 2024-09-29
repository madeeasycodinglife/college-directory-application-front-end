import axios from "axios";

const API_URL = "http://localhost:8080/api/student-profile";

// Function to get a course by ID
export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
};

export const getStudentsByDepartmentId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-department-id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
};

export const createStudentProfile = async (studentProfile, accessToken) => {
  try {
    console.log(accessToken);
    console.log(studentProfile);
    const response = await axios.post(
      `${API_URL}/create`,
      studentProfile, // This should be the data you want to send
      {
        headers: {
          "Content-Type": "multipart/form-data", // Important for FormData
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating student profile:`, error);
    throw error;
  }
};

const studentService = {
  getStudentById,
  createStudentProfile,
  getStudentsByDepartmentId,
};
export default studentService;
