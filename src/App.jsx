import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Discover from "./pages/Discover";
import GiftFinder from "./pages/GiftFinder";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetail from "./pages/ProductDetail";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import CustomerSettings from "./pages/CustomerSettings";
import LocalShops from "./pages/LocalShops";
import LocalShopDetail from "./pages/LocalShopDetail";
import VendorDashboard from "./pages/VendorDashboard";
import VendorAddProduct from "./pages/VendorAddProduct";
import VendorEditProduct from "./pages/VendorEditProduct";
import VendorShopProfile from "./pages/VendorShopProfile";
import VendorOrders from "./pages/VendorOrders";
import VendorSettings from "./pages/VendorSettings";
import PetaliaTips from "./pages/PetaliaTips";
import PetaliaTipDetail from "./pages/PetaliaTipDetail";
import FlowerDetail from "./pages/FlowerDetail";
import Landing from "./pages/Landing";
import Emotion from "./pages/Emotion";
import EmotionShop from "./pages/EmotionShop";
import Occasion from "./pages/Occasion";
import OccasionShop from "./pages/OccasionShop";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isVendorPage =
    pathname === "/vendor-dashboard" || pathname.startsWith("/vendor/");
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const hideMainLayout =
    ["/landing", "/sign-in", "/sign-up"].includes(pathname) ||
    isVendorPage ||
    isAdminPage;
  return (
    <>
      <ScrollToTop />
      {!hideMainLayout && <Header />}
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/gift-finder" element={<GiftFinder />} />
        <Route path="/local-shops" element={<LocalShops />} />
        <Route path="/local-shops/:id" element={<LocalShopDetail />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products/add" element={<VendorAddProduct />} />
        <Route
          path="/vendor/products/edit/:id"
          element={<VendorEditProduct />}
        />
        <Route path="/vendor/shop-profile" element={<VendorShopProfile />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/settings" element={<VendorSettings />} />
        <Route path="/petalia-tips" element={<PetaliaTips />} />
        <Route path="/petalia-tips/:tipId" element={<PetaliaTipDetail />} />
        <Route
          path="/petalia-tips/flower-meanings/:flowerId"
          element={<FlowerDetail />}
        />
        <Route path="/emotion" element={<Emotion />} />
        <Route path="/emotion/:emotionId" element={<EmotionShop />} />
        <Route path="/occasion" element={<Occasion />} />
        <Route path="/occasion/:occasionId" element={<OccasionShop />} />
        <Route path="/occasionShop" element={<OccasionShop />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/settings" element={<CustomerSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!hideMainLayout && <Footer />}
    </>
  );
}
