// import React, { useEffect, useState } from 'react';
// import classes from './ProjectCard.module.css';
// import Avatar from '@material-ui/core/Avatar';
// // import AvatarGroup from "@material-ui/lab/AvatarGroup";
// import CustomAvatarGroup from 'components/customAvatarGroups_k/CustomAvatarGroup';
// import { useSelector } from 'react-redux';
// import CustomChip from 'components/CustomChip';
// import moment from 'moment';
// import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
// import DateRangeIcon from '@material-ui/icons/DateRange';
// import { Link } from 'react-router-dom';
// import { LightTooltip } from 'components/tooltip/LightTooltip';
// import CustomProgressBar from 'components/customProgressBar/CustomProgressBar';

// export default function ProjectCard({ info }) {
// 	const technologies = useSelector(
// 		(state) => state.userReducer?.userData?.technologies
// 	);

// 	useEffect(() => {
// 		let tempTeam = [];
// 		if (
// 			info?.projectHead &&
// 			info?.projectHead !== '' &&
// 			Object.keys(info?.projectHead).length !== 0
// 		) {
// 			tempTeam.push({
// 				...info?.projectHead,
// 				projectHead: true,
// 			});
// 		}
// 		tempTeam = [...tempTeam, ...(info?.team ? info?.team : [])];
// 		setTeam(tempTeam);
// 	}, []);
// 	const [team, setTeam] = useState([]);
// 	const colorr = {
// 		Angular: '247, 72, 8',
// 		'Node.js': '247, 143, 8',
// 		'React.js': '8, 92, 247',
// 		PHP: '153,201,193',
// 		MongoDB: '70,166,63',
// 		MySQL: '21,171,235',
// 		Flutter: '197,134,207',
// 		'React Native': '175,184,179',
// 	};

// 	let ExtraTeam = [...info?.team];
// 	ExtraTeam.splice(0, 2);

// 	const getProjectProgress = (milestoneCount) => {
// 		if (!milestoneCount) {
// 			return 0;
// 		} else if (!milestoneCount.Completed) {
// 			return 0;
// 		} else {
// 			let denominator =
// 				(milestoneCount.Active ?? 0) +
// 				(milestoneCount?.NotStarted ?? 0) +
// 				milestoneCount?.Completed;
// 			return (milestoneCount?.Completed / denominator) * 100;
// 		}
// 	};

