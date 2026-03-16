import { useAuth } from "../hooks/auth";
import { Navigate } from "react-router-dom";
import { getUrl } from "../utils/helpers";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DEMO_USERS = [
  { username: "knight7", emoji: "♞" },
  { username: "queen99", emoji: "♛" },
  { username: "rook1", emoji: "♜" },
];

const DEMO_PASSWORD = "1234";

export default function Login() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loginWithCredentials = async (username: string, password: string) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch(getUrl("auth/login"), options);
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    return response.json();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData) as {
      username: string;
      password: string;
    };

    loginWithCredentials(username, password)
      .then(() => setIsLoggedIn(true))
      .catch(() => setError("Invalid username or password."));
  };

  const handleDemoLogin = async (username: string) => {
    setLoadingDemo(username);
    setError(null);
    try {
      await loginWithCredentials(username, DEMO_PASSWORD);
      setIsLoggedIn(true);
    } catch {
      setError("Demo login failed. Make sure the seed script has been run.");
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <>
      {isLoggedIn && <Navigate to="/" replace={true} />}
      <div className="h-screen w-screen relative">
        <div className="absolute h-full w-full bg-login bg-center blur-sm bg-cover" />
        <div className="w-full h-full flex justify-center items-center">
          <div className="md:w-96 p-6 text-white space-y-5 sm:p-8 z-10">
            <h1 className="text-2xl text-center font-bold leading-tight tracking-tight">
              Sign in to your account
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Username"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <div className="text-center">
                <Button type="submit" variant="secondary">
                  Login
                </Button>
              </div>
            </form>

            {/* Demo Accounts Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/80 text-xs tracking-widest uppercase">
                  Try a demo account
                </span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.username}
                    onClick={() => handleDemoLogin(demo.username)}
                    disabled={loadingDemo !== null}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {loadingDemo === demo.username ? "⏳" : demo.emoji}
                    </span>
                    <span className="text-sm font-semibold">
                      {loadingDemo === demo.username ? "..." : demo.username}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
