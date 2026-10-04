import {
  useEffect,
  useState,
} from "react";

import PetaliaContext from "./PetaliaContext";


function getSavedWishlist() {
  try {
    return (
      JSON.parse(
        localStorage.getItem("petaliaWishlist")
      ) || []
    );
  } catch {
    return [];
  }
}


function getSavedCart() {
  try {
    return (
      JSON.parse(
        localStorage.getItem("petaliaCart")
      ) || []
    );
  } catch {
    return [];
  }
}


function PetaliaProvider({ children }) {
  const [wishlist, setWishlist] = useState(
    getSavedWishlist
  );

  const [cart, setCart] = useState(
    getSavedCart
  );


  /* =========================
     WISHLIST
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "petaliaWishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);


  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) =>
        Number(item.id) === Number(productId)
    );
  };


  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) =>
          Number(item.id) === Number(product.id)
      );

      if (exists) {
        return currentWishlist.filter(
          (item) =>
            Number(item.id) !== Number(product.id)
        );
      }

      return [
        ...currentWishlist,
        product,
      ];
    });
  };


  /* =========================
     CART
  ========================= */

  const refreshCart = () => {
    setCart(getSavedCart());
  };


  useEffect(() => {
    const updateCart = () => {
      refreshCart();
    };

    window.addEventListener(
      "petalia-cart-updated",
      updateCart
    );

    window.addEventListener(
      "storage",
      updateCart
    );

    return () => {
      window.removeEventListener(
        "petalia-cart-updated",
        updateCart
      );

      window.removeEventListener(
        "storage",
        updateCart
      );
    };
  }, []);


  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );


  return (
    <PetaliaContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlist,
        cart,
        cartCount,
        refreshCart,
      }}
    >
      {children}
    </PetaliaContext.Provider>
  );
}


export default PetaliaProvider;