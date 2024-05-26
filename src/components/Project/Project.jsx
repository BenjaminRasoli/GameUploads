import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { responsive } from "@cloudinary/react";

function Project() {
  const { user, isAuthenticated } = useAuth0();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [projectData, setProjectData] = useState({
    projectName: "",
    projectDescription: "",
    projectGameId: "",
    projectOwner: "",
  });
  const [newCommentData, setNewCommentData] = useState({
    ProjectComment: "",
    commentOwner: "",
    commentName: "",
  });
  const [editing, setEditing] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      setNewCommentData((prevCommentData) => ({
        ...prevCommentData,
        commentOwner: user.sub,
        commentName: user.nickname,
      }));
    }
  }, [isAuthenticated]);

  const fetchComments = async () => {
    const url = `${process.env.REACT_APP_API_KEY_COMMENT}/${id}`;
    try {
      const response = await axios.get(url);
      setComments(response.data);
      setNewCommentData({
        ProjectComment: response.data.ProjectComment,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchProject = async () => {
      const url = `${process.env.REACT_APP_API_KEY_PROJECT}/${id}`;

      try {
        const response = await axios.get(url);
        setProject(response.data);
        setProjectData({
          projectName: response.data.projectName,
          projectDescription: response.data.projectDescription,
          projectImageUrl: response.data.projectImageUrl,
          projectGameId: response.data.projectGameId,
          projectOwner: response.data.projectOwner,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProject();
    fetchComments();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevState) => ({
      ...prevState,
      [name]: value,
      // projectOwner: user.sub,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { projectName, projectDescription, projectImageUrl } = projectData;
    if (!projectName || !projectDescription || !projectImageUrl) {
      toast.error("Please fill out all fields.");
      return;
    }
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    };

    const url = `${process.env.REACT_APP_API_KEY_PROJECT}/${id}`;

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        setEditing(false);
      } else {
        console.error("Failed to edit project:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      const formData = new FormData();
      formData.append("ProjectComment", newCommentData.ProjectComment);
      formData.append("commentOwner", user.sub);
      formData.append("commentName", user.nickname);
      formData.append("ProjectDataId", id);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      const url = process.env.REACT_APP_API_KEY_COMMENT;

      try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          setNewCommentData({ ProjectComment: "" });
          await fetchComments();
        } else {
          console.error("Failed to submit comment:", response.statusText);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please login before commenting");
    }
  };

  const deleteComment = async (comment, e) => {
    e.preventDefault();
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    const url = `${process.env.REACT_APP_API_KEY_COMMENT}/${comment.id}`;

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        setComments((prevCommentsArray) =>
          prevCommentsArray.filter((c) => c.id !== comment.id)
        );
      } else {
        console.error("Failed to delete comment:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-9/12 mx-auto pt-10">
      {project ? (
        <div className="bg-white shadow-md rounded-lg p-8 mb-6">
          {editing ? (
            <form onSubmit={handleSubmit}>
              project name
              <input
                className="w-full mb-4 p-2 border rounded"
                type="text"
                name="projectName"
                value={projectData.projectName}
                onChange={handleInputChange}
              />
              project description
              <textarea
                className="w-full mb-4 p-2 border rounded"
                name="projectDescription"
                value={projectData.projectDescription}
                onChange={handleInputChange}
              ></textarea>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <iframe
                className="w-full  rounded"
                height="900"
                allowFullScreen={true}
                src={`https://itch.io/embed-upload/${projectData.projectGameId}?color=333333`}
              ></iframe>
              <h2 className="text-xl font-semibold mb-2">
                {projectData.projectName}
              </h2>
              <p className="text-gray-700 mb-4">
                {projectData.projectDescription}
              </p>
              {isAuthenticated &&
                (user.sub === project.projectOwner ||
                  user.sub === process.env.REACT_APP_ADMIN_RIGHT) && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setEditing(true)}
                  >
                    Edit Project
                  </button>
                )}
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 "
          >
            {comment.commentOwner === project.projectOwner && (
              <p>
                <b>Uploader</b>
              </p>
            )}
            <h4 className="mb-4  font-extrabold text-gray-900 dark:text-white md:text-2xl ">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                {comment.commentName}
              </span>
            </h4>
            <h2 className="text-xl">{comment.projectComment}</h2>
            {isAuthenticated &&
              (user.sub === comment.commentOwner ||
                user.sub === process.env.REACT_APP_ADMIN_RIGHT) && (
                <button
                  className="inline-flex items-center justify-center px-3 mt-5 mb-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={(e) => deleteComment(comment, e)}
                >
                  <MdDelete size={30} />
                </button>
              )}
          </div>
        ))}
      </div>
      <form
        onSubmit={submitComment}
        className="bg-white shadow-md rounded-lg p-4"
      >
        <textarea
          className="w-full mb-2 p-2 border rounded"
          value={newCommentData.ProjectComment}
          onChange={(e) =>
            setNewCommentData({
              ...newCommentData,
              ProjectComment: e.target.value,
            })
          }
          placeholder="Add a comment"
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Comment
        </button>
      </form>
    </div>
  );
}

export default Project;
