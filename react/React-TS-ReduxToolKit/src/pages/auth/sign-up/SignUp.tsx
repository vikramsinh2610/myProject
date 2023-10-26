// dependencies
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

// mui/material
import { Box, Avatar, Typography, TextField, Button, Grid, Link, Container } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

//model
import { SignUpModel } from "../auth.model";

// api
import { SignUpAPI } from "../auth.service";

// other
import { AppUrls } from '../../../AppUrls';

// initialize
const init = { email: "", password: "" }

const SignUp = () => {

    const navigate = useNavigate();
    const [signUpForm, setSignUpForm] = useState<SignUpModel>(init);

    /**
     * Function to handle change
     * @param event 
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        signUpForm[event.currentTarget.name as keyof SignUpModel] = event.currentTarget.value
        setSignUpForm({ ...signUpForm })
    }

    /**
     * Function to handle sing up
     */
    const handleSingUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await SignUpAPI(signUpForm)
            .then(({ data }) => {
                if (data.status === 'success' && data.auth_token) {
                    localStorage.setItem('token', data.auth_token)
                    navigate(`${AppUrls.Client.Dashboard}`);
                }
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">Sign up </Typography>
                <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSingUp}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField required fullWidth id="email" label="Email Address" name="email" onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth name="password" label="Password" type="password" id="password" onChange={handleChange} />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href={AppUrls.Client.Auth.SignIn} variant="body2"> Already have an account? Sign in</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
