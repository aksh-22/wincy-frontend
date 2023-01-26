import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
const Portal = ({ children }) => {
  const modalRoot = document.getElementById("modal");
  const el = document.createElement("div");
  useEffect(() => {
    modalRoot.appendChild(el);
    // return () => modalRoot.removeChild(el);
  });
  return createPortal(children, el);
};

export default Portal;
