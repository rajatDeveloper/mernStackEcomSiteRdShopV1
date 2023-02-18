import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import "./LoginSignUp.css"
import { ImMail2 } from "react-icons/im";
import LockOpenIcon from "@material-ui/icons/LockOpen"
import FaceIcon from "@material-ui/icons/Face"
// import MailOutlineIcon from "@material-ui/icons/MailOutlineIcon"
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, login, register } from "../../actions/userAction"
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';

const LoginSignUp = () => {

    const dispatch = useDispatch();
    const histroy = useHistory();
    const alert = useAlert();
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = user;
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

    var data = useSelector(state => state.user);
    var error = data.error;
    var loading = data.loading;
    var isAuthenticated = data.isAuthenticated;

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated) {
            histroy.push("/account");
        }
    }, [dispatch, error, isAuthenticated, alert, histroy]);

    const loginSubmit = (e) => {

        e.preventDefault(e);
        dispatch(login(loginEmail, loginPassword));

        console.log("form submitted ! ");
    }


    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    };

    const registerSubmit = (e) => {
        e.preventDefault(e);

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);
        dispatch(register(myForm));

    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);

        } else {
            setUser({
                ...user, [e.target.name]: e.target.value
            });
        }
    };


    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
                <div className='LoginSignUpContainer'>
                    <div className='LoginSignUpBox'>
                        <div>
                            <div className='login_signUp_toggle'>
                                <p onClick={(e) => {
                                    switchTabs(e, "login")
                                }}>LOGIN</p>
                                <p onClick={(e) => {
                                    switchTabs(e, "register")
                                }}>REGISTER</p>
                            </div>
                            <button ref={switcherTab}></button>
                        </div>
                        <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                            <div className="loginEmail">
                                <ImMail2 />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="loginPassword">
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <Link to="/password/forgot">Forget Password ?</Link>

                            <input type="submit" value="Login" className="loginBtn" />
                        </form>

                        <form
                            className="signUpForm"
                            ref={registerTab}
                            encType="multipart/form-data"
                            onSubmit={registerSubmit}
                        >
                            <div className="signUpName">
                                <FaceIcon />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    name="name"
                                    value={name}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signUpEmail">
                                <ImMail2 />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signUpPassword">
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    name="password"
                                    value={password}
                                    onChange={registerDataChange}
                                />
                            </div>

                            <div id="registerImage">
                                <img src={avatarPreview} alt="Avatar Preview" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={registerDataChange}
                                />
                            </div>
                            <input type="submit" value="Register" className="signUpBtn" />
                        </form>


                    </div>
                </div>

            </Fragment>}
        </Fragment>
    )
}

export default LoginSignUp