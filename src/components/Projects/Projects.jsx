import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";

function Projects() {
  const [projectsArray, setProjectsArray] = useState([]);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchProjects = async () => {
      const url = process.env.REACT_APP_API_KEY_PROJECT;

      try {
        const response = await axios.get(url);
        setProjectsArray(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjects();
  }, []);

  const deleteProject = async (project, e) => {
    e.preventDefault();
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    const url = `${process.env.REACT_APP_API_KEY_PROJECT}/${project.id}`;

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        setProjectsArray((prevProjectsArray) =>
          prevProjectsArray.filter((p) => p.id !== project.id)
        );
      } else {
        console.error("Failed to delete project:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pt-20 pb-20">
        {projectsArray.map((project) => (
          <div
            key={project.id}
            className="relative max-w-sm mx-auto w-full h-80 	 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="relative h-full w-full">
              <img
                className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                src={project.projectImageUrl}
                alt={project.projectName}
              />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div>
                <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white ">
                  {project.projectName}
                </h5>
              </div>

              <div className="flex justify-between">
                <Link
                  to={`/project/${project.id}`}
                  className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Try the game
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {isAuthenticated &&
              (user.sub === project.projectOwner ||
                user.sub === process.env.REACT_APP_ADMIN_RIGHT) && (
                <button
                  className="absolute top-2 right-2 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={(e) => deleteProject(project, e)}
                >
                  <MdDelete size={30} />
                </button>
              )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Projects;
