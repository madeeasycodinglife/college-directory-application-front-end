import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import facultyService from "../apis/FacultyService"; // Adjust path as needed
import { AuthContext } from "../context/AuthContext";

const CreateFacultyComponent = () => {
  const [faculty, setFaculty] = useState({
    id: "",
    departmentId: "",
    officeHours: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
      setFaculty({ ...faculty, file: e.target.files[0] });
    } else {
      setFaculty({ ...faculty, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", faculty.id);
    formData.append("departmentId", faculty.departmentId);
    formData.append("officeHours", faculty.officeHours);
    if (faculty.file) {
      formData.append("file", faculty.file);
    }

    setLoading(true);
    try {
      const response = await facultyService.createFaculty(
        formData,
        user.accessToken
      );
      console.log("Faculty created:", response);
      toast.success("Faculty created successfully!");

      // Reset form fields
      setFaculty({ id: "", departmentId: "", officeHours: "", file: null });
      setError(null);
    } catch (err) {
      console.error("Error creating faculty:", err);
      setError(err.response?.data || "Failed to create faculty.");
      toast.error(err.response?.data || "Failed to create faculty.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFaculty({ id: "", departmentId: "", officeHours: "", file: null });
    setError(null);
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Create Faculty Profile
      </h2>
      <ToastContainer />

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="id" className="mr-4 w-40 text-right">
            ID:
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={faculty.id}
            onChange={handleChange}
            placeholder="Enter ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <label
            htmlFor="departmentId"
            className="mr-4 w-40 text-right text-sm"
          >
            Department ID:
          </label>
          <input
            type="text"
            id="departmentId"
            name="departmentId"
            value={faculty.departmentId}
            onChange={handleChange}
            placeholder="Enter Department ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="officeHours" className="mr-4 w-40 text-right">
            Office Hours:
          </label>
          <input
            type="text"
            id="officeHours"
            name="officeHours"
            value={faculty.officeHours}
            onChange={handleChange}
            placeholder="Enter Office Hours"
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
            name="file"
            onChange={handleChange}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        {error && (
          <p className="text-center error-text font-bold text-red-500 mt-2 mb-2">
            {error}
          </p>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#5050c7] focus:outline-none"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Faculty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFacultyComponent;
