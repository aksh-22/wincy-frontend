import { Skeleton } from "@material-ui/lab";
import React, { Component } from "react";
import "./ProjectCardSkeleton.css";
export class ProjectCardSkeleton extends Component {
  render() {
    return (
      <>
        <div
          className=" projectCard_skelton"
          style={{ height: this.props.height }}
        >
          <div className="d_flex">
            <div style={{ flex: 0.2 }}>
              <Skeleton variant="text" style={{ marginTop: -7 }} height={50} />
            </div>
            <div style={{ flex: 0.8, marginLeft: 5 }}>
              <Skeleton variant="text" height={25} />
            </div>
          </div>
          <div className="d_flex alignCenter ">
            {new Array(3).fill("")?.map((item, index) => (
              <Skeleton className="ellipse_variant" key={index} />
            ))}
            <Skeleton variant="circle" width={25} height={25} />
          </div>
          <Skeleton variant="text" height={22} className="mt-1" />
          <Skeleton variant="text" height={22} className="my-1" />

          {!this.props.height && (
            <div className="d_flex">
              {new Array(5).fill("")?.map((item, index) => (
                <Skeleton
                  variant="circle"
                  width={25}
                  height={25}
                  key={index}
                  className="mr-1"
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}
export default ProjectCardSkeleton;
