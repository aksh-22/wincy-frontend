import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";

export default function SkeletonLead() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "50vw",
        }}
      >
        <Typography variant="h3">
          <Skeleton style={{ width: 450 }} />
        </Typography>
        <Typography variant="p">
          <Skeleton
            style={{ width: 80, borderRadius: 40, height: 60, marginLeft: 30 }}
          />
        </Typography>
      </div>
      <div style={{ width: 200, paddingTop: 20 }}>
        <Typography variant="p">
          <Skeleton />
        </Typography>
        <Typography variant="p">
          <Skeleton />
        </Typography>
        <Typography variant="p">
          <Skeleton />
        </Typography>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: 50,
            flexBasis: "100%",
          }}
        >
          <div>
            <Typography variant="p">
              <Skeleton />
            </Typography>
            <Typography variant="h3">
              <Skeleton style={{ width: 150 }} />
            </Typography>
          </div>
          <div>
            <Typography variant="p">
              <Skeleton />
            </Typography>
            <Typography variant="h3">
              <Skeleton style={{ width: 150 }} />
            </Typography>
          </div>
        </div>
        <div style={{ flexBasis: "100%" }}>
          <TableRowSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}
