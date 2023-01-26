import { combineReducers } from "redux";
import userReducer from "redux/reducers/user";
import organizationModal from "./organizationModal";
import filterReducer from './filterReducer'
const appReducer = combineReducers({
  userReducer,
  organizationModal,
  filterReducer
});
const rootReducer = (state, action) => {
  if (action.type === "Logout") {
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
