import React from "react";
import Arrow from "./arrow/Arrow";
import "./BugFlowChart.css";
import Cell from "./cell/Cell";
function BugFlowChart({ status, failedReviewCount, reOpenCount }) {
  console.log(
    "status ,failedReviewCount , reOpenCount",
    status,
    failedReviewCount,
    reOpenCount
  );

  const arrowColor = (arrowPointer) => {
    // if (status === "Open" || arrowPointer === "Open") {
    //   return "var(--green)";
    // }
    if (
      (status === "InReview" && arrowPointer === "InProgress") ||
      (status === "Done" && arrowPointer === "InProgress") ||
      (status === "BugPersists" && arrowPointer === "InProgress") ||
      (status === "BugPersists" && arrowPointer === "InReview") ||
      (status === "Done" && arrowPointer === "InReview")
    ) {
      return "var(--green)";
    }
    if (status === arrowPointer) {
      return "var(--green)";
    }
  };
  return (
    <div className="alignCenter justifyContent_center d_flex">
      <div style={{ overflowX: "auto", paddingLeft: 30 }}>
        <CellContainer classes="flexColumn" style={{ width: 100 }}>
          <Cell title="Create" borderNone />
          <Arrow
            arrowDirection="left"
            height={30}
            arrowColor={"var(--green)"}
          />
        </CellContainer>
        <CellContainer classes="alignStart">
          <CellContainer classes="alignStart">
            <CellContainer classes="flexColumn">
              <Cell
                title="Open"
                backgroundColor="var(--primary)"
                isAnimation={status === "Open" ? true : false}
              />
              <Arrow height={30} arrowDirection="top" />
            </CellContainer>
          </CellContainer>
          {/* //TODO: See Code here  */}
          <CellContainer classes="alignStart">
            <Cell
              title={
                <Arrow
                  horizontal
                  width={100}
                  arrowColor={arrowColor("InProgress")}
                />
              }
              borderNone
            />
          </CellContainer>
          <CellContainer classes="flexColumn">
            <Cell title="Start Progress" borderNone />
            <Arrow height={30} arrowColor={arrowColor("InProgress")} />
          </CellContainer>
        </CellContainer>
        <CellContainer classes="alignStart ml-1">
          <CellContainer classes="" style={{ flex: 1 }}>
            <Cell title="Stop Progress" borderNone />
            {/* <Arrow width={100} horizontal pointerDisable /> */}
            <Cell
              borderNone
              title={<Arrow width={100} horizontal arrowDirection="left" />}
            />
          </CellContainer>

          <CellContainer classes="alignCenter">
            <Cell
              title="In Progress"
              backgroundColor="var(--progressBarColor)"
              isAnimation={status === "InProgress" ? true : false}
            />
            <Cell
              borderNone
              title={
                <Arrow
                  width={100}
                  horizontal
                  arrowColor={arrowColor("InReview")}
                />
              }
            />
          </CellContainer>

          <CellContainer classes="alignCenter flexColumn">
            <Cell title="Ready For Code Review" borderNone />
            <Cell
              borderNone
              title={<Arrow height={50} arrowColor={arrowColor("InReview")} />}
            />
          </CellContainer>
        </CellContainer>
        <CellContainer classes="alignStart">
          <CellContainer
            classes="alignCenter flexColumn"
            style={{ flex: 0.9 }}
          />
          <CellContainer
            classes="alignCenter flexColumn"
            style={{ position: "relative" }}
          >
            <Arrow
              height={40}
              arrowDirection="top"
              style={{
                position: "absolute",
                transform: "translate(-50%, -120%)",
              }}
              // arrowColor={arrowColor("InProgress")}
            />
            <Cell
              title={`Bug Persists (${failedReviewCount ?? 0})`}
              // borderNone
              style={
                {
                  // color:"var(--defaultWhite)",
                  // fontFamily:"Lato-Italic"
                }
              }
              backgroundColor="var(--red)"
              isAnimation={status === "BugPersists" ? true : false}
              // backgroundColor="var(--red)"
            />
          </CellContainer>
          <CellContainer classes="alignCenter">
            <Cell
              borderNone
              title={
                <Arrow
                  horizontal
                  width={100}
                  arrowDirection="left"
                  arrowColor={arrowColor("BugPersists")}
                />
              }
            />
            <Cell
              title="Code Review"
              backgroundColor="var(--primary)"
              isAnimation={status === "InReview" ? true : false}
            />
          </CellContainer>
        </CellContainer>
        <CellContainer classes="mt-5" style={{ position: "relative" }}>
          <Arrow
            height={220}
            arrowDirection="top"
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
            }}
          />
          <Cell
            title={`Reopen (${reOpenCount ?? 0})`}
            borderNone
            backgroundColor="#171b34"
            style={{
              position: "absolute",
              transform: "translate(-35%, -250%)",
              color: "var(--chipOrange)",
              fontFamily: "Lato-Italic",
            }}
          />
          <CellContainer classes="alignCenter">
            <Cell
              borderNone
              title={<Arrow horizontal width={400} pointerDisable />}
              style={{ paddingLeft: 0 }}
            />
            <Cell
              title="Done"
              backgroundColor="var(--green)"
              isAnimation={status === "Done" ? true : false}
            />
            <Arrow
              horizontal
              width={30}
              arrowDirection="left"
              style={{ marginLeft: 5 }}
              arrowColor={arrowColor("Done")}
            />
          </CellContainer>
          <CellContainer classes="alignCenter" style={{ position: "relative" }}>
            <Arrow
              height={70}
              pointerDisable
              style={{
                position: "absolute",
                bottom: "-50%",
              }}
              arrowColor={arrowColor("Done")}
            />
          </CellContainer>
        </CellContainer>
      </div>
    </div>
  );
}

export default BugFlowChart;

function CellContainer({ children, classes, style, childStyle }) {
  return (
    <div className={`d_flex alignCenter   ${classes}`} style={{ ...style }}>
      {children}
    </div>
  );
}
