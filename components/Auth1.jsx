import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
} from "firebase/auth";
import {
  Chrome,
  Github,
  Facebook,
  Linkedin,
  Eye,
  EyeOff,
  Layers,
  Code,
  Sparkles,
} from "lucide-react";

const StrengthBar = ({ level }) => {
  const colors = {
    weak: "bg-red-500 w-1/3",
    medium: "bg-yellow-400 w-2/3",
    strong: "bg-green-500 w-full",
  };

  return (
    <div className="h-2 bg-gray-700 w-full rounded-md overflow-hidden mb-4">
      <div
        className={`h-full transition-all duration-300 ${colors[level] || ""}`}
      ></div>
    </div>
  );
};

const mobileVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

function checkStrength(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score < 2) return "weak";
  if (score < 4) return "medium";
  return "strong";
}

const FormUI = ({ type, isLoading, authError, onFormSubmit, setAuthError }) => {
  const isSignin = type === "signin";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const data = { email, password, username: isSignin ? undefined : username };
    onFormSubmit(type, data);
  };

  const socialButtons = [
    {
      name: "Google",
      icon: Chrome,
      color: "bg-[#24292E] text-white hover:bg-[#1A1A1A]",
    },
    {
      name: "GitHub",
      icon: Github,
      color: "bg-[#24292E] text-white hover:bg-[#1A1A1A]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#24292E] text-white hover:bg-[#1A1A1A]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#24292E] text-white hover:bg-[#1A1A1A]",
    },
  ];

  return (
    <form
      className="w-full max-w-[360px] mx-auto text-center text-white"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold mb-6">
        {isSignin ? "Sign In" : "Create Account"}
      </h1>

      {authError && (
        <div className="mb-4 p-3 bg-red-800/50 text-red-300 rounded-lg text-sm">
          {authError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full mx-auto mb-6">
        {socialButtons.map((button, i) => (
          <button
            key={i}
            type="button"
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg shadow-md transition text-sm duration-300 hover:scale-[1.03] ${button.color}`}
          >
            <button.icon size={18} />
            <span className="hidden md:inline">{button.name}</span>
          </button>
        ))}
      </div>

      {!isSignin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-gray-700 text-sm text-white focus:outline-none focus:border-sky-500 transition"
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-gray-700 text-sm text-white focus:outline-none focus:border-sky-500 transition"
        required
      />

      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => {
            const val = e.target.value;
            setPassword(val);
            setStrength(checkStrength(val));
          }}
          className="w-full mb-2 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-gray-700 text-sm text-white focus:outline-none focus:border-sky-500 transition"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3 text-xl transition text-sky-400 hover:text-sky-300"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {isSignin && (
        <a
          href="#"
          className="text-sm text-gray-400 hover:text-sky-400 transition block text-right mb-4"
        >
          Forgot Password?
        </a>
      )}

      {!isSignin && <StrengthBar level={strength} />}

      <button
        type="submit"
        className={`w-full py-3 rounded-full bg-sky-600 text-white font-semibold shadow-lg transition duration-300 transform ${
          isSignin ? "mt-0" : "mt-4"
        } ${
          isLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-sky-700 hover:scale-[1.02]"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {isSignin ? "Signing In..." : "Signing Up..."}
          </div>
        ) : isSignin ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    try {
      const firebaseConfig =
        typeof __firebase_config !== "undefined"
          ? JSON.parse(__firebase_config)
          : {};
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const initAuth = async () => {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
          console.log("Firebase initialized and signed in with custom token.");
        } else {
          await signInAnonymously(auth);
          console.log("Firebase initialized and signed in anonymously.");
        }
      };
      initAuth();
    } catch (error) {
      console.error("Firebase Initialization Error:", error);
    }
  }, []);

  const handleFormSubmit = (type, data) => {
    setAuthError("");
    setIsLoading(true);

    if (type === "signin") {
      console.log("Attempting Sign In:", data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } else {
      console.log("Attempting Sign Up:", data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4 font-sans">
      <div className="w-full max-w-md sm:hidden flex items-center justify-center py-10">
        <AnimatePresence mode="wait">
          {!isSignUp ? (
            <motion.div
              key="signin-mobile"
              className="flex flex-col justify-center w-full"
              variants={mobileVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FormUI
                type="signin"
                isLoading={isLoading}
                authError={authError}
                onFormSubmit={handleFormSubmit}
                setAuthError={setAuthError}
              />
              <p className="text-gray-400 text-center mt-6 text-sm">
                Don't have an account?
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-sky-400 ml-1 font-semibold hover:text-sky-300 transition"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup-mobile"
              className="flex flex-col justify-center w-full"
              variants={mobileVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FormUI
                type="signup"
                isLoading={isLoading}
                authError={authError}
                onFormSubmit={handleFormSubmit}
                setAuthError={setAuthError}
              />
              <p className="text-gray-400 text-center mt-6 text-sm">
                Already have an account?
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-sky-400 ml-1 font-semibold hover:text-sky-300 transition"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="
          relative w-full 
          max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl 
          min-h-[550px] max-h-[90vh] 
          rounded-3xl overflow-hidden shadow-2xl bg-[#111] 
          hidden sm:flex items-center justify-center
        "
        style={{ height: "600px" }}
      >
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col 
          items-center justify-center px-10 transition-all duration-700 ease-in-out ${
            isSignUp ? "translate-x-full opacity-0 z-10" : "opacity-100 z-20"
          }`}
        >
          <FormUI
            type="signin"
            isLoading={isLoading}
            authError={authError}
            onFormSubmit={handleFormSubmit}
            setAuthError={setAuthError}
          />
        </div>

        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col 
          items-center justify-center px-10 transition-all duration-700 ease-in-out ${
            isSignUp ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <FormUI
            type="signup"
            isLoading={isLoading}
            authError={authError}
            onFormSubmit={handleFormSubmit}
            setAuthError={setAuthError}
          />
        </div>

        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full 
          bg-linear-to-br from-gray-800 to-gray-900 
          text-white flex flex-col items-center justify-center px-10 text-center 
          transition-transform duration-700 ease-in-out ${
            isSignUp ? "-translate-x-full" : ""
          }`}
        >
          <div className="flex flex-col items-center mb-6">
            <div
              className="relative w-12 h-12 flex items-center justify-center rounded-2xl shadow-md 
              bg-linear-to-br from-[#8AD0DA] via-[#479ED3] to-[#3BD7C0]"
            >
              <Layers
                size={22}
                className="absolute text-white -translate-y-0.5"
              />
              <Code
                size={17}
                className="absolute text-white/90 translate-y-1"
              />
              <Sparkles
                size={12}
                className="absolute text-white/80 top-1.5 right-[7px]"
              />
            </div>

            <span
              className="mt-2 font-extrabold text-xl tracking-tight text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#8AD0DA,#479ED3,#3BD7C0,#70EA7B)",
              }}
            >
              ProjectUI
            </span>
          </div>

          {!isSignUp ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
              <p className="mb-6 text-sm text-gray-200">
                Enter your details and start your journey with us
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="px-6 py-2 rounded-full bg-white text-gray-900 font-semibold hover:scale-105 transition duration-300 shadow-md"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-6 text-sm text-gray-200">
                To keep connected with us, please login with your info
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-6 py-2 rounded-full bg-white text-gray-900 font-semibold hover:scale-105 transition duration-300 shadow-md"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}