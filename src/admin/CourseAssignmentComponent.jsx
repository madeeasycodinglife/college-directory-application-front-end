import React, { useContext, useState } from "react";
import courseService from "../apis/CourseService";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseAssignmentComponent = () => {
  const [courseAssignment, setCourseAssignment] = useState({
    courseId: "",
    facultyId: "",
    departmentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseAssignment({ ...courseAssignment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(courseAssignment);

      await courseService.assignCourse(
        courseAssignment.courseId,
        courseAssignment,
        user.accessToken
      );
      toast.success("Course Assigned successfully!");

      setCourseAssignment({
        courseId: "",
        facultyId: "",
        departmentId: "",
      });
      setError(null);
    } catch (error) {
      let errorMessage = "";
      if (
        (error.response && error.response.status === 400) ||
        error.response.status === 404
      ) {
        errorMessage = error.response.data.message;
        setError(errorMessage);
      }
      toast.error(errorMessage || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCourseAssignment({
      courseId: "",
      facultyId: "",
      departmentId: "",
    });
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Course Assignment to Faculty by Department
      </h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="mt-12 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="courseId" className="mr-4 w-40 text-right">
            Course ID :
          </label>
          <input
            type="text"
            id="courseId"
            name="courseId"
            value={courseAssignment.courseId}
            onChange={handleChange}
            placeholder="Course ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="facultyId" className="mr-4 w-40 text-right">
            Faculty ID :
          </label>
          <input
            type="text"
            id="facultyId"
            name="facultyId"
            value={courseAssignment.facultyId}
            onChange={handleChange}
            placeholder="Faculty ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label
            htmlFor="departmentId"
            className="mr-4 w-40 text-right text-xs"
          >
            Department ID :
          </label>
          <input
            id="departmentId"
            name="departmentId"
            value={courseAssignment.departmentId}
            onChange={handleChange}
            placeholder="Department ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {error && (
          <p className="text-center error-text font-bold text-xl mt-2 mb-2 px-2 ms-[5rem]">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2 hover:bg-[#5050c7] focus:outline-none"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#6e9d27] focus:outline-none"
            disabled={loading}
          >
            Assign Faculty
          </button>
        </div>
      </form>
      {loading && (
        <div className="loading-overlay flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-4">Submitting...</span>
        </div>
      )}
    </div>
  );
};

export default CourseAssignmentComponent;
