import { useSelector } from "react-redux";
import { useHistory } from "react-router";

export const useUserType = () => {
  const users = useSelector(
    (state) => state.userReducer?.userData?.user?.userType
  );
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );

  const userId = useSelector((state) => state.userReducer?.userData?.user?._id);

  let userType = users?.find((x) => x?.organisation === selectedOrg?._id);
  // console.log("userId" , userId)
  userType = {
    ...userType,
    userId: userId,
  };
  return { userType };
};

export const useProjectTeam = () => {
  const projectInfo = useSelector((state) => state.userReducer?.projectInfo);
  const { location } = useHistory();
  let team = projectInfo?.team;
  let project = projectInfo?.project;
  let platforms = projectInfo?.project?.platforms;
  let projectId = projectInfo?.projectId;
  let orgId = projectInfo?.orgId;
  let milestoneId = location?.pathname.split("/")?.[4];
  let actionDisabled = projectInfo?.actionDisabled;
  let bugsPlatforms = projectInfo?.bugsPlatforms;
  let projectType = projectInfo?.project?.projectType;
  return {
    projectInfo,
    team,
    project,
    platforms,
    orgId,
    projectId,
    milestoneId,
    actionDisabled,
    bugsPlatforms,
    projectType,
  };
};
