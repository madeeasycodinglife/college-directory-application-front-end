import React from "react";
import {
  FaHome,
  FaClipboardList,
  FaUserEdit,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

const FacultySideBar = ({ isOpen, toggleSidebar, setSelectedComponent }) => {
  const handleItemClick = (componentName) => {
    setSelectedComponent(componentName);
    toggleSidebar(); // Close the sidebar after selecting an item
  };

  return (
    <div
      className={`fixed z-30 md:relative ${
        isOpen ? "block" : "hidden"
      } md:block w-full md:w-1/4 shadow-lg bg-blue-600 lg:ml-0`}
    >
      <ul className="flex flex-col gap-y-4 text-xl ml-6 mt-4 md:text-xl lg:text-2xl">
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("dashboard")}
        >
          <FaHome className="text-2xl text-green-900" />
          <span>Dashboard</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("listCourses")}
        >
          <FaClipboardList className="text-2xl text-green-900" />
          <span>List Courses</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("listInstances")}
        >
          <FaClipboardList className="text-2xl text-green-900" />
          <span>List Instances</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("assignedCourses")}
        >
          <FaClipboardList className="text-2xl text-green-900" />
          <span>Assigned Courses</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("assignedStudents")}
        >
          <FaClipboardList className="text-2xl text-green-900" />
          <span>Assigned Students</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("editProfile")}
        >
          <FaUserEdit className="text-2xl text-green-900" />
          <span>Edit Profile</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("changePassword")}
        >
          <FaLock className="text-2xl text-green-900" />
          <span>Change Password</span>
        </li>
        <li
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => handleItemClick("logOut")}
        >
          <FaSignOutAlt className="text-2xl text-green-900" />
          <span>Logout</span>
        </li>
      </ul>
      {isOpen && (
        <button
          className="absolute top-0 right-0 m-4 md:hidden"
          onClick={toggleSidebar}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default FacultySideBar;
