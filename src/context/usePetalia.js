import { useContext } from "react";
import PetaliaContext from "./PetaliaContext";

function usePetalia() {
  const context = useContext(PetaliaContext);

  if (!context) {
    throw new Error(
      "usePetalia must be used inside PetaliaProvider"
    );
  }

  return context;
}

export default usePetalia;