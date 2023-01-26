import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import React, { memo, useEffect, useState } from "react";
import "./Image.css";
const useStylesTooltip = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    fontFamily: "Lato-Regular",
    // fontWeight: "800",
  },
}));

const Image = memo(
  ({
    src,
    className,
    style,
    title,
    placeHolderClassName,
    type,
    placeholderToolTip,
  }) => {
    const [imageError, setImageError] = useState(false);
    useEffect(() => {
      if (src) {
        setImageError(false);
      } else {
        setImageError(true);
      }
    }, [src, title]);
    const classes = useStylesTooltip();

    return (
      <Tooltip
        arrow
        title={
          type === "createdBy"
            ? `Created By ${title}`
            : type === "assignee"
            ? `Assigned to ${title}`
            : title ?? placeholderToolTip ?? ""
        }
        classes={classes}
        style={{ zIndex: 1200 }}
      >
        {!imageError ? (
          <img
            src={src}
            className={`imageAvatar ${className}`}
            alt="No_Image_Available"
            onError={(e) => {
              e.target.onerror = null;
              // e.target.src = imagePlaceholder;
              setImageError(true);
            }}
            style={{
              height: 25,
              width: 25,
              objectFit: "cover",
              ...style,
            }}
            // title={title}
          />
        ) : (
          <div
            className={`imagePlaceHolder ${placeHolderClassName}`}
            style={{
              textTransform: "capitalize",
              border: "1px solid #FFF",
              overflow: "hidden",
              ...style,
            }}
          >
            {title ? title[0] : "N/A"}
          </div>
        )}
      </Tooltip>
    );
  }
);

export default Image;
