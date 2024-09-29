import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import studentService from "../apis/StudentProfileService";
import enrollmentService from "../apis/EnrollmentService";
import departmentService from "../apis/DepartmentService";

const EnrollmentComponent = () => {
  const [enrollment, setEnrollment] = useState({
    studentId: "",
    courseId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState([]); // Initialize as an empty array
  const [departmentName, setDepartmentName] = useState(null);
  const { user, userProfile } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const studentIdFromDb = await studentService.getStudentById(
          userProfile.id
        );
        setEnrollment((prev) => ({ ...prev, studentId: studentIdFromDb.id }));

        const departmentDetailsFromDB =
          await departmentService.getDepartmentById(
            studentIdFromDb.departmentId
          );
        setDepartmentName(departmentDetailsFromDB.name);
      } catch (err) {
        console.error("Error fetching student ID:", err);
        toast.error("Error fetching student ID.");
      }
    };

    fetchStudentId();
    fetchEnrollmentDetails();
  }, [userProfile.id]);

  const fetchEnrollmentDetails = async () => {
    try {
      const response = await enrollmentService.getEnrollmentByStudentId(
        userProfile.id
      );
      const enrollmentDetails = response.map(({ id, studentId, courseId }) => ({
        id,
        studentId,
        courseId,
      }));
      setEnrollmentDetails(enrollmentDetails);
    } catch (error) {
      console.error("Error fetching enrollment details:", error);
      toast.error("Error fetching enrollment details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnrollment({ ...enrollment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await enrollmentService.createEnrollment(
        enrollment,
        user.accessToken
      );
      console.log("Enrollment submitted:", response);
      toast.success("Enrollment successful!");

      // Update the list of enrollments
      setEnrollmentDetails((prev) => [
        ...prev,
        {
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
        },
      ]);

      // Clear courseId for new input
      setEnrollment((prev) => ({ ...prev, courseId: "" }));
      setError(null);
    } catch (error) {
      console.error("Error enrolling student:", error);
      setError(error.response?.data || "Enrollment failed. Please try again.");
      toast.error(
        error.response?.data || "Enrollment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Enrollment
      </h2>
      <ToastContainer />

      <form onSubmit={handleSubmit} className="mt-12 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="studentId" className="mr-4 w-40 text-right">
            Student ID:
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={enrollment.studentId}
            readOnly
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="courseId" className="mr-4 w-40 text-right">
            Course ID:
          </label>
          <input
            type="text"
            id="courseId"
            name="courseId"
            value={enrollment.courseId}
            onChange={handleChange}
            placeholder="Enter Course ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>
        {error && (
          <p className="text-center error-text font-bold text-xl mt-2 mb-2">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2 hover:bg-[#5050c7] focus:outline-none"
            onClick={() => setEnrollment((prev) => ({ ...prev, courseId: "" }))}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#6e9d27] focus:outline-none"
            disabled={loading}
          >
            Enroll
          </button>
        </div>
      </form>

      {/* Displaying enrollment details */}
      {enrollmentDetails.length > 0 && (
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Student ID</th>
              <th className="border border-gray-300 px-4 py-2">
                Department Name
              </th>
              <th className="border border-gray-300 px-4 py-2">Course ID</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentDetails.map((enrollment, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {enrollment.studentId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {departmentName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {enrollment.courseId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {loading && (
        <div className="loading-overlay flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-4">Submitting...</span>
        </div>
      )}
    </div>
  );
};

export default EnrollmentComponent;
