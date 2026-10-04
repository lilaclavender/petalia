
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import "../styles/CustomerSettings.css";

function CustomerSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profileError, setProfileError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !currentUser) {
        navigate("/sign-in");
        return;
      }

      setUser(currentUser);
      setFullName(currentUser.user_metadata?.full_name || "");
      setPhone(currentUser.user_metadata?.phone || "");
      setLoading(false);
    };

    loadAccount();
  }, [navigate]);

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError(false);

    if (!fullName.trim()) {
      setProfileError(true);
      setProfileMessage("Please enter your full name.");
      return;
    }

    setSavingProfile(true);

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
      },
    });

    if (error) {
      setProfileError(true);
      setProfileMessage(error.message);
    } else {
      setUser(data.user);
      setProfileMessage("Your account has been updated.");
    }

    setSavingProfile(false);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(true);
      setPasswordMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(true);
      setPasswordMessage(
        "Your new password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(true);
      setPasswordMessage(
        "Choose a password different from your current password."
      );
      return;
    }

    setSavingPassword(true);

    const { error: verifyError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

    if (verifyError) {
      setPasswordError(true);
      setPasswordMessage(
        "Your current password is incorrect, or verification failed."
      );
      setSavingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setPasswordError(true);
      setPasswordMessage(updateError.message);
    } else {
      setPasswordMessage("Your password has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setSavingPassword(false);
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  if (loading) {
    return (
      <div className="customer-settings-loading">
        Loading your settings...
      </div>
    );
  }

  return (
    <main className="customer-settings-page">
      <div className="customer-settings-container">
        <button
          type="button"
          className="customer-settings-back"
          onClick={() => navigate("/account")}
        >
          <ArrowLeft size={17} />
          Back to My Account
        </button>

        <div className="customer-settings-heading">
          <h1>Account Settings</h1>
          <p>Manage your personal information and account security.</p>
        </div>

        <div className="customer-settings-grid">
          <div className="customer-settings-left">
            {/* PERSONAL INFORMATION */}
            <section className="customer-settings-card">
              <div className="customer-settings-card-title">
                <div className="customer-settings-icon">
                  <UserRound size={21} />
                </div>

                <div>
                  <h2>Personal Information</h2>
                  <p>Keep your account details up to date.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="customer-settings-field">
                  <label htmlFor="customer-name">Full Name</label>

                  <input
                    id="customer-name"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="customer-settings-field">
                  <label htmlFor="customer-email">Email Address</label>

                  <input
                    id="customer-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />

                  <small>Email changes are not available here.</small>
                </div>

                <div className="customer-settings-field">
                  <label htmlFor="customer-phone">
                    Phone Number (Optional)
                  </label>

                  <input
                    id="customer-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="+855 ..."
                  />
                </div>

                {profileMessage && (
                  <p
                    role="status"
                    className={`customer-settings-message ${
                      profileError ? "error" : "success"
                    }`}
                  >
                    {profileMessage}
                  </p>
                )}

                <div className="customer-settings-actions">
                  <button
                    type="submit"
                    className="customer-settings-save"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>

            {/* CHANGE PASSWORD */}
            <section className="customer-settings-card">
              <div className="customer-settings-card-title">
                <div className="customer-settings-icon">
                  <LockKeyhole size={21} />
                </div>

                <div>
                  <h2>Change Password</h2>
                  <p>Choose a strong password for your account.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="customer-settings-field">
                  <label htmlFor="customer-current-password">
                    Current Password
                  </label>

                  <div className="customer-settings-password">
                    <input
                      id="customer-current-password"
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      aria-label={
                        showCurrent
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrent ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="customer-settings-field">
                  <label htmlFor="customer-new-password">
                    New Password
                  </label>

                  <div className="customer-settings-password">
                    <input
                      id="customer-new-password"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      minLength={6}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      aria-label={
                        showNew
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNew ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="customer-settings-field">
                  <label htmlFor="customer-confirm-password">
                    Confirm New Password
                  </label>

                  <div className="customer-settings-password">
                    <input
                      id="customer-confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={
                        showConfirm
                          ? "Hide confirmation password"
                          : "Show confirmation password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {passwordMessage && (
                  <p
                    role="status"
                    className={`customer-settings-message ${
                      passwordError ? "error" : "success"
                    }`}
                  >
                    {passwordMessage}
                  </p>
                )}

                <div className="customer-settings-actions">
                  <button
                    type="submit"
                    className="customer-settings-save"
                    disabled={savingPassword}
                  >
                    {savingPassword
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="customer-settings-right">
            {/* ACCOUNT OVERVIEW */}
            <section className="customer-settings-card">
              <div className="customer-settings-card-title">
                <div className="customer-settings-icon">
                  <UserRound size={21} />
                </div>

                <div>
                  <h2>Account Overview</h2>
                  <p>Your account details at a glance.</p>
                </div>
              </div>

              <div className="customer-settings-detail">
                <Mail size={18} />
                <div>
                  <span>Email</span>
                  <strong>{user?.email || "—"}</strong>
                </div>
              </div>

              <div className="customer-settings-detail">
                <Phone size={18} />
                <div>
                  <span>Phone</span>
                  <strong>
                    {user?.user_metadata?.phone || "Not provided"}
                  </strong>
                </div>
              </div>

              <div className="customer-settings-detail">
                <CalendarDays size={18} />
                <div>
                  <span>Member Since</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section className="customer-settings-card">
              <div className="customer-settings-card-title">
                <div className="customer-settings-icon">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h2>Account Security</h2>
                  <p>Keep your Petalia account safe.</p>
                </div>
              </div>

              <p className="customer-settings-security-text">
                Use a unique password and never share your
                login information with anyone.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CustomerSettings;
