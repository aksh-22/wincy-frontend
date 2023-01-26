import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  // &&
  // userInfo?.token_scopes[0] === "full-scope"

  const userInfo = useSelector((state) => state.userReducer.userData);
  return (
    <>
      <Route
        {...rest}
        render={(props) =>
          userInfo?.token !== undefined ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    </>
  );
};
export default PrivateRoute;
