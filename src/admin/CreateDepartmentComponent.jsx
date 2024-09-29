import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import departmentService from "../apis/DepartmentService"; // Adjust path as needed
import { AuthContext } from "../context/AuthContext";

const CreateDepartmentComponent = () => {
  const [department, setDepartment] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await departmentService.createDepartment(
        department,
        user.accessToken
      );
      console.log("Department created:", response);
      toast.success("Department created successfully!");

      // Reset form fields
      setDepartment({ name: "", description: "" });
      setError(null);
    } catch (err) {
      console.error("Error creating department:", err);
      setError(err.response?.data || "Failed to create department.");
      toast.error(err.response?.data || "Failed to create department.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form fields
    setDepartment({ name: "", description: "" });
    setError(null);
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Create Department
      </h2>
      <ToastContainer />

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="name" className="mr-4 w-40 text-right">
            Department Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={department.name}
            onChange={handleChange}
            placeholder="Enter department name"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="description" className="mr-4 w-40 text-right">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={department.description}
            onChange={handleChange}
            placeholder="Enter description"
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
            {loading ? "Creating..." : "Create Department"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDepartmentComponent;
