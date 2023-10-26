
export class GlobalAppUrls {
    public Client = {
        Auth: {
            SignIn: "/sign-in",
            SignUp: "/sign-up",
        },
        Dashboard: "/dashboard",
    };

    public Server = {
        Auth: {
            SignIn: "/login",
            SignUp: "/register",
        },
    };
}
export const AppUrls = new GlobalAppUrls();
