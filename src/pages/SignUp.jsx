import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";

import {
  Globe2,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

import "../styles/SignUp.css";

import signUpImage from "../assets/signup-image.png";


function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =========================================
     GOOGLE SIGN UP
  ========================================= */

  const handleGoogleSignUp = async () => {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          /*
            Google returns to /sign-in.

            SignIn.jsx will then check whether
            this account owns a shop.

            Seller   → Vendor Dashboard
            Customer → Homepage
          */
          redirectTo: `${window.location.origin}/sign-in`,
        },
      });

    if (error) {
      console.error(
        "Google sign up error:",
        error
      );

      alert(error.message);
    }
  };


  /* =========================================
     CREATE ACCOUNT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /* CHECK EMPTY FIELDS */

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please complete all fields.");
      return;
    }


    /* CHECK PASSWORD MATCH */

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }


    /* CHECK PASSWORD LENGTH */

    if (formData.password.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }


    /* CREATE SUPABASE ACCOUNT */

    const { data, error } =
      await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,

        options: {
          data: {
            full_name: formData.fullName.trim(),
          },

          /*
            Used if Supabase email confirmation
            is enabled.
          */
          emailRedirectTo:
            `${window.location.origin}/sign-in`,
        },
      });


    /* SIGN UP ERROR */

    if (error) {
      console.error(
        "Sign up error:",
        error
      );

      alert(error.message);
      return;
    }


    console.log(
      "Account created:",
      data
    );


    /*
      If email confirmation is enabled,
      Supabase may create the user without
      immediately creating a session.
    */

    if (!data.session) {
      alert(
        "Account created! Please check your email to confirm your account, then sign in."
      );

      navigate("/sign-in", {
        replace: true,
      });

      return;
    }


    /*
      If email confirmation is disabled,
      the user may already have a session.

      Normal signup = customer account,
      so send them to the homepage.
    */

    alert(
      "Account created successfully!"
    );

    navigate("/", {
      replace: true,
    });
  };


  return (
    <main className="signup-page">

      <div className="signup-shell">

        {/* ==================================
            LEFT SIDE
        ================================== */}

        <section className="signup-form-side">

          {/* LANGUAGE */}

          <button
            type="button"
            className="signup-language"
          >
            <Globe2 />

            <span>English</span>

            <ChevronDown
              className="signup-language-chevron"
            />
          </button>


          <div className="signup-form-wrapper">

            {/* HEADING */}

            <div className="signup-heading">

              <div className="signup-heading-decoration">
                ✿
              </div>

              <div>
                <h1>
                  Let’s create your account
                </h1>

                <p>
                  Welcome to Petalia
                </p>
              </div>

            </div>


            {/* FORM */}

            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}

              <div className="signup-field">

                <label htmlFor="fullName">
                  Full name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />

              </div>


              {/* EMAIL */}

              <div className="signup-field">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>


              {/* PASSWORD */}

              <div className="signup-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="signup-password-box">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label="Show or hide password"
                  >
                    {showPassword ? (
                      <EyeOff />
                    ) : (
                      <Eye />
                    )}
                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="signup-field">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="signup-password-box">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label="Show or hide password"
                  >
                    {showConfirmPassword ? (
                      <EyeOff />
                    ) : (
                      <Eye />
                    )}
                  </button>

                </div>

              </div>


              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                className="signup-submit"
              >
                Create Account
              </button>


              {/* DIVIDER */}

              <div className="signup-divider">

                <span></span>

                <p>
                  or continue with
                </p>

                <span></span>

              </div>


              {/* GOOGLE */}

              <button
                type="button"
                className="signup-google"
                onClick={handleGoogleSignUp}
              >
                <FcGoogle
                  className="signup-google-icon"
                />

                <span>
                  Sign up with Google
                </span>
              </button>


              {/* SIGN IN */}

              <p className="signup-login-text">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/sign-in")
                  }
                >
                  Sign in
                </button>

              </p>

            </form>

          </div>

        </section>


        {/* ==================================
            RIGHT SIDE
        ================================== */}

        <section className="signup-visual-side">

          <img
            src={signUpImage}
            alt="A thoughtful Petalia gift with flowers"
            className="signup-visual-image"
          />

          <div className="signup-image-overlay"></div>

          <div className="signup-visual-content">

            <p className="signup-small-label">
              Thoughtful gifting
            </p>

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