// 	return (
// 		<Link
// 			to={{
// 				pathname: `/main/projects/${info?._id}`,
// 				state: info,
// 			}}
// 			className='boxShadow'>
// 			<div className={classes.projectBox}>
// 				<div className={classes.projectBox__header}>
// 					<div style={{ width: '20%' }}>
// 						<Avatar
// 							alt={info?.title}
// 							src={info?.logo}
// 							className={classes.avatar}
// 							style={{ backgroundColor: '#13132D' }}>
// 							<p
// 								style={{
// 									color: 'var(--defaultWhite)',
// 									textTransform: 'capitalize',
// 								}}>
// 								{info?.title[0]}
// 							</p>
// 						</Avatar>
// 					</div>
// 					<div
// 						className={classes.headDetails}
// 						style={{ width: '80%', paddingRight: 5 }}>
// 						<p
// 							className={`${classes.projectName} ralewaySemiBold`}
// 							style={{ fontSize: 18 }}>
// 							{info?.title}
// 						</p>
// 						{team?.length > 0 && (
// 							<CustomAvatarGroup
// 								className='d_flex alignCenter justifyContent_end p-05'
// 								data={team}
// 								// plusDisable
// 								maxLength={5}
// 							/>
// 						)}
// 					</div>
// 				</div>
// 				<div className={classes.projectBox__tags}>
// 					<CustomAvatarGroup
// 						max={3}
// 						plusAvatarStyle={{
// 							height: 30,
// 							width: 30,
// 						}}
// 						extraavatarstooltiptitle={info?.technologies?.map(
// 							(item, index) =>
// 								index > 1 && (
// 									<CustomChip
// 										key={index}
// 										label={item}
// 										bgColor={technologies[item]}
// 										// bgColor={
// 										// 	apiKey === 'platforms'
// 										// 		? platform[item]
// 										// 		: technology[item]
// 										// }
// 										// className={`mr-1 mb-05    ${'ff_Lato_Regular'}`}
// 									/>
// 								)
// 						)}>
// 						{info?.technologies?.map((item, index) => (
// 							<CustomChip
// 								key={index}
// 								label={item}
// 								bgColor={technologies[item]}
// 								// bgColor={
// 								// 	apiKey === 'platforms'
// 								// 		? platform[item]
// 								// 		: technology[item]
// 								// }
// 								style={{
// 									marginRight: 15,
// 								}}
// 								// className={`   ${'ff_Lato_Regular'}`}
// 							/>
// 						))}
// 					</CustomAvatarGroup>
// 					{/* {info?.technologies.map(
// 						(x, i) =>
// 							i < 3 && (
// 								<CustomChip
// 									className={classes.chip}
// 									label={x}
// 									bgColor={technologies[x]}
// 									key={i}
// 								/>
// 							)
// 					)} */}
// 				</div>
// 				<CustomAvatarGroup
// 					max={3}
// 					plusAvatarStyle={{
// 						height: 30,
// 						width: 30,
// 					}}
// 					extraavatarstooltiptitle={info?.technologies?.map(
// 						(item, index) =>
// 							index > 1 && (
// 								<CustomChip
// 									key={index}
// 									label={item}
// 									bgColor={technologies[item]}
// 									// bgColor={
// 									// 	apiKey === 'platforms'
// 									// 		? platform[item]
// 									// 		: technology[item]
// 									// }
// 									// className={`mr-1 mb-05    ${'ff_Lato_Regular'}`}
// 								/>
// 							)
// 					)}>
// 					{info?.technologies?.map((item, index) => (
// 						<CustomChip
// 							key={index}
// 							label={item}
// 							bgColor={technologies[item]}
// 							// bgColor={
// 							// 	apiKey === 'platforms'
// 							// 		? platform[item]
// 							// 		: technology[item]
// 							// }
// 							style={{
// 								marginRight: 15,
// 							}}
// 							// className={`   ${'ff_Lato_Regular'}`}
// 						/>
// 					))}
// 				</CustomAvatarGroup>
// 				<CustomProgressBar value={getProjectProgress(info?.milestoneCount)} />
// 				<div className={classes.projectBox__footer}>
// 					<LightTooltip title='Start date'>
// 						<div
// 							style={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								color: 'var(--textColor)',
// 							}}>
// 							<DateRangeIcon style={{ fontSize: 20, marginRight: 5 }} />
// 							{info?.startedAt ? (
// 								<p>{moment(info?.startedAt).format('DD-MMM-YYYY')}</p>
// 							) : (
// 								<p>N/A</p>
// 							)}
// 						</div>
// 					</LightTooltip>

// 					<LightTooltip title='Deadline'>
// 						<div
// 							style={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								color: 'var(--textColor)',
// 							}}>
// 							<AssignmentTurnedInIcon
// 								style={{ fontSize: 20, marginRight: 5, color: 'var(--red)' }}
// 							/>
// 							{info?.dueDate ? (
// 								<p style={{ color: 'var(--red)' }}>
// 									{moment(info?.dueDate).format('DD-MMM-YYYY')}
// 								</p>
// 							) : (
// 								<p style={{ color: 'var(--red)' }}>N/A</p>
// 							)}
// 						</div>
// 					</LightTooltip>
// 				</div>
// 			</div>
// 		</Link>
// 	);
// }

import React, { useEffect, useState } from "react";
import classes from "./ProjectCard.module.css";
import Avatar from "@material-ui/core/Avatar";
// import AvatarGroup from "@material-ui/lab/AvatarGroup";
import CustomAvatarGroupChip from "components/CustomAvatarGroup/CustomAvatarGroup";
import CustomAvatarGroup from "components/customAvatarGroups_k/CustomAvatarGroup";

import { useSelector } from "react-redux";
import CustomChip from "components/CustomChip";
import moment from "moment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { Link } from "react-router-dom";
import { LightTooltip } from "components/tooltip/LightTooltip";
import CustomProgressBar from "components/customProgressBar/CustomProgressBar";

