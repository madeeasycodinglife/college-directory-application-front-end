import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import departmentService from "../apis/DepartmentService"; // Adjust path as needed
import courseService from "../apis/CourseService";
import studentService from "../apis/StudentProfileService";
import { AuthContext } from "../context/AuthContext";
import facultyService from "../apis/FacultyService";
import userService from "../apis/UserService";

const AssignedFacultyComponent = () => {
  const [assignedFaculty, setAssignedFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, userProfile, setUserProfile } = useContext(AuthContext);

  const [departmentName, setDepartmentName] = useState(null);
  useEffect(() => {
    const fetchAssignedFaculty = async () => {
      setLoading(true);
      try {
        const studentIdFromDb = await studentService.getStudentById(
          userProfile.id
        );
        const departmentDetailsFromDB =
          await departmentService.getDepartmentById(
            studentIdFromDb.departmentId
          );
        setDepartmentName(departmentDetailsFromDB.name);

        console.log("department details :", departmentDetailsFromDB);

        const facultyProfiles = await facultyService.getFacultiesByDepartmentId(
          departmentDetailsFromDB.id
        );
        console.log(facultyProfiles);

        // Fetch user details for each faculty member
        const facultyLists = await Promise.all(
          facultyProfiles.map(async (faculty) => {
            const userDetails = await userService.getUserDetailsById(
              faculty.id
            ); // Assuming faculty has a userId
            return {
              name: userDetails.fullName,
              email: userDetails.email,
              phone: userDetails.phone,
              departmentName: departmentDetailsFromDB.name,
            };
          })
        );

        console.log("Faculty Lists:", facultyLists); // Ensure this is logging

        setAssignedFaculty(facultyLists); // Use the correct variable name
      } catch (error) {
        console.error("Error fetching assigned faculty:", error);
        toast.error("Error fetching assigned faculty.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedFaculty();
  }, []);

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Assigned Faculty
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
          {assignedFaculty.length > 0 ? (
            assignedFaculty.map((faculty, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {faculty.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {faculty.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {faculty.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {faculty.departmentName}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No assigned faculty found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedFacultyComponent;
