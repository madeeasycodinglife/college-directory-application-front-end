import axios from "axios";

const API_URL = "http://localhost:8080/api/department";

export const getDepartmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/get-department-by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error("", error);
    throw error;
  }
};

export const createDepartment = async (department, accessToken) => {
  try {
    const response = await axios.post(`${API_URL}/create`, department, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const departmentService = {
  createDepartment,
  getDepartmentById,
};
export default departmentService;
