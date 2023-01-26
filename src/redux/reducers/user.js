const initialState = {
  userData: {},
  selectedOrganisation: {},
  userType: {},
  sessionExpired: false,
  projectInfo: [],
  isTaskSelected: [],
  isModuleSelected: [],
  isSubTaskSelected: {},
  version: 0,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SESSION_EXPIRED":
      return {
        ...state,
        sessionExpired: action?.payload,
      };
    case "APP_VERSION_CHANGE":
      return {
        ...state,
        version: action?.payload,
      };
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };

    case "UPDATE_USER_DATA":
      return {
        ...state,
        userData: {
          ...state.userData,
          user: action.payload,
        },
      };
    case "UPDATE_USER_TYPE":
      return {
        ...state,
        userData: {
          ...state.userData,
          user: {
            ...state.userData.user,
            userType: [...state.userData.user.userType, action.payload],
          },
        },
      };
    case "SELECTED_ORGANISATION":
      return {
        ...state,
        selectedOrganisation: action.payload,
      };
    case "USER_TYPE":
      return {
        ...state,
        userType: action.payload,
      };

    case "UPDATE_USER_DETAILS":
      return {
        ...state,
        userData: { ...state.userData, user: action.payload },
      };

    case "SET_TEAM":
      return {
        ...state,
        projectInfo: action.payload,
      };
    case "TASK_SELECT":
      return {
        ...state,
        isTaskSelected: action.payload,
      };

    case "MODULE_SELECT":
      return {
        ...state,
        isModuleSelected: action.payload,
      };
    case "SUB_TASK_SELECT":
      return {
        ...state,
        isSubTaskSelected: action.payload,
      };
    default:
      return state;
  }
};
export default userReducer;
