import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import courseService from "../apis/CourseService"; // Adjust path as needed
import departmentService from "../apis/DepartmentService"; // Adjust path as needed
import { AuthContext } from "../context/AuthContext";

const AssignedCoursesComponent = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, userProfile, setUserProfile } = useContext(AuthContext);
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      setLoading(true);
      try {
        const coursesResponse = await courseService.getCourseByFacultyId(
          userProfile.id
        ); // Use actual faculty ID
        console.log(coursesResponse);

        // Fetch department details for each course and enrich course data
        const enrichedCourses = await Promise.all(
          coursesResponse.map(async (course) => {
            const departmentDetails = await departmentService.getDepartmentById(
              course.departmentId
            );
            return {
              ...course,
              departmentName: departmentDetails.name,
            };
          })
        );

        setAssignedCourses(enrichedCourses);
      } catch (error) {
        console.error("Error fetching assigned courses:", error);
        toast.error("Error fetching assigned courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCourses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Assigned Courses
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
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">
              Department Name
            </th>
            <th className="border border-gray-300 px-4 py-2">Course Code</th>
            <th className="border border-gray-300 px-4 py-2">Faculty Name</th>
          </tr>
        </thead>
        <tbody>
          {assignedCourses.length > 0 ? (
            assignedCourses.map((course, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {course.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {course.departmentName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {course.courseCode}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userProfile.fullName}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No assigned courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedCoursesComponent;
