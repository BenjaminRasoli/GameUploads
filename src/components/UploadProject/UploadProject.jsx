import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function UploadProject() {
  const { user, isAuthenticated } = useAuth0();

  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    projectGameId: "",
    projectOwner: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        projectOwner: user.sub,
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
    setUploadedImageUrl(null);
    setImageChanged(true);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("file", file);
    });
    formData.append("upload_preset", "djdus2et");

    const url = process.env.REACT_APP_CLOUDINARY_API_KEY;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedImageUrl(data.secure_url);
        setImageChanged(false);
        toast.success("File successfully uploaded to Cloudinary!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file to Cloudinary");
    }
  };

  const postProject = async (e) => {
    e.preventDefault();

    if (
      formData.projectName === "" ||
      formData.projectDescription === "" ||
      formData.projectGameId === ""
    ) {
      toast.error("Please fill in all fields before submitting the project");
      return;
    }
    if (uploadedImageUrl === null) {
      toast.error("Please upload a file first");
      return;
    }

    const ProjectData = new FormData();
    ProjectData.append("projectName", formData.projectName);
    ProjectData.append("projectDescription", formData.projectDescription);
    ProjectData.append("ProjectImageUrl", uploadedImageUrl);
    ProjectData.append("projectGameId", formData.projectGameId);
    ProjectData.append("projectOwner", formData.projectOwner);

    const requestOptions = {
      method: "POST",
      body: ProjectData,
    };

    const url = process.env.REACT_APP_API_KEY_PROJECT;

    try {
      const response = await fetch(url, requestOptions);

      if (response.ok) {
        setFormData({
          projectName: "",
          projectDescription: "",
          projectGameId: "",
          projectOwner: user.sub,
        });
        setUploadedImageUrl(null);
        setImageChanged(false);
      } else {
        console.error("Failed to submit project:", response.statusText);
      }

      toast.success("Project successfully submitted!");
      navigate("/");
    } catch (error) {
      toast.error("Error occurred while submitting project");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold mb-4 text-blue-700">
          UPLOAD A GAME
        </h2>
        <div>
          <form className="mb-4" onSubmit={handleFileUpload}>
            <div className="mb-6">
              <label
                htmlFor="projectDescription"
                className="block text-gray-500 font-bold mb-1"
              >
                Project image file
              </label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  imageChanged ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!imageChanged}
              >
                {uploadedImageUrl ? "File Uploaded" : "Upload File"}
              </button>
            </div>
            {uploadedImageUrl && (
              <div className="mt-4">
                <h3 className="block text-gray-500 font-bold mb-1">
                  Uploaded Image Preview
                </h3>
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded Preview"
                  className="w-full"
                />
              </div>
            )}
          </form>
        </div>
        <form onSubmit={(e) => postProject(e)} className="mb-4">
          <div className="mb-6">
            <label
              htmlFor="projectName"
              className="block text-gray-500 font-bold mb-1"
            >
              Project Name
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="projectDescription"
              className="block text-gray-500 font-bold mb-1"
            >
              Project Description
            </label>
            <input
              type="text"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              placeholder="Enter project description"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="projectGameId"
              className="block text-gray-500 font-bold mb-1"
            >
              Project Game Id
            </label>
            <Link to={"/AboutGameId"} className="text-blue-500 font-bold mb-1">
              What is Project Game Id?
            </Link>

            <input
              type="text"
              name="projectGameId"
              value={formData.projectGameId}
              onChange={handleChange}
              placeholder="Enter project game id"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="submit"
            >
              Upload Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadProject;
