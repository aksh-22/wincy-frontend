import { Skeleton } from "@material-ui/lab";
import React from "react";

function TableRowSkeleton({ height, count, style, marginTop }) {
  return new Array(count ?? 1).fill("loading").map((s_row, s_inx) => (
    <div key={`${s_row}_${s_inx}`} style={{ marginTop: marginTop ?? ".7rem" }}>
      <Skeleton
        variant="text"
        height={height ?? 25}
        style={{ transform: "scale(1, 0.9)", ...style }}
      />
    </div>
  ));
}

export default TableRowSkeleton;