export default function ProjectCard({ info }) {
  const technologies = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );

  useEffect(() => {
    let tempTeam = [];
    if (
      info?.projectHead &&
      info?.projectHead !== "" &&
      Object.keys(info?.projectHead).length !== 0
    ) {
      tempTeam.push({
        ...info?.projectHead,
        projectHead: true,
      });
    }
    tempTeam = [...tempTeam, ...(info?.team ? info?.team : [])];
    setTeam(tempTeam);
  }, []);
  const [team, setTeam] = useState([]);
  // const colorr = {
  //   Angular: "247, 72, 8",
  //   "Node.js": "247, 143, 8",
  //   "React.js": "8, 92, 247",
  //   PHP: "153,201,193",
  //   MongoDB: "70,166,63",
  //   MySQL: "21,171,235",
  //   Flutter: "197,134,207",
  //   "React Native": "175,184,179",
  // };

  let ExtraTeam = [...info?.team];
  ExtraTeam.splice(0, 2);

  // const getProjectProgress = (milestoneCount) => {
  //   if (!milestoneCount) {
  //     return 0;
  //   } else if (!milestoneCount.Completed) {
  //     return 0;
  //   } else {
  //     let denominator =
  //       (milestoneCount.Active ?? 0) +
  //       (milestoneCount?.NotStarted ?? 0) +
  //       milestoneCount?.Completed;
  //     return (milestoneCount?.Completed / denominator) * 100;
  //   }
  // };
  return (
    <Link
      to={{
        pathname: `/main/projects/${info?._id}`,
        state: info,
      }}
      className="boxShadow"
    >
      <div className={classes.projectBox}>
        <div className={classes.projectBox__header}>
          <div style={{ width: "20%" }}>
            <Avatar
              alt={info?.title}
              src={info?.logo}
              className={classes.avatar}
              style={{ backgroundColor: "#13132D" }}
            >
              <p
                style={{
                  color: "var(--defaultWhite)",
                  textTransform: "capitalize",
                }}
              >
                {info?.title[0]}
              </p>
            </Avatar>
          </div>
          <div
            className={classes.headDetails}
            style={{ width: "80%", paddingRight: 5 }}
          >
            <p
              className={`${classes.projectName} ralewaySemiBold`}
              style={{ fontSize: 18 }}
            >
              {info?.title}
            </p>
            {team?.length > 0 && (
              <CustomAvatarGroup
                className="d_flex alignCenter justifyContent_end p-05 "
                data={team}
                marginLeft_0
                // plusDisable
                maxLength={5}
              />
            )}
          </div>
        </div>
        <div className={classes.projectBox__tags}>
          {/* {info?.technologies.map(
						(x, i) =>
							i < 3 && (
								<CustomChip
									className={classes.chip}
									label={x}
									bgColor={technologies[x]}
									key={i}
								/>
							)
					)}
					{info?.technologies.length > 3 && <p>+</p>} */}
          <CustomAvatarGroupChip
            max={3}
            plusAvatarStyle={{
              height: 30,
              width: 30,
            }}
            extraavatarstooltiptitle={info?.technologies?.map(
              (item, index) =>
                index > 1 && (
                  <CustomChip
                    key={index}
                    label={item}
                    bgColor={technologies[item]}
                    // bgColor={
                    // 	apiKey === 'platforms'
                    // 		? platform[item]
                    // 		: technology[item]
                    // }
                    className={`mr-1 mb-05    ${"ff_Lato_Regular"}`}
                  />
                )
            )}
          >
            {info?.technologies?.map((item, index) => (
              <CustomChip
                key={index}
                label={item}
                bgColor={technologies[item]}
                // bgColor={
                // 	apiKey === 'platforms'
                // 		? platform[item]
                // 		: technology[item]
                // }
                style={{
                  marginRight: 15,
                }}
                className={`   ${"ff_Lato_Regular"}`}
              />
            ))}
          </CustomAvatarGroupChip>
        </div>

        <CustomProgressBar
          value={
            ((info?.tasksCount?.completedTasks ?? 0) /
              (info?.tasksCount?.tasksTotal ?? 1)) *
            100
          }
        />
        <div className={classes.projectBox__footer}>
          <LightTooltip title="Start date">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--textColor)",
              }}
            >
              <DateRangeIcon style={{ fontSize: 20, marginRight: 5 }} />
              {info?.startedAt ? (
                <p>{moment(info?.startedAt).format("DD-MMM-YYYY")}</p>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </LightTooltip>

          <LightTooltip title="Deadline">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--textColor)",
              }}
            >
              <AssignmentTurnedInIcon
                style={{ fontSize: 20, marginRight: 5, color: "var(--red)" }}
              />
              {info?.dueDate ? (
                <p style={{ color: "var(--red)" }}>
                  {moment(info?.dueDate).format("DD-MMM-YYYY")}
                </p>
              ) : (
                <p style={{ color: "var(--red)" }}>N/A</p>
              )}
            </div>
          </LightTooltip>
        </div>
      </div>
    </Link>
  );
}
