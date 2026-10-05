import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getAccountDestination } from "../lib/accountRole";
import petaliaLogo from "../assets/petalia-logo.png";
import sakuraIcon from "../assets/sakura-icon.png";
import candleIcon from "../assets/candle-icon.png";
import giftIcon from "../assets/gift-icon.png";
import signInImage from "../assets/signin-image.png";
import {
  Globe2,
  ChevronDown,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import "../styles/SignIn.css";
function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  /* =========================================
     CHECK GOOGLE OAUTH RETURN
  ========================================= */
  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error checking signed-in user:", error);
        return;
      }
      if (!user) {
        return;
      }
      try {
        const destination = await getAccountDestination(user);
        navigate(destination, { replace: true });
      } catch {
        alert(
          "Signed in, but there was a problem checking your account."
        );
      }
    };
    checkExistingSession();
  }, [navigate]);
  /* =========================================
     INPUT CHANGE
  ========================================= */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  /* =========================================
     EMAIL + PASSWORD SIGN IN
  ========================================= */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }
    /* SIGN IN */
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
    if (error) {
      alert(error.message);
      return;
    }
    const user = data.user;
    
    /* CHECK SELLER / CUSTOMER */
    try {
      const destination = await getAccountDestination(user);
        navigate(destination, { replace: true });
    } catch {
      alert(
        "Signed in, but there was a problem checking your account."
      );
    }
  };
  /* =========================================
     GOOGLE SIGN IN
  ========================================= */
  const handleGoogleSignIn = async () => {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          /*
            Google returns to SignIn.jsx.
            The useEffect above then checks:
            Is this an administrator, a seller, or a customer?
          */
          redirectTo: `${window.location.origin}/sign-in`,
        },
      });
    if (error) {
      console.error(
        "Google sign in error:",
        error
      );
      alert(error.message);
    }
  };
  return (
    <main className="signin-page">
      <div className="signin-shell">
        {/* ==================================
            LEFT IMAGE
        ================================== */}
        <section className="signin-visual-side">
          <img
            src={signInImage}
            alt="Petalia flowers, candle and thoughtful gift"
            className="signin-visual-image"
          />
          <div className="signin-photo-overlay"></div>
          {/* PETALIA LOGO */}
          <img
            src={petaliaLogo}
            alt="Petalia"
            className="signin-logo"
          />
          {/* ==================================
              STORY COPY
          ================================== */}
          <div className="signin-story-content">
            <h1>
              Meaningful Gifts
              <br />
              for every <span>special moment</span>
            </h1>
            <p className="signin-story-description">
              Flowers that speak, candles that comfort,
              and gifts that stay in the heart.
            </p>
            {/* BENEFITS */}
            <div className="signin-benefits">
              {/* FLOWER */}
              <div className="signin-benefit">
                <img
                  src={sakuraIcon}
                  alt=""
                  className="signin-benefit-icon"
                />
                <div>
                  <h3>Handpicked with love</h3>
                  <p>
                    Every gift is chosen with meaning.
                  </p>
                </div>
              </div>
              {/* CANDLE */}
              <div className="signin-benefit">
                <img
                  src={candleIcon}
                  alt=""
                  className="signin-benefit-icon"
                />
                <div>
                  <h3>
                    Premium flowers &amp; candles
                  </h3>
                  <p>
                    Fresh blooms and quality candles.
                  </p>
                </div>
              </div>
              {/* GIFT */}
              <div className="signin-benefit">
                <img
                  src={giftIcon}
                  alt=""
                  className="signin-benefit-icon"
                />
                <div>
                  <h3>
                    For every special moment
                  </h3>
                  <p>
                    Birthdays, anniversaries,
                    celebrations and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==================================
            RIGHT FORM
        ================================== */}
        <section className="signin-form-side">
          {/* LANGUAGE */}
          <button
            type="button"
            className="signin-language"
          >
            <Globe2 />
            <span>English</span>
            <ChevronDown />
          </button>
          <div className="signin-form-wrapper">
            {/* HEADING */}
            <div className="signin-heading">
              <h1>Let’s sign you in.</h1>
              <p>
                Welcome back to Petalia
              </p>
            </div>
            {/* FORM */}
            <form
              className="signin-form"
              onSubmit={handleSubmit}
            >
              {/* EMAIL */}
              <div className="signin-field">
                <label htmlFor="email">
                  Email address
                </label>
                <div className="signin-input-box">
                  <Mail className="signin-input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* PASSWORD */}
              <div className="signin-field">
                <label htmlFor="password">
                  Password
                </label>
                <div className="signin-input-box">
                  <LockKeyhole
                    className="signin-input-icon"
                  />
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="signin-eye"
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
              {/* FORGOT PASSWORD */}
              <div className="signin-forgot-row">
                <button
                  type="button"
                  className="signin-forgot"
                >
                  Forgot password?
                </button>
              </div>
              {/* SIGN IN */}
              <button
                type="submit"
                className="signin-submit"
              >
                Sign in
              </button>
              {/* DIVIDER */}
              <div className="signin-divider">
                <span></span>
                <p>or sign in with</p>
                <span></span>
              </div>
              {/* GOOGLE */}
              <button
                type="button"
                className="signin-google"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle
                  className="signin-google-icon"
                />
                <span>
                  Continue with Google
                </span>
              </button>
              {/* CREATE ACCOUNT */}
              <p className="signin-create-text">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/sign-up")
                  }
                >
                  Create account
                </button>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
export default SignIn;
