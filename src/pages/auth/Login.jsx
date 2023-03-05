import React, { useState, useRef } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
// import companyLogo from "assets/images/companyLogo.jpeg";
import 'css/Login.css';
import RightSideAuth from './RightSideAuth';
import CustomButton from 'components/CustomButton';
import { useLogin } from 'react-query/auth/useLogin';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TextInput from 'components/textInput/TextInput';
import Icon from 'components/icons/IosIcon';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [isError, setIsError] = useState({
        email: false,
        password: false,
    });
    const [errorTxt, setErrorTxt] = useState({
        email: '',
        password: '',
    });

    const passwordRef = useRef();
    const { error: err, mutate, isLoading } = useLogin();
    const userInfo = useSelector((state) => state.userReducer.userData);
    const history = useHistory();

    const { path: url } = useRouteMatch();

    useEffect(() => {
        if (userInfo?.token) history.push('/main');
    }, [userInfo?.token, history]);

    const handleSubmit = () => {
        let emailReg =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email.trim().length === 0) {
            setIsError({ ...isError, email: true });
            setErrorTxt({
                ...errorTxt,
                email: 'Email is required',
            });
        } else if (!emailReg.test(email)) {
            setIsError({ ...isError, email: true });
            setErrorTxt({
                ...errorTxt,
                email: 'Email is not correct',
            });
        } else if (password.trim().length === 0) {
            setIsError({ ...isError, password: true });
            setErrorTxt({
                ...errorTxt,
                password: 'required*',
            });
        } else if (password.trim().length < 4) {
            setIsError({ ...isError, password: true });
            setErrorTxt({
                ...errorTxt,
                password: "Don't you think your password is weak",
            });
        } else {
            setError({});
            mutate(
                {
                    email,
                    password,
                }
                // {
                //   onError: () => {
                //     console.log("aaa");
                //     console.log(err);
                //     // setErrorTxt({
                //     //   ...errorTxt,
                //     //   password: "Don't you think your password is weak",
                //     // });
                //   },
                //   onSuccess: () => {
                //     console.log("aaa");
                //     console.log(err);
                //   },
                // }
            );
        }
        // if (validate()) {
        //   setError({});
        //   mutate({
        //     email,
        //     password,
        //   });
        // }
    };

    return (
        <div className='loginScreen'>
            <div className='workspaceLogo'>
                <Link
                    to='/'
                    style={{
                        display: 'flex',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        alignItems: 'end',
                    }}
                >
                    {/* <img
            src={companyLogo}
            alt="companyLogo"
            style={{
              width: "4rem",
              height: "4rem",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          /> */}
                    <Icon
                        name='projectLogo'
                        style={{
                            width: '40%',
                        }}
                    />
                    <p
                        className='ralewayThinIta1lic'
                        style={{ color: '#aaa', fontSize: 10 }}
                    >
                        &nbsp; Beta 0.4.95
                    </p>
                    {/* <p
            style={{
              paddingLeft: "15px",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            Workspace
          </p> */}
                </Link>
            </div>
            <div className='login_left'>
                <div className='logIn' style={{ zIndex: 999 }}>
                    <p className='ff_Lato_Regular'>Log In</p>
                    <p
                        style={{
                            fontSize: 18,
                            textAlign: 'center',
                            color: '#9699aa',
                            marginBottom: 20,
                        }}
                        className='ff_Lato_Italic'
                    >
                        Welcome To Wincy Dashboard
                    </p>
                    <div className='inputEl ff_Lato_Regular'>
                        {/* <span htmlFor="">Email Address*</span> */}
                        <TextInput
                            type='text'
                            name='email'
                            placeholder='Email Id'
                            autoFocus
                            variant='outlined'
                            className='inputField ff_Lato_Italic'
                            maxLength='40'
                            helperText={isError.email && errorTxt.email}
                            onChange={(e) => {
                                setIsError({ ...isError, email: false });

                                setEmail(e.target.value?.toLowerCase());
                            }}
                            inputProps={{ minlength: 1, maxLength: 40 }}
                            error={isError.email}
                        />
                    </div>

                    <div className='inputEl ff_Lato_Regular'>
                        {/* <span htmlFor="">Password*</span> */}
                        <TextInput
                            required
                            placeholder='Password'
                            onChange={(e) => {
                                setIsError({ ...isError, password: false });
                                setPassword(e.target.value);
                            }}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && handleSubmit()
                            }
                            ref={passwordRef}
                            maxLength='32'
                            variant='outlined'
                            className='inputField ff_Lato_Italic'
                            error={isError.password}
                            helperText={isError.password && errorTxt.password}
                            // minlength={8}
                            // maxLength={32}
                            visibilityControl
                        />
                    </div>
                    <p
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '80%',
                            fontSize: 13,
                        }}
                    >
                        <Link to='/forget_password' className='ff_Lato_Italic'>
                            Forgot Password?
                        </Link>
                    </p>
                    {/* <i
            class="fa fa-eye-slash"
            style={{
              color: '#43c072',
              borderRight: 'none',
              position: 'absolute',
              top: '11px',
              right: '143px',
            }}
            onClick={() => this.togglePassword()}
          /> */}
                    {error?.password && (
                        <p className='validationError'>{error?.password}</p>
                    )}

                    <CustomButton
                        onClick={handleSubmit}
                        width='80%'
                        loading={isLoading}
                        disabled={isLoading}
                        backgroundColor='var(--progressBarColor)'
                        style={{ margin: 30 }}
                    >
                        Login
                    </CustomButton>
                    <div>
                        <div
                            style={{ fontSize: 13 }}
                            className='ff_Lato_Regular'
                        >
                            Don&#39;t have an account?&nbsp;
                            <Link
                                to='/signUp'
                                style={{ color: 'var(--primary)' }}
                                className='ff_Lato_Italic'
                            >
                                Register Now.
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <img src={Shape2} className="shape2" alt="Shape" /> */}
                <div className='rightBox'></div>
                <RightSideAuth />
            </div>
        </div>
    );
}

export default Login;
