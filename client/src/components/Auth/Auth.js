import React, { useState } from 'react'
import { Grid, Paper, Typography, Button, Avatar, Container } from "@material-ui/core"
import { GoogleLogin } from "react-google-login"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import Icon from "./icon"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Input from './Input'
import { signin, signup } from "../../actions/auth"
import { AUTH } from '../../constants/actionTypes'

import useStyles from "./styles"

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })        
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        setShowPassword(false)
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: AUTH, data: { result, token } })
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    const googleFailure = (error) => {
        console.log(error)
        console.log("Google Sign In was unsuccessful. Try Again Later");
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {
                            isSignup && <Input name="confirmPassword" label="Repeat password" handleChange={handleChange} type="password" />
                        }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>{isSignup ? 'Sign Up' : 'Sign in'}</Button>
                    <GoogleLogin
                        clientId="884469956857-1q7skb2n9bll4l4o0a9pigs9ju5mvnee.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained"
                            >Google Sign In</Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth

// import React, { useState, useEffect } from 'react'
// import { Grid, Paper, Typography, Button, Avatar, Container } from "@material-ui/core"
// import { GoogleLogin } from "react-google-login"
// import Icon from "./icon"
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
// import Input from './Input'
// import { useGoogleLogin } from '@react-oauth/google';

// import useStyles from "./styles"

// const Auth = () => {
//     const classes = useStyles();
//     const [showPassword, setShowPassword] = useState(false);
//     const [isSignup, setIsSignup] = useState(false);

//     const state = null;

//     const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

//     const handleSubmit = (e) => { }

//     const handleChange = (e) => { }

//     const switchMode = () => {
//         setIsSignup((prevIsSignup) => !prevIsSignup)
//         handleShowPassword(false)
//     }

//     const googleSuccess = async (res) => {
//         console.log(res);
//         console.log("LOGGED IN SUCCESSFULLY")
//     }

//     const googleFailure = (error) => {
//         console.log(error)
//         console.log("Google Sign In was unsuccessful. Try Again Later");
//     }

//     const login = useGoogleLogin({
//         onSuccess: tokenResponse => console.log(tokenResponse),
//     });


//     return (
//         <Container component="main" maxWidth="xs">
//             <Paper className={classes.paper} elevation={3}>
//                 <Avatar className={classes.avatar}>
//                     <LockOutlinedIcon />
//                 </Avatar>
//                 <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
//                 <form className={classes.form} onSubmit={handleSubmit}>
//                     <Grid container spacing={2}>
//                         {
//                             isSignup && (
//                                 <>
//                                     <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
//                                     <Input name="firstName" label="First Name" handleChange={handleChange} half />
//                                 </>
//                             )
//                         }
//                         <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
//                         <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
//                         {
//                             isSignup && <Input name="confirmPassword" label="Repeat password" handleChange={handleChange} type="password" />
//                         }
//                     </Grid>
//                     <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>{isSignup ? 'Sign Up' : 'Sign in'}</Button>
//                     {/* <GoogleLogin
//                         clientId="884469956857-1q7skb2n9bll4l4o0a9pigs9ju5mvnee.apps.googleusercontent.com"
//                         render={(renderProps) => (
//                             <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained"
//                             >Google Sign In</Button>
//                         )}
//                         onSuccess={googleSuccess}
//                         onFailure={googleFailure}
//                         cookiePolicy="single_host_origin"
//                     /> */}
//                     <Button className={classes.googleButton} color="primary" fullWidth  onClick={() => login()}>
//                         Sign in with Google
//                     </Button>

//                     <Grid container justifyContent="flex-end">
//                         <Grid item>
//                             <Button onClick={switchMode}>{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Button>
//                         </Grid>
//                     </Grid>
//                 </form>
//             </Paper>
//         </Container>
//     )
// }

// export default Auth