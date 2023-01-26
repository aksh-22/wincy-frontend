import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";

import CustomAvatar from "components/CustomAvatar";
import CustomChip from "components/CustomChip";
import CustomProgressBar from "components/CustomProgressBar";
import moment from "moment";
import { useSelector } from "react-redux";

import CustomPopper from "components/CustomPopper";
import TeamPopData from "components/TeamPopData";
import TechnologyPopData from "components/TechnologyPopData";
import projectCard from "css/ProjectCard.module.css";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {},
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    color: theme.palette.text.secondary,
  },
}));

export default function ProjectCard({ info }) {
  const classes = useStyles();
  const technologies = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );

  const getProjectProgress = (milestoneCount) => {
    if (!milestoneCount) {
      return 0;
    } else if (!milestoneCount.Completed) {
      return 0;
    } else {
      let denominator =
        (milestoneCount.Incomplete ?? 0) +
        (milestoneCount?.NotStarted ?? 0) +
        milestoneCount?.Completed;
      return (milestoneCount?.Completed / denominator) * 100;
    }
  };

  return (
    <Link
      to={{
        pathname: `/main/projects/${info?._id}`,
        state: info,
      }}
    >
      <Card className={projectCard.projectCard} variant="outlined">
        <CardContent className={classes.content}>
          <div className={`${projectCard.header} d_flex`}>
            {info?.logo ? (
              <CustomAvatar src={info?.logo} withBorder />
            ) : (
              <CustomAvatar initials={info?.title[0]} />
            )}

            <p className="px-1">{info?.title}</p>
          </div>
          <div
            className={`flexWrap alignCenter mt-1 ${projectCard.chipContainer}`}
          >
            {info?.technologies.map(
              (x, i) =>
                i < 3 && (
                  <CustomChip
                    className="mr-1"
                    label={x}
                    bgColor={technologies[x]}
                    key={x}
                  />
                )
            )}
            {info?.technologies?.length - 3 > 0 && (
              <CustomPopper
                value={
                  <CustomAvatar
                    initials={`+${(
                      info?.technologies?.length - 3
                    )?.toString()}`}
                    variant="circular"
                    small
                  />
                }
                width={"auto"}
                content={<TechnologyPopData technology={info?.technologies} />}
              />
            )}
          </div>
          <div className="my-1">
            <CustomProgressBar
              value={getProjectProgress(info?.milestoneCount)}
            />
          </div>
          <span className={`errorFont`}>Deadline </span>
          <span className={`errorFont`}>
            {moment(info?.dueDate).format("DD-MMM-YYYY")}
          </span>
          <div className="flexWrap alignCenter  mt-1">
            {info?.projectHead && (
              <div className="mr-1">
                <CustomAvatar
                  borderThickness={3}
                  withBorder
                  variant="circular"
                  large
                  title={info?.projectHead?.name}
                  src={info?.ProjectHead?.profilePicture}
                />
              </div>
            )}

            {info?.team?.map(
              (x, i) =>
                i < 3 && (
                  <div className="pr-1" key={i}>
                    <CustomAvatar
                      variant="circular"
                      medium
                      src={x.profilePicture}
                      title={x.name}
                    />
                  </div>
                )
            )}
            {info?.team?.length - 3 > 0 && (
              <CustomPopper
                value={
                  <CustomAvatar
                    initials={`+${(info?.team?.length - 3)?.toString()}`}
                    variant="circular"
                    medium
                  />
                }
                width={"auto"}
                content={<TeamPopData team={info?.team} />}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
