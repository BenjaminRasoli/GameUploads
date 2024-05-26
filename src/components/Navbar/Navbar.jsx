import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameUploadLogo from "../../assets/GameUploadLogo.png";

function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const GetUsers = async () => {
        const response = await fetch(process.env.REACT_APP_API_KEY_USER);
        const users = await response.json();
        if (users.some((u) => u.userId === user.sub)) {
          return;
        } else {
          sendUserDataToBackend();
        }
      };
      GetUsers();
    }
  }, [isAuthenticated, user]);

  const sendUserDataToBackend = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_KEY_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 0,
          userName: user.nickname,
          userEmail: user.email,
          UserId: user.sub,
        }),
      });
      console.error("User data sent to the backend successfully");
    } catch (error) {
      console.error(
        "Error occurred while sending user data to the backend:",
        error
      );
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={GameUploadLogo} className="h-8" alt="GameUpload Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            GameUploadDB
          </span>
        </Link>

        <ul className="font-medium flex  flex-col mmd:flex-row p-4 md:p-0 mt-4 md:space-x-8 rtl:space-x-reverse">
          <li className=" m-5 py-2 px-3 text-white  rounded  dark:text-white ">
            <p>{isAuthenticated && user.nickname}</p>
          </li>
          <li>
            {isAuthenticated ? (
              <button
                onClick={() =>
                  logout({
                    logoutParams: { returnTo: window.location.origin },
                  })
                }
                className=" m-5 py-2 px-3 text-white bg-blue-700 rounded  dark:text-white"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={loginWithRedirect}
                className="m-5 py-2 px-3 text-white bg-blue-700 rounded  dark:text-white"
              >
                Log in
              </button>
            )}
          </li>
          <li>
            <Link to="/upload">
              <button className=" m-5 py-2 px-3 text-white bg-blue-700 rounded  dark:text-white">
                Upload Project
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
