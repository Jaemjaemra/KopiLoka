import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo Kopiloka.png";
import "./Login.css";
import { supabase } from "../lib/supabase";

export function Register () { 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister =async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { data,error } = await supabase.auth.signUp({
            email, 
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });
        setLoading(false);

        if(error) {
            setErrorMessage(error.message);
            return;
        }

        if (data.user) {
            setSuccessMessage(
                "Account created! Please check your email to verify."
            );
        }
    };

    return (
        <main className="login-page">
            <motion.div 
              className="login-card"
              initial= {{ opacity: 0, y:35 }}
              animate= {{ opacity: 1, y:0 }}
              transition={{ duration: 0.8, ease: "easeOut"}}
              >
                <motion.img
                  src={logo}
                  alt="KopiLoka Logo"
                  className="login-logo"
                  initial={{ opacity: 0, scale: 0.9}}
                  animate= {{ opacity: 1, scale: 1}}
                  transition={{ delay: 0.2, duration:0.6}}
                  />

                  <motion.div
                    className="login-heading"
                    initial= {{ opacity: 0, y:15}}
                    animate= {{ opacity: 1, y:0 }}
                    transition={{ delay: 0.4, duration: 0.7}}
                    >
                        <span className="login-eyebrow"> JOIN THE KOPILOKA COMMUNITY</span>

                        <h1>Create an Account.</h1>

                        <p>Discover new places and save your favourite coffee spots.</p>
                    </motion.div>

                    <motion.form
                      className="login-form"
                      initial= {{ opacity: 0, y:15}}
                      animate= {{ opacity: 1, y:0 }}
                      transition={{ delay: 0.4, duration: 0.7}}
                      onSubmit= {handleRegister}
                      >
                        <div className="login-input-group">
                            <label htmlFor="username">Username</label>
                            <input
                              id="username"
                              type="text"
                              placeholder="Choose a username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                              />
                        </div>

                        <div className="login-input-group">
                            <label htmlFor="register-email">Email Address</label>
                            <input
                              id="register-email"
                              type="email"
                              placeholder="Enter your Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              />
                        </div>

                        <div className="login-input-group">
                            <label htmlFor="register-password">Password</label>

                            <div className="password-wrapper">
                                <input
                                  id="register-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
                                  minLength={6}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  />

                                  <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                            </div>
                        </div>

                        <div className="login-input-group">
                            <label htmlFor="confirm-password"> Confirm Password</label>

                            <div className="password-wrapper">
                                <input
                                  id="confirm-password"
                                  type= {showConfirmPassword ? "text" : "password"} 
                                  placeholder="Confirm your password"
                                  minLength={6}
                                  value= {confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  required
                                  />

                                  <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    >
                                        {showConfirmPassword? "Hide" : "Show"}
                                    </button>
                                </div>
                        </div>

                        {errorMessage && <p className="auth-error">{errorMessage}</p>}
                        {successMessage && <p className="auth-success">{successMessage}</p>}

                        <button 
                          type="submit" 
                          className="login-button"
                          disabled={loading}
                          >
                            {loading ? "Create Account.." : "Create Account"}
                        </button>

                        <div className="login-divider">
                            <span> OR </span>
                        </div>

                        <button type="button" className="google-button">
                            Continue with Google
                        </button>
                      </motion.form>

                      <motion.div
                        className="login-register"
                        initial= {{ opacity: 0}}
                        animate= {{ opacity: 1}}
                        transition={{ delay: 0.9, duration: 0.6}}
                        >
                            Already have an account?
                            <Link to="/login">Login</Link>
                        </motion.div>
              </motion.div>
        </main>
    );
}

function Login () { 
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage("");
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            window.location.href = "/";
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        console.log("Google button clicked");

        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: "google", 
            options: {
                redirectTo: window.location.origin,
            },
        });

        console.log("OAuth response:", data, error);

        if (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <main className="login-page">
            <motion.div 
              className="login-card"
              initial= {{ opacity: 0, y:35 }}
              animate= {{ opacity: 1, y:0 }}
              transition={{ duration: 0.8, ease: "easeOut"}}
              >
                <motion.img 
                  src={logo}
                  alt="KopiLoka Logo"
                  className="login-logo"
                  initial= {{ opacity:0, scale:0.9}}
                  animate= {{ opacity: 1, scale: 1}}
                  transition={{ delay: 0.2, duration: 0.6}}
                  />

                  <motion.div
                    className="login-heading"
                    initial= {{ opacity:0, y:15}}
                    animate= {{ opacity: 1, y: 0}}
                    transition={{ delay: 0.4, duration: 0.7}}
                    >
                        <span className="login-eyebrow">YOUR COFFEE JOURNEY</span>

                        <h1>Welcome to KopiLoka.</h1>

                        <p>
                            Your next favourite coffee spot starts here. 
                        </p>
                    </motion.div>

                    <motion.form
                      className="login-form"
                      initial={{ opacity:0, y:15}}
                      animate= {{ opacity: 1, y:0}}
                      transition={{ delay: 0.6, duration:0.7}}
                      onSubmit={handleLogin}
                      >
                        <div className="login-input-group">
                            <label htmlFor="email"> Email Address </label>
                            <input 
                              id="email"
                              type="email"
                              placeholder="Enter Your Email"
                              value= {email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              />
                        </div>

                        <div className="login-input-group">
                            <label htmlFor="password">Password</label>

                            <div className="password-wrapper">
                                <input 
                                  id="password"
                                  type={showPassword ? "text": "password"}
                                  placeholder="Enter your password"
                                  value= {password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  />

                                  <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword (!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                            </div>
                        </div>

                        <div className="login-forgot">
                            <Link to= "/forgot-password">
                               Forgot password?
                            </Link>
                        </div>

                        {errorMessage && (
                            <p className="auth-error">{errorMessage}</p>
                        )}
                        <button
                         type="submit"
                         className="login-button"
                         disabled= {loading}
                         onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty(
            "--mouse-x",
            `${e.clientX - rect.left}px`
        );

        e.currentTarget.style.setProperty(
            "--mouse-y",
            `${e.clientY - rect.top}px`
        );
    }}
                         >
                            {loading ? "Logging in..." : "Login"}
                            </button>

                        <div className="login-divider">
                            <span>OR</span>
                        </div>

                        <button 
                          type="button" 
                          className="google-button"
                          onClick={handleGoogleLogin}
                          >
                            Continue with Google
                        </button>
                      </motion.form>

                      <motion.div
                        className="login-register"
                        initial= {{ opacity:0 }}
                        animate= {{ opacity: 1}}
                        transition={{ delay: 0.9, duration: 0.6}}
                        >
                            Don't have an account?
                            <Link to = "/register"> Register</Link>
                        </motion.div>
              </motion.div>
        </main>
    );
}

export default Login;