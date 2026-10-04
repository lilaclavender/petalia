import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import petaliaLogo from "../assets/petalia-logo.png";

import {
  Search,
  Heart,
  ShoppingCart,
  UserRound,
  LogOut,
} from "lucide-react";

import usePetalia from "../context/usePetalia";
import { supabase } from "../lib/supabase";

import "../styles/Header.css";

function Header() {
  const { wishlistCount, cartCount } = usePetalia();

  const navigate = useNavigate();
  const location = useLocation();

  const isWishlistPage = location.pathname === "/wishlist";
  const isCartPage = location.pathname === "/cart";
  const isAccountPage = location.pathname === "/account";

  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);

  /* =========================
     AUTH USER
  ========================= */

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =========================
     SIGN OUT
  ========================= */

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setAccountOpen(false);

    navigate("/sign-in");
  };

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const cleanSearch = searchTerm.trim();

    if (!cleanSearch) return;

    navigate(`/shop?search=${encodeURIComponent(cleanSearch)}`);
  };

  return (
    <header className="site-header">
      <div className="header-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link to="/" className="brand">
          <img
            src={petaliaLogo}
            alt="Petalia"
            className="footer-logo"
          />

          <p>Meaningful gift from heart</p>
        </Link>

        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/shop">Shop</NavLink>

          <NavLink to="/discover">Discover</NavLink>

          <NavLink to="/local-shops">
            Local Shops
          </NavLink>

          <NavLink to="/petalia-tips">
            Petalia Tips
          </NavLink>
        </nav>

        {/* =========================
            HEADER ACTIONS
        ========================= */}

        <div className="header-actions">

          {/* SEARCH */}

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search flowers, candles..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              aria-label="Search gifts"
            />

            <button
              type="submit"
              className="search-submit"
              aria-label="Search"
            >
              <Search className="search-icon" />
            </button>
          </form>

          {/* =========================
              WISHLIST
          ========================= */}

          <Link
            to="/wishlist"
            className={`header-icon ${
              isWishlistPage ? "header-icon-active" : ""
            }`}
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart />

            {wishlistCount > 0 && (
              <span className="header-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* =========================
              CART
          ========================= */}

          <Link
            to="/cart"
            className={`header-icon ${
              isCartPage ? "header-icon-active" : ""
            }`}
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingCart />

            {cartCount > 0 && (
              <span className="header-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* =========================
              ACCOUNT
          ========================= */}

          <div className="account-menu">

            {user ? (
              <>
                <button
                  type="button"
                  className={`account-icon ${
                    isAccountPage ? "account-icon-active" : ""
                  }`}
                  aria-label="Account"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  <UserRound />
                </button>

                {accountOpen && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-user">
                      <span>Signed in as</span>

                      <strong>
                        {user.user_metadata?.full_name || user.email}
                      </strong>
                    </div>

                    <Link
                      to="/account"
                      className="account-dropdown-link"
                      onClick={() => setAccountOpen(false)}
                    >
                      <UserRound size={16} />
                      <span>My Account</span>
                    </Link>

                    <button
                      type="button"
                      className="account-signout"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/sign-in"
                className="account-icon"
                aria-label="Sign in"
              >
                <UserRound />
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;