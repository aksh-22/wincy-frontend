import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import classes from "./ProjectInfo.module.css";
import { Random, Wave } from "react-animated-text";

export default function TextAnimation({ projectInfoLoading, animateText }) {
  const [currIndex, setCurrIndex] = useState(0);

  useEffect(() => {
    let abc;
    // abc && clearTimeout(abc);
    if (!projectInfoLoading) {
      abc = setTimeout(() => {
        if (animateText.length === currIndex + 1) {
          setCurrIndex(0);
        } else {
          setCurrIndex((prev) => prev + 1);
        }
      }, 3000);
    }
    return abc;
  }, [currIndex, projectInfoLoading]);
  return (
    <div className={classes.textWrapper}>
      {animateText?.map((el, index) => (
        <div
          key={index}
          className={`ralewayThinItalic1 ff_Lato_Italic ${
            currIndex === index ? classes.textAnime : "textAnime2"
          } `}
          style={{
            fontSize: 16,
          }}
        >
          <Wave effect="verticalFadeIn" delay={4} text={el} />
        </div>
      ))}
    </div>
  );
}
