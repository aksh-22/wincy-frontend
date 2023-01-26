import moment from "moment";
import React from "react";

const colors = {
  Private: "var(--primary)",
  holiday: "var(--progressBarColor)",
  milestone: "var(--red)",
  Public: "var(--green)",
};

export default function TileContent({ data , date }) {
  return (
    <div style={{ overflow: "visible", width: "100%" }}>
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 5,
          }}
        >
          {data?.map((el, index) => (
            <span
              key={index}
              style={{ backgroundColor: colors[el.type] }}
              className="dot"
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
