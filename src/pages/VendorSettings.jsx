
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  LockKeyhole,
  Mail,
  Phone,
  CalendarDays,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import VendorSidebar from "../components/VendorSidebar";
import "../styles/VendorSettings.css";

function VendorSettings() {
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
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
    const loadSettings = async () => {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !currentUser) {
        navigate("/sign-in");
        return;
      }

      setUser(currentUser);
      setFullName(currentUser.user_metadata?.full_name || "");
      setPhone(currentUser.user_metadata?.phone || "");

      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", currentUser.id)
        .maybeSingle();

      if (shopError) {
        console.error("Error loading shop:", shopError);
      }

      setShop(shopData || null);
      setLoading(false);
    };

    loadSettings();
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
      setProfileMessage("Account information updated successfully.");
    }

    setSavingProfile(false);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(true);
      setPasswordMessage("Please fill in all password fields.");
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
      setPasswordMessage("Your new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(true);
      setPasswordMessage(
        "Your new password must be different from your current password."
      );
      return;
    }

    setSavingPassword(true);

    // Verify the current password before changing it.
    const { error: verifyError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

    if (verifyError) {
      setPasswordError(true);
      setPasswordMessage("Your current password is incorrect.");
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
      setPasswordMessage("Password updated successfully.");
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
      <div className="vendor-settings-loading">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="vendor-settings-layout">
      <VendorSidebar shop={shop} />

      <main className="vendor-settings-main">
        <div className="vendor-settings-heading">

          <h1>Settings</h1>

          <p>
            Manage your seller account and keep your
            information up to date.
          </p>
        </div>

        <div className="vendor-settings-grid">
          <div className="vendor-settings-left">
            {/* ACCOUNT INFORMATION */}
            <section className="vendor-settings-card">
              <div className="vendor-settings-card-heading">
                <div className="vendor-settings-icon">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2>Account Information</h2>
                  <p>View and update your account details.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="vendor-settings-field">
                  <label htmlFor="seller-name">
                    Full Name
                  </label>

                  <input
                    id="seller-name"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="vendor-settings-field">
                  <label htmlFor="seller-email">
                    Email Address
                  </label>

                  <input
                    id="seller-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />

                  <small>
                    Email changes are not available here.
                  </small>
                </div>

                <div className="vendor-settings-field">
                  <label htmlFor="seller-phone">
                    Phone Number (Optional)
                  </label>

                  <input
                    id="seller-phone"
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
                    className={`vendor-settings-message ${
                      profileError ? "error" : "success"
                    }`}
                    role="status"
                  >
                    {profileMessage}
                  </p>
                )}

                <div className="vendor-settings-actions">
                  <button
                    type="submit"
                    className="vendor-settings-primary-btn"
                    disabled={savingProfile}
                  >
                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>

            {/* CHANGE PASSWORD */}
            <section className="vendor-settings-card">
              <div className="vendor-settings-card-heading">
                <div className="vendor-settings-icon">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <h2>Change Password</h2>
                  <p>
                    Keep your account secure with a strong
                    password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="vendor-settings-field">
                  <label htmlFor="current-password">
                    Current Password
                  </label>

                  <div className="vendor-settings-password">
                    <input
                      id="current-password"
                      type={
                        showCurrent ? "text" : "password"
                      }
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrent(!showCurrent)
                      }
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

                <div className="vendor-settings-field">
                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <div className="vendor-settings-password">
                    <input
                      id="new-password"
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

                <div className="vendor-settings-field">
                  <label htmlFor="confirm-password">
                    Confirm New Password
                  </label>

                  <div className="vendor-settings-password">
                    <input
                      id="confirm-password"
                      type={
                        showConfirm ? "text" : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
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
                    className={`vendor-settings-message ${
                      passwordError ? "error" : "success"
                    }`}
                    role="status"
                  >
                    {passwordMessage}
                  </p>
                )}

                <div className="vendor-settings-actions">
                  <button
                    type="submit"
                    className="vendor-settings-primary-btn"
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

          <div className="vendor-settings-right">
            {/* ACCOUNT OVERVIEW */}
            <section className="vendor-settings-card">
              <div className="vendor-settings-card-heading">
                <div className="vendor-settings-icon">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2>Account Overview</h2>
                  <p>Your account details at a glance.</p>
                </div>
              </div>

              <div className="vendor-settings-overview-item">
                <Mail size={19} />

                <div>
                  <span>Email</span>
                  <strong>{user?.email || "—"}</strong>
                </div>
              </div>

              <div className="vendor-settings-overview-item">
                <Phone size={19} />

                <div>
                  <span>Phone</span>
                  <strong>
                    {user?.user_metadata?.phone ||
                      "Not provided"}
                  </strong>
                </div>
              </div>

              <div className="vendor-settings-overview-item">
                <CalendarDays size={19} />

                <div>
                  <span>Member Since</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </section>

            {/* SECURITY NOTE */}
            <section className="vendor-settings-card vendor-settings-help">
              <div className="vendor-settings-card-heading">
                <div className="vendor-settings-icon">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h2>Account Security</h2>
                  <p>
                    Keep your seller account protected.
                  </p>
                </div>
              </div>

              <p className="vendor-settings-help-text">
                Use a unique password and never share
                your account credentials with anyone.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VendorSettings;
