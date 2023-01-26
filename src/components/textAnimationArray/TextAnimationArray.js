import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Wave } from "react-animated-text";

export default function TextAnimationArray({ textArray, effect }) {
  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    let fun;
    // fun && clearTimeout(fun);
    fun = setTimeout(() => {
      setCurrIndex((prev) => (prev === textArray.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => {
      return fun;
    };
  }, [currIndex]);

  return (
    <div>
      {textArray.map(
        (el, index) =>
          index === currIndex && (
            <Wave effect={effect ?? "verticalFadeIn"} delay={4} text={el} />
          )
      )}
    </div>
  );
}
