import React from "react";
import './Login.css';
import { TextField, Button } from "@mui/material";
import axios from 'axios'
import { withRouter, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { loginUser, getData } from '../Redux/actions'
import { connect } from 'react-redux'
// import { VisibilityOff, Visibility } from '@material-ui/icons';
// import { InputLabel, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            emailInputText: "",
            passwordInputText: "",
            emailInputFieldEmptyError: false,
            passwordInputFieldEmptyError: false,

            emailRegexError: false,
            passwordLengthError: false,

            loginError: false,
            loginSuccess: false,

            showPassword: false,

        }
    }

    emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i


    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token !== null) {

            axios.get('http://localhost:8000/validateToken', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                // console.log('res')
                this.props.getData(this.props.history);
                this.props.history.push('/home');
            })
                .catch((error) => {

                    this.props.history.push('/');
                    localStorage.clear();
                })
        }
    }

    handleEmailInputChange(e) {
        this.setState({ emailInputText: e.target.value })

        //IF EMAIL IS VALID CHECK
        if (!this.emailRegex.test(e.target.value) && e.target.value.length !== 0)
            this.setState({ emailRegexError: true })
        else
            this.setState({ emailRegexError: false })
        //IF EMAIL IS EMPTY CHECK

        if (e.target.value.length === 0)
            this.setState({ emailInputFieldEmptyError: true })
        else
            this.setState({ emailInputFieldEmptyError: false })

    }

    handlePasswordInputChange(e) {
        this.setState({ passwordInputText: e.target.value })

        //IF PASSWORD FIELD IS EMPTY CHECK
        if (e.target.value.length === 0)
            this.setState({ passwordInputFieldEmptyError: true })
        else
            this.setState({ passwordInputFieldEmptyError: false })

        //IF PASSWORD LENGTH IS < 7 CHARACTERS
        if (e.target.value.length > 0 && e.target.value.length < 7)
            this.setState({ passwordLengthError: true })
        else
            this.setState({ passwordLengthError: false })
    }

    handleLoginSubmitData() {
        const { emailInputText, passwordInputText } = this.state;
        const { loginUser } = this.props
        const loginData = {
            email: emailInputText,
            password: passwordInputText
        }
        this.setState({ loginError: false, loginSuccess: false })


        loginUser(loginData.email, loginData.password, this.props.history)


    }

    handleClickShowPassword = () => {

    }

    render() {
        const { emailInputText, passwordInputText, emailInputFieldEmptyError, passwordInputFieldEmptyError, emailRegexError, passwordLengthError, loginError, loginSuccess } = this.state;


        let disableLoginButtonError = (emailInputText.length === 0 || passwordInputText.length === 0 || emailRegexError || passwordLengthError)
        return (<>
            <div className="loginPage">
                <div className="loginFormSection" >
                    <div className="loginNavBar">
                        <h1 className="loginNavBarHeading">WELCOME </h1>
                        <Link to='/signUp' id="signUpRenderButton" className='homeButtonLink'>
                            <Button
                                variant="contained"
                                size="medium">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                    <br /><br /><br />
                    <div className="loginFormArea">
                        <div className="loginHeading">
                            <h1>Login</h1>
                        </div>
                        <div className="InputField">
                            <TextField className="loginFormElement" variant="outlined" label="Email" type="email"
                                error={emailInputFieldEmptyError || emailRegexError} value={emailInputText}
                                onChange={(e) => {
                                    this.handleEmailInputChange(e)
                                }} />
                            {emailRegexError && (<div className="errorMessage" >Not a valid Email!</div>)}
                            {emailInputFieldEmptyError && (<div className="errorMessage" >This field is mandatory!</div>)}
                        </div>
                        <div className="InputField">
                            <TextField className="loginFormElement" type='password' error={passwordInputFieldEmptyError || passwordLengthError} value={passwordInputText} variant="outlined" label="Password"
                                onFocus={(e) => {
                                    if (emailInputText.length === 0)
                                        this.setState({ emailInputFieldEmptyError: true })
                                }}
                                onChange={(e) => {
                                    this.handlePasswordInputChange(e)
                                }} />

                            {passwordInputFieldEmptyError && (<div className="errorMessage" >This field is mandatory!</div>)}
                            {passwordLengthError && (<div className="errorMessage" >Password must be atleast 7 characters long!</div>)}
                        </div>
                        <span className="loginFormElement" style={{ cursor: disableLoginButtonError ? "not-allowed" : "pointer" }}>
                            <Button className="loginFormElement" id="loginButton" variant="contained"
                                disabled={disableLoginButtonError}
                                style={{
                                    backgroundColor: disableLoginButtonError ? "#0000001f" : "#034694",

                                    cursor: disableLoginButtonError ? "pointer" : "not-allowed !important"
                                }}
                                onClick={() => {
                                    this.handleLoginSubmitData()
                                }}>
                                LOGIN
                            </Button>
                        </span>
                    </div>
                </div>
            </div >
            <ToastContainer />
        </>)
    }

}

const mapStateToProps = (state) => {
    return {
        loggedInUserData: state.loggedInUserData
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (email, password, history) => dispatch(loginUser(email, password, history)),
        getData: (history) => dispatch(getData(history))
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

