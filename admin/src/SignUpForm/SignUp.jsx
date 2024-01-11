import React from "react";
import './SignUp.css';
import { TextField, Button } from "@mui/material";
import { withRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { createUser } from '../Redux/actions'
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

class SignUp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            usernameInputText: "",
            emailInputText: "",
            passwordInputText: "",
            confirmPasswordInputText: "",
            usernameInputFieldEmptyError: false,
            passwordInputFieldEmptyError: false,
            emailInputFieldEmptyError: false,
            confirmPasswordInputFieldEmptyError: false,
            confirmPasswordAndPasswordEqualityError: false,
            emailRegexError: false,

            usernameLengthError: false,
            passwordLengthError: false,
            loginPageRenderFlag: false,
        }
    }

    emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i


    handleUsernameInputChange(e) {
        this.setState({ usernameInputText: e.target.value })

        //   EMPTY FIELD CHECK
        if (e.target.value === '')
            this.setState({ usernameInputFieldEmptyError: true });
        else
            this.setState({ usernameInputFieldEmptyError: false });

        // MINIMUM USERNAME LENGTH
        if (e.target.value.length < 5 && e.target.value.length > 0)
            this.setState({ usernameLengthError: true });
        else
            this.setState({ usernameLengthError: false })
    }


    handleEmailInputChange(e) {
        this.setState({ emailInputText: e.target.value })

        if (this.emailRegex.test(e.target.value))
            this.setState({ emailRegexError: false })
        else
            this.setState({ emailRegexError: true })

        //   EMPTY FIELD CHECK
        if (e.target.value === '')
            this.setState({ emailInputFieldEmptyError: true, emailRegexError: false })
        else
            this.setState({ emailInputFieldEmptyError: false })

    }


    handlePasswordInputChange(e) {
        this.setState({ passwordInputText: e.target.value })

        //   EMPTY FIELD CHECK
        if (e.target.value === '')
            this.setState({ passwordInputFieldEmptyError: true, })
        else
            this.setState({ passwordInputFieldEmptyError: false })

        //   IF PASSWORD FIELD IS SELECTED THEN CONFIRM PASSWORD SHOULD BE EMPTY WITH NO ERRORS THERE

        if (e.target.value === '')
            this.setState({
                confirmPasswordInputText: '',
                confirmPasswordInputFieldEmptyError: false,
                confirmPasswordAndPasswordEqualityError: false
            })


        //   MINIMUM PASSWORD LENGTH CHECK
        if (e.target.value.length < 7 && e.target.value.length > 0)
            this.setState({ passwordLengthError: true });
        else
            this.setState({ passwordLengthError: false })

    }


    handleConfirmPasswordInputChange(e) {
        this.setState({ confirmPasswordInputText: e.target.value })

        //   EMPTY FIELD CHECK
        if (e.target.value === '')
            this.setState({ confirmPasswordInputFieldEmptyError: true })
        else
            this.setState({ confirmPasswordInputFieldEmptyError: false })

        //   CONFIRM PASSWORD AND PASSWORD EQUALITY CHECK
        const { passwordInputText } = this.state
        if (e.target.value !== '') {
            if (e.target.value !== passwordInputText)
                this.setState({ confirmPasswordAndPasswordEqualityError: true })
            else
                this.setState({ confirmPasswordAndPasswordEqualityError: false })
        }
        else {
            this.setState({ confirmPasswordAndPasswordEqualityError: false })
        }

    }

    handleSignUpSubmitData() {
        const { usernameInputText, emailInputText, passwordInputText } = this.state;
        let signUpData = {
            username: usernameInputText,
            email: emailInputText,
            password: passwordInputText
        }
        this.props.createUser(signUpData.username, signUpData.email, signUpData.password, this.props.history)
    }



    render() {
        const { usernameInputText, passwordInputText, usernameInputFieldEmptyError, passwordInputFieldEmptyError, emailInputFieldEmptyError, emailInputText, confirmPasswordInputFieldEmptyError, confirmPasswordInputText, confirmPasswordAndPasswordEqualityError, emailRegexError, usernameLengthError, passwordLengthError } = this.state

        let disableSignUpButtonError = (passwordInputText.length === 0 || confirmPasswordInputText.length === 0 || usernameInputText.length === 0 || emailInputText.length === 0 || confirmPasswordAndPasswordEqualityError || emailRegexError)
        return (<>
            <div className="signUpPage">
                <div className="signUpFormSection" >
                    <div className="signUpNavBar">
                        <h1 className="signUpNavBarHeading">WELCOME</h1>
                        <Link to='/' id="loginRenderButton" className='homeButtonLink'>
                            <Button
                                variant="contained"
                                size="medium">
                                Login
                            </Button>
                        </Link>
                    </div>
                    <br /><br /><br />
                    <div className="signUpFormArea">
                        <div className="signUpHeading">
                            <h1>Sign Up</h1>
                        </div>
                        <div className="InputField">
                            <TextField className="signUpFormElement" type="text" error={usernameInputFieldEmptyError || usernameLengthError} value={usernameInputText} variant="outlined" label="Username" onChange={(e) => {
                                this.handleUsernameInputChange(e)
                            }} />
                            {usernameInputFieldEmptyError && (<div className="errorMessage" >This field is mandatory!</div>)}
                            {usernameLengthError && (<div className="errorMessage" >Username must have atleast 5 characters!</div>)}
                        </div>
                        <div className="InputField">
                            <TextField className="signUpFormElement" type="email" error={emailInputFieldEmptyError || emailRegexError} value={emailInputText} variant="outlined" label="Email"
                                onFocus={(e) => {
                                    if (usernameInputText.length === 0)
                                        this.setState({ usernameInputFieldEmptyError: true })
                                }}
                                onChange={(e) => {
                                    this.handleEmailInputChange(e)
                                }} />
                            {emailInputFieldEmptyError && (<div className="errorMessage" >This field is mandatory!</div>)}
                            {emailRegexError && (<div className="errorMessage" >Provide a valid Email!</div>)}
                        </div>
                        <div className="InputField">
                            <TextField className="signUpFormElement" variant="outlined" label="Password"
                                type="password"
                                error={passwordInputFieldEmptyError || passwordLengthError}
                                value={passwordInputText}
                                onFocus={(e) => {
                                    if (usernameInputText.length === 0)
                                        this.setState({ usernameInputFieldEmptyError: true })
                                    if (emailInputText.length === 0)
                                        this.setState({ emailInputFieldEmptyError: true })

                                }}
                                onChange={(e) => {
                                    this.handlePasswordInputChange(e)
                                }} />
                            {passwordLengthError && (<div className="errorMessage" >Password must have atleast 7 characters!</div>)}
                            {passwordInputFieldEmptyError && (<div className="errorMessage" >This field is mandatory!</div>)}
                        </div>
                        <div className="InputField">
                            <TextField className="signUpFormElement" type="password" error={confirmPasswordInputFieldEmptyError || confirmPasswordAndPasswordEqualityError} value={confirmPasswordInputText} variant="outlined" label="Confirm Password"
                                disabled={passwordInputText.length === 0}
                                onChange={(e) => {
                                    this.handleConfirmPasswordInputChange(e)
                                }} />
                            {confirmPasswordInputFieldEmptyError && (<div className="errorMessage" >This field is mandatory!</div>)}
                            {confirmPasswordAndPasswordEqualityError && (<div className="errorMessage" >Enter same password!</div>)}
                        </div>
                        <span className="signUpFormElement" style={{ cursor: disableSignUpButtonError ? "not-allowed" : "pointer" }}>
                            {/* <Link to='/'> */}
                            <Button id="signUpButton" variant="contained"
                                disabled={disableSignUpButtonError}
                                style={{
                                    backgroundColor: disableSignUpButtonError ? "#0000001f" : "#034694",

                                    cursor: disableSignUpButtonError ? "pointer" : "not-allowed !important"
                                }}
                                onClick={() => { this.handleSignUpSubmitData() }}>
                                SIGN UP
                            </Button>
                            {/* </Link> */}
                        </span>
                    </div>
                </div>
            </div >
            <ToastContainer />
        </>)
    }

}


const mapDispatchToProps = dispatch => {
    return {
        createUser: (username, email, password, history) => dispatch(createUser(username, email, password, history)),
    };
};
const mapStateToProps = (state) => {
    return {
        createNewUserData: state.createNewUserData,

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
