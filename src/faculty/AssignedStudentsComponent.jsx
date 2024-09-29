import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import studentService from "../apis/StudentProfileService"; // Adjust path as needed
import departmentService from "../apis/DepartmentService"; // Adjust path as needed
import { AuthContext } from "../context/AuthContext";
import facultyService from "../apis/FacultyService";
import userService from "../apis/UserService";

const AssignedStudentsComponent = () => {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, userProfile, setUserProfile } = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      setLoading(true);
      try {
        const facultyProfile = await facultyService.getFacultyById(
          userProfile.id
        );
        console.log(facultyProfile);

        const departmentDetails = await departmentService.getDepartmentById(
          facultyProfile.departmentId
        );

        console.log(departmentDetails);

        const students = await studentService.getStudentsByDepartmentId(
          departmentDetails.id
        );

        console.log(students);

        // Enrich student data with department names
        const enrichedStudents = await Promise.all(
          students.map(async (student) => {
            const department = await departmentService.getDepartmentById(
              student.departmentId
            );
            const studentData = await userService.getUserDetailsById(
              student.id
            );
            return {
              ...student,
              name: studentData.fullName,
              email: studentData.email,
              phone: studentData.phone,
              departmentName: department ? department.name : "Unknown",
            };
          })
        );

        setAssignedStudents(enrichedStudents);
      } catch (error) {
        console.error("Error fetching assigned students:", error);
        toast.error("Error fetching assigned students.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, []);

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Assigned Students
      </h2>
      <ToastContainer />

      {loading && (
        <div className="loading-overlay flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-4">Loading...</span>
        </div>
      )}

      {error && (
        <p className="text-center error-text font-bold text-xl mt-2 mb-2">
          {error}
        </p>
      )}

      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">
              Department Name
            </th>
          </tr>
        </thead>
        <tbody>
          {assignedStudents.length > 0 ? (
            assignedStudents.map((student, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {student.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.departmentName}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No assigned students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedStudentsComponent;
