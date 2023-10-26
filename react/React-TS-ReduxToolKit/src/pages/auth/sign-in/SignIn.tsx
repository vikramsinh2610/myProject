// dependencies
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

// mui/material
import { Box, Avatar, Typography, TextField, Button, Grid, Link, Container } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

//model
import { SignInModel } from "../auth.model";

// api
import { SignInAPI } from "../auth.service";

// other
import { AppUrls } from '../../../AppUrls';

// initialize
const init = { email: "", password: "" }

const SignIn = () => {

    const navigate = useNavigate();
    let [signInForm, setSignInForm] = useState<SignInModel>(init);

    /**
     * Function to handle change
     * @param event 
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        signInForm[event.currentTarget.name as keyof SignInModel] = event.currentTarget.value
        setSignInForm({ ...signInForm })
    }

    /**
     * Function to handle sing in
     */
    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await SignInAPI(signInForm)
            .then(({ data }) => {
                if (data.status === 'success' && data.auth_token) {
                    localStorage.setItem('token', data.auth_token)
                    navigate(`${AppUrls.Client.Dashboard}`);
                }
            }).catch(() => { })
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoFocus onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" onChange={handleChange} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
                    <Grid container>
                        <Grid item>
                            <Link href={AppUrls.Client.Auth.SignUp} variant="body2">{"Don't have an account? Sign Up"}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignIn;
