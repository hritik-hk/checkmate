import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/auth";
import { Navigate } from "react-router-dom";
import { getUrl } from "../utils/helpers";

export default function Login() {
  const { isLoggedIn } = useAuth();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set appropriate content type for JSON data
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify(payload), // Convert data object to JSON string for the body
    };

    fetch(getUrl("auth/login"), options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`some went wrong error code: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
      })
      .then((responseData) => {
        console.log("Data successfully sent:", responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      <Navbar />
      {isLoggedIn && <Navigate to="/" replace={true}></Navigate>}
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="username"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
