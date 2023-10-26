// api
import api from "../../api";

// other
import { AppUrls } from "../../AppUrls";

//model
import { SignInModel, SignUpModel } from "./auth.model";

export const SignInAPI = async (data: SignInModel) => await api.post(`${AppUrls.Server.Auth.SignIn}`, data);

export const SignUpAPI = async (data: SignUpModel) => await api.post(`${AppUrls.Server.Auth.SignUp}`, data);