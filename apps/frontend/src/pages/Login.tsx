import { useAuth } from "../hooks/auth";
import { Navigate } from "react-router-dom";
import { getUrl } from "../utils/helpers";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

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
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      {isLoggedIn && <Navigate to="/" replace={true}></Navigate>}
      <div className="h-screen w-screen relative">
        <div className="absolute h-full w-full bg-login bg-center blur-sm bg-cover py-32 md:py-60"></div>
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-1/4 p-6 text-white space-y-4 md:space-y-6 sm:p-8 z-10">
            <h1 className="text-2xl text-center font-bold leading-tight tracking-tigh">
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
              <div className="text-center">
                <Button type="submit" variant="secondary">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
