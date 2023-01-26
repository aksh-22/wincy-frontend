import "css/App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import Login from "pages/auth/Login";
import PrivateRoute from "routes/PrivateRoute";
import Welcome from "pages/auth/Welcome";
import ForgetPassword from "pages/auth/ForgetPassword";
import { ToastContainer } from "material-react-toastify";
import SignUp from "pages/auth/Signup";
import Milestone from "pages/projects/Milestone";
import JoinNew from "pages/join/JoinNew";
import JoinExist from "pages/join/JoinExist";
import SideBar from "pages/home/Sidebar";
import { useGetSystemData } from "react-query/system/useGetSystemData";
import { useEffect } from "react";

function App() {
  // const {data : platforms} = useGetSystemData("platforms")
  // const {data : technologies} = useGetSystemData("technologies")

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 60 * 1000 * 50,
      },
    },
  });

  // const localStoragePersistor = createWebStoragePersistor({storage: window.localStorage})

  // persistQueryClient({
  //   queryClient,
  //   persistor: localStoragePersistor,
  // })
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3}
        />
        <Switch>
          <Route path="/" component={Welcome} exact />
          <Route path="/login" component={Login} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/forget_password" component={ForgetPassword} exact />
          <Route path="/inviteRegistration/:token" component={JoinNew} exact />
          <Route
            path="/organisations/join/:token"
            component={JoinExist}
            exact
          />
          <PrivateRoute path="/main" component={SideBar} />
          <PrivateRoute path="/milestone" component={Milestone} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
