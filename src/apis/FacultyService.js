import axios from "axios";

const API_URL = "http://localhost:8080/api/faculty-profile";

export const getFacultiesByDepartmentId = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/get-faculty-by-department-id/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("", error);
    throw error;
  }
};

export const getFacultyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error("", error);
    throw error;
  }
};

export const createFaculty = async (facultyData, accessToken) => {
  try {
    const response = await axios.post(`${API_URL}/create`, facultyData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("", error);
    throw error;
  }
};

const facultyService = {
  getFacultiesByDepartmentId,
  getFacultyById,
  createFaculty,
};
export default facultyService;
