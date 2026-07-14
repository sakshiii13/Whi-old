import React from "react";
import "./App.css";
import { RouterPage } from "./component/RouterPage";
import { CartProvider } from "./context/CartContext"; // apna actual path check kar lena
import Navigations from "./navigations/Navigations";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading, isAuthReady} = useAuth();
  return (
    <CartProvider>
      {isAuthReady && <Navigations />}
    </CartProvider>
  );
}

export default App;