import axios from "axios";

const API_URL = "http://localhost:8080/api/enrollment";
// http://localhost:8086/api/enrollment/get-enrollments-by-student-id/1
export const createEnrollment = async (studentData, accessToken) => {
  try {
    console.log(accessToken);
    console.log(studentData);

    const response = await axios.post(
      `${API_URL}/create`,
      studentData, // This should be the data you want to send
      {
        headers: {
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

export const getEnrollmentByStudentId = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/get-enrollments-by-student-id/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("", error);
    throw error;
  }
};

const enrollmentService = {
  createEnrollment,
  getEnrollmentByStudentId,
};
export default enrollmentService;
