import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import studentService from "../apis/StudentProfileService";

const StudentProfileCreateComponent = () => {
  const [profile, setProfile] = useState({
    id: "",
    startYear: "",
    endYear: "",
    departmentId: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, setUser, userProfile, setUserProfile } =
    useContext(AuthContext);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, id: userProfile.id }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file); // File should be a File object
    formData.append("id", profile.id); // Fixed student ID from profile
    formData.append("startYear", profile.startYear);
    formData.append("endYear", profile.endYear);
    formData.append("departmentId", profile.departmentId);

    try {
      const response = await studentService.createStudentProfile(
        formData,
        user.accessToken
      );
      toast.success("Student profile created successfully! ", response);
      // Reset only the fields that can be changed
      setProfile((prev) => ({
        ...prev,
        startYear: "",
        endYear: "",
        departmentId: "",
      }));
      setFile(null);
      setError(null);
    } catch (error) {
      console.error("Error creating student profile:", error);
      const errorMessage =
        error.response?.data?.message || "Profile creation failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({
      id: "",
      startYear: "",
      endYear: "",
      departmentId: "",
    });
    setFile(null);
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Create Student Profile
      </h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="mt-12 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="id" className="mr-4 w-40 text-right">
            Student ID:
          </label>
          <input
            type="number"
            id="id"
            name="id"
            value={profile.id}
            onChange={handleChange}
            placeholder="Enter Student ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
            readOnly
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="startYear" className="mr-4 w-40 text-right">
            Start Year:
          </label>
          <input
            type="number"
            id="startYear"
            name="startYear"
            value={profile.startYear}
            onChange={handleChange}
            placeholder="Enter Start Year"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="endYear" className="mr-4 w-40 text-right">
            End Year:
          </label>
          <input
            type="number"
            id="endYear"
            name="endYear"
            value={profile.endYear}
            onChange={handleChange}
            placeholder="Enter End Year"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="departmentId" className="mr-4 w-40 text-right">
            Department ID:
          </label>
          <input
            type="number"
            id="departmentId"
            name="departmentId"
            value={profile.departmentId}
            onChange={handleChange}
            placeholder="Enter Department ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="file" className="mr-4 w-40 text-right">
            Upload File:
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full border text-black border-gray-300 rounded-lg focus:outline-none"
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
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#6e9d27] focus:outline-none"
            disabled={loading}
          >
            Create Profile
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

export default StudentProfileCreateComponent;
