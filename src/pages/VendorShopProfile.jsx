import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import VendorHeader from "../components/VendorHeader";
import VendorSidebar from "../components/VendorSidebar";

import "../styles/VendorDashboard.css";
import "../styles/VendorShopProfile.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function VendorShopProfile() {
  const navigate = useNavigate();

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "Flowers",
    location: "",
    map_url: "",
    description: "",
    phone: "",
    business_email: "",
    opening_time: "",
    closing_time: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  // ==========================================
  // LOAD SELLER + SHOP
  // ==========================================
  useEffect(() => {
    const loadShopProfile = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/sign-in");
          return;
        }

        const { data: shopData, error: shopError } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (shopError) {
          throw shopError;
        }

        if (!shopData) {
          setMessage({
            type: "error",
            text: "No shop was found for this seller account.",
          });

          setLoading(false);
          return;
        }

        setShop(shopData);

        setFormData({
          name: shopData.name || "",
          category: shopData.category || "Flowers",
          map_url: shopData.map_url || "",
          location: shopData.location || "",
          description: shopData.description || "",
          phone: shopData.phone || "",
          business_email: shopData.business_email || "",
          opening_time: formatTimeForInput(shopData.opening_time),
          closing_time: formatTimeForInput(shopData.closing_time),
        });

        setLogoPreview(shopData.logo_image || "");
        setCoverPreview(shopData.cover_image || "");
      } catch (error) {
        console.error("Load shop profile error:", error);

        setMessage({
          type: "error",
          text: error.message || "The shop profile could not be loaded.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadShopProfile();
  }, [navigate]);

  // ==========================================
  // CLEAN TEMPORARY IMAGE PREVIEW URLS
  // ==========================================
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }

      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [logoPreview, coverPreview]);

  // ==========================================
  // NORMAL INPUT
  // ==========================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  // ==========================================
  // IMAGE VALIDATION
  // ==========================================
  const validateImage = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Please choose a JPG, PNG, or WebP image.";
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return "The image must be 5 MB or smaller.";
    }

    return null;
  };

  // ==========================================
  // LOGO CHANGE
  // ==========================================
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validationError = validateImage(file);

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      event.target.value = "";
      return;
    }

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));

    setMessage({
      type: "",
      text: "",
    });
  };

  // ==========================================
  // COVER CHANGE
  // ==========================================
  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validationError = validateImage(file);

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      event.target.value = "";
      return;
    }

    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));

    setMessage({
      type: "",
      text: "",
    });
  };

  // ==========================================
  // UPLOAD SHOP IMAGE
  // ==========================================
  const uploadShopImage = async (file, type, userId) => {
    if (!file) return null;

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName =
      `${type}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;

    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("shop-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("shop-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================
  const handleSave = async (event) => {
    event.preventDefault();

    if (!shop) return;

    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your shop name.",
      });
      return;
    }

    if (!formData.category) {
      setMessage({
        type: "error",
        text: "Please select your shop category.",
      });
      return;
    }

    if (!formData.location.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your shop location.",
      });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({
        type: "error",
        text: "Please tell customers about your shop.",
      });
      return;
    }

    try {
      setSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/sign-in");
        return;
      }

      // Keep existing URLs unless seller selects new images.
      let logoUrl = shop.logo_image || null;
      let coverUrl = shop.cover_image || null;

      if (logoFile) {
        logoUrl = await uploadShopImage(
          logoFile,
          "logo",
          user.id
        );
      }

      if (coverFile) {
        coverUrl = await uploadShopImage(
          coverFile,
          "cover",
          user.id
        );
      }

      const updatedProfile = {
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location.trim(),
        description: formData.description.trim(),
        map_url: formData.map_url.trim() || null,
        phone: formData.phone.trim() || null,
        business_email:
          formData.business_email.trim() || null,
        opening_time: formData.opening_time || null,
        closing_time: formData.closing_time || null,
        logo_image: logoUrl,
        cover_image: coverUrl,
      };

      const { data: updatedShop, error: updateError } =
        await supabase
          .from("shops")
          .update(updatedProfile)
          .eq("id", shop.id)
          .eq("owner_id", user.id)
          .select()
          .single();

      if (updateError) {
        throw updateError;
      }

      setShop(updatedShop);

      setFormData({
        name: updatedShop.name || "",
        category: updatedShop.category || "Flowers",
        map_url: updatedShop.map_url || "",
        location: updatedShop.location || "",
        description: updatedShop.description || "",
        phone: updatedShop.phone || "",
        business_email: updatedShop.business_email || "",
        opening_time: formatTimeForInput(
          updatedShop.opening_time
        ),
        closing_time: formatTimeForInput(
          updatedShop.closing_time
        ),
      });

      setLogoPreview(updatedShop.logo_image || "");
      setCoverPreview(updatedShop.cover_image || "");

      setLogoFile(null);
      setCoverFile(null);

      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }

      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }

      setMessage({
        type: "success",
        text: "Shop profile updated successfully.",
      });
    } catch (error) {
      console.error("Save shop profile error:", error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "The shop profile could not be updated.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="vendor-loading">
        <p>Loading your shop profile...</p>
      </div>
    );
  }

  // ==========================================
  // NO SHOP
  // ==========================================
  if (!shop) {
    return (
      <div className="vendor-loading">
        <h1>Shop Profile</h1>
        <p>No shop was found for this seller account.</p>
      </div>
    );
  }

  return (
    <div className="vendor-center-page">
      <VendorHeader shop={shop} />

      <div className="vendor-dashboard">
        <VendorSidebar shop={shop} />

        <main className="vendor-main vendor-profile-main">
          {/* PAGE HEADER */}
          <section className="shop-profile-heading">
            <span className="shop-profile-eyebrow">
              SHOP PROFILE
            </span>

            <h1>Manage Your Shop</h1>

            <p>
              Update your shop information, images, and contact details.
              This information will be shown on your public shop page.
            </p>
          </section>

          <form
            className="shop-profile-form"
            onSubmit={handleSave}
          >
            <div className="shop-profile-layout">

              {/* =====================================
                  LEFT COLUMN
              ===================================== */}
              <div className="shop-profile-left">

                {/* =====================================
                    SHOP IMAGES
                ===================================== */}
                <section className="shop-profile-card">
                  <div className="shop-profile-section-heading">
                    <div>
                      <h2>Shop Images</h2>
                      <p>
                        Add a cover image and logo that represent
                        your shop.
                      </p>
                    </div>
                  </div>

                  <div className="shop-cover-area">
                    <div
                      className={`shop-cover-preview ${
                        !coverPreview ? "empty" : ""
                      }`}
                    >
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Shop cover preview"
                        />
                      ) : (
                        <div className="shop-image-placeholder">
                          <strong>Shop Cover</strong>
                          <span>
                            Add a photo that represents your shop
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="shop-cover-actions">
                      <div>
                        <strong>Cover Image</strong>
                        <span>
                          JPG, PNG or WebP. Maximum 5 MB.
                        </span>
                      </div>

                      <button
                        type="button"
                        className="shop-secondary-button"
                        onClick={() =>
                          coverInputRef.current?.click()
                        }
                      >
                        {coverPreview
                          ? "Change Cover"
                          : "Add Cover"}
                      </button>

                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverChange}
                        hidden
                      />
                    </div>
                  </div>

                  <div className="shop-logo-row">
                    <div
                      className={`shop-logo-preview ${
                        !logoPreview ? "empty" : ""
                      }`}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Shop logo preview"
                        />
                      ) : (
                        <span>
                          {formData.name
                            ?.charAt(0)
                            ?.toUpperCase() || "S"}
                        </span>
                      )}
                    </div>

                    <div className="shop-logo-copy">
                      <strong>Shop Logo</strong>
                      <span>
                        A square image works best. Maximum 5 MB.
                      </span>
                    </div>

                    <button
                      type="button"
                      className="shop-secondary-button"
                      onClick={() =>
                        logoInputRef.current?.click()
                      }
                    >
                      {logoPreview
                        ? "Change Logo"
                        : "Add Logo"}
                    </button>

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoChange}
                      hidden
                    />
                  </div>
                </section>

                {/* =====================================
                    BASIC INFORMATION
                ===================================== */}
                <section className="shop-profile-card">
                  <div className="shop-profile-section-heading">
                    <div>
                      <h2>Basic Information</h2>
                      <p>
                        Tell customers who you are and what your
                        shop offers.
                      </p>
                    </div>
                  </div>

                  <div className="shop-profile-grid">
                    <label className="shop-profile-field">
                      <span>
                        Shop Name <b>*</b>
                      </span>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter shop name"
                        required
                      />
                    </label>

                    <label className="shop-profile-field">
                      <span>
                        Category <b>*</b>
                      </span>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="Flowers">
                          Flowers
                        </option>

                        <option value="Candles">
                          Candles
                        </option>

                        <option value="Mixed">
                          Flowers & Candles
                        </option>

                        <option value="Gift Sets">
                          Gift Sets
                        </option>
                      </select>
                    </label>

                    <label className="shop-profile-field shop-profile-full">
                      <span>
                        Location <b>*</b>
                      </span>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Phnom Penh"
                        required
                      />
                    </label>

                    <label className="shop-profile-field shop-profile-full">
                      <span>Google Maps Link</span>

                      <input
                        type="url"
                        name="map_url"
                        value={formData.map_url}
                        onChange={handleChange}
                        placeholder="https://www.google.com/maps/..."
                      />

                      <small className="shop-field-hint">
                        Paste your shop's Google Maps link so customers can find your location.
                      </small>
                    </label>

                    <label className="shop-profile-field shop-profile-full">
                      <span>
                        About Your Shop <b>*</b>
                      </span>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell customers about your shop..."
                        rows="5"
                        maxLength="500"
                        required
                      />

                      <small>
                        {formData.description.length}/500
                      </small>
                    </label>
                  </div>
                </section>

                {/* =====================================
                    CONTACT INFORMATION
                ===================================== */}
                <section className="shop-profile-card">
                  <div className="shop-profile-section-heading">
                    <div>
                      <h2>Contact Information</h2>
                      <p>
                        Add business contact details customers can
                        use when needed.
                      </p>
                    </div>
                  </div>

                  <div className="shop-profile-grid">
                    <label className="shop-profile-field">
                      <span>Phone Number</span>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+855 ..."
                      />
                    </label>

                    <label className="shop-profile-field">
                      <span>Business Email</span>

                      <input
                        type="email"
                        name="business_email"
                        value={formData.business_email}
                        onChange={handleChange}
                        placeholder="shop@example.com"
                      />
                    </label>
                  </div>
                </section>

                {/* =====================================
                    BUSINESS HOURS
                ===================================== */}
                <section className="shop-profile-card">
                  <div className="shop-profile-section-heading">
                    <div>
                      <h2>Business Hours</h2>
                      <p>
                        Let customers know your usual operating
                        hours.
                      </p>
                    </div>
                  </div>

                  <div className="shop-profile-grid">
                    <label className="shop-profile-field">
                      <span>Opening Time</span>

                      <input
                        type="time"
                        name="opening_time"
                        value={formData.opening_time}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="shop-profile-field">
                      <span>Closing Time</span>

                      <input
                        type="time"
                        name="closing_time"
                        value={formData.closing_time}
                        onChange={handleChange}
                      />
                    </label>
                  </div>

                  <p className="shop-hours-note">
                    These are the shop&apos;s usual daily business
                    hours. Delivery time is selected separately
                    during checkout.
                  </p>
                </section>

              </div>

              {/* =====================================
                  RIGHT COLUMN
              ===================================== */}
              <aside className="shop-profile-right">

                {/* SHOP OVERVIEW */}
                <section className="shop-overview-card">
                  <div className="shop-overview-heading">
                    <div>
                      <h2>Your Shop</h2>
                      <p>
                        See how your shop information comes together.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shop-overview-view"
                      onClick={() =>
                        navigate(`/local-shops/${shop.id}`)
                      }
                    >
                      View Shop
                    </button>
                  </div>

                  <div className="shop-overview-cover">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt={`${formData.name} cover`}
                      />
                    ) : (
                      <div className="shop-overview-cover-empty">
                        Shop Cover
                      </div>
                    )}
                  </div>

                  <div className="shop-overview-content">
                    <div className="shop-overview-logo">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt={`${formData.name} logo`}
                        />
                      ) : (
                        <span>
                          {formData.name
                            ?.charAt(0)
                            ?.toUpperCase() || "S"}
                        </span>
                      )}
                    </div>

                    <h3>
                      {formData.name || "Your Shop"}
                    </h3>

                    <div className="shop-overview-meta">
                      <span>
                        {formData.location || "Shop location"}
                      </span>

                      <span className="shop-overview-dot">
                        •
                      </span>

                      <span>
                        {formData.category || "Category"}
                      </span>
                    </div>

                    <p className="shop-overview-description">
                      {formData.description ||
                        "Your shop description will appear here."}
                    </p>
                  </div>
                </section>

                {/* PROFILE DETAILS */}
                <section className="shop-profile-details-card">
                  <h2>Profile Details</h2>

                  <p className="shop-profile-details-intro">
                    Complete your shop information so customers
                    have the details they need.
                  </p>

                  <div className="shop-detail-row">
                    <span>Basic information</span>

                    <strong className="complete">
                      Complete
                    </strong>
                  </div>

                  <div className="shop-detail-row">
                    <span>Business email</span>

                    <strong
                      className={
                        formData.business_email
                          ? "complete"
                          : "missing"
                      }
                    >
                      {formData.business_email
                        ? "Complete"
                        : "Missing"}
                    </strong>
                  </div>

                  <div className="shop-detail-row">
                    <span>Phone number</span>

                    <strong
                      className={
                        formData.phone
                          ? "complete"
                          : "missing"
                      }
                    >
                      {formData.phone
                        ? "Complete"
                        : "Missing"}
                    </strong>
                  </div>

                  <div className="shop-detail-row">
                    <span>Business hours</span>

                    <strong
                      className={
                        formData.opening_time &&
                        formData.closing_time
                          ? "complete"
                          : "missing"
                      }
                    >
                      {formData.opening_time &&
                      formData.closing_time
                        ? "Complete"
                        : "Missing"}
                    </strong>
                  </div>
                </section>

              </aside>
            </div>

            {/* MESSAGE */}
            {message.text && (
              <div
                className={`shop-profile-message ${message.type}`}
              >
                {message.text}
              </div>
            )}

            {/* SAVE */}
            <div className="shop-profile-actions">
              <button
                type="submit"
                className="shop-save-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function formatTimeForInput(value) {
  if (!value) return "";

  return String(value).slice(0, 5);
}

export default VendorShopProfile;