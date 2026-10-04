import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";
import { Globe2, ChevronDown, Eye, EyeOff } from "lucide-react";

import "../styles/SignUp.css";

/*
  IMPORTANT:
  Change this filename only if your image has
  a different name inside src/assets.
*/
import signUpImage from "../assets/signup-image.png";

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     CREATE ACCOUNT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("Account created:", data);

    alert("Account created successfully!");

    navigate("/sign-in");
  };

  return (
    <main className="signup-page">
      <div className="signup-shell">
        {/* =========================
            LEFT SIDE
        ========================= */}

        <section className="signup-form-side">
          {/* LANGUAGE */}

          <button type="button" className="signup-language">
            <Globe2 />

            <span>English</span>

            <ChevronDown className="signup-language-chevron" />
          </button>

          <div className="signup-form-wrapper">
            {/* HEADING */}

            <div className="signup-heading">
              <div className="signup-heading-decoration">✿</div>

              <div>
                <h1>Let’s create your account</h1>

                <p>Welcome to Petalia</p>
              </div>
            </div>

            {/* FORM */}

            <form className="signup-form" onSubmit={handleSubmit}>
              {/* FULL NAME */}

              <div className="signup-field">
                <label htmlFor="fullName">Full name</label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}

              <div className="signup-field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* PASSWORD */}

              <div className="signup-field">
                <label htmlFor="password">Password</label>

                <div className="signup-password-box">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Show or hide password"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="signup-field">
                <label htmlFor="confirmPassword">Confirm password</label>

                <div className="signup-password-box">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Show or hide password"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* CREATE ACCOUNT */}

              <button type="submit" className="signup-submit">
                Create Account
              </button>

              {/* DIVIDER */}

              <div className="signup-divider">
                <span></span>

                <p>or continue with</p>

                <span></span>
              </div>

              {/* GOOGLE */}

              <button type="button" className="signup-google">
                <FcGoogle className="signup-google-icon" />

                <span>Sign up with Google</span>
              </button>

              {/* SIGN IN */}

              <p className="signup-login-text">
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/sign-in")}>
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </section>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <section className="signup-visual-side">
          <img
            src={signUpImage}
            alt="A thoughtful Petalia gift with flowers"
            className="signup-visual-image"
          />

          <div className="signup-image-overlay"></div>

          <div className="signup-visual-content">
            <p className="signup-small-label">Thoughtful gifting</p>

            <h2>
              Gifting made more
              <br />
              <span>meaningful</span>
            </h2>

            <p className="signup-visual-description">
              Find thoughtful gifts for the people
              <br />
              and moments that matter.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SignUp;
