import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { emailAddressPattern } from "../../helpers/common";
import http from "../../services/http.service";
import { devLogError } from "../../helpers/logger";
import { signIn, useSession } from "next-auth/react";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import { useModalContext } from "../../context/contextLib";
import Google from "../../assets/img/logos/google.png";
import facebook from "../../assets/img/logos/facebook.png";
import Image from "next/image";

const AuthForm = ({ onParentSave, onChangeForm }: any) => {
  const session = useSession();
  const router = useRouter();
  const { setShowAuthModal } = useModalContext();
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState("login"); //signup
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [isData, setIsData] = useState<any>({
    IPv4: "",
    city: "",
    country_code: "",
    country_name: "",
    latitude: "",
    longitude: "",
    postal: "",
    state: "",
  });


  const handleLogin = async (data: any) => {
    setProgress(30);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError("password", {
        type: "manual",
        message: "Incorrect username or password",
      })
    }else if (res?.status === 401) {
      setError("password", {
        type: "manual",
        message: "Incorrect username or password",
      });
    }
    setProgress(100);
    localStorage.removeItem("uniqueCode")
  };

  const handleSignup = async (data: any) => {
    try {
      setProgress(30);
      let registerData = {
        ...data,
        location: {
          countryCode: isData?.country_code,
          countryName: isData?.country_name,
          city: isData?.city,
          postal: isData?.postal,
          latitude: isData?.latitude.toString(),
          longtitude: isData?.longitude.toString(),
          IPv4: isData?.ip,
          state: isData?.region,
        },
      };
      console.log(registerData);

      const res = await http.post(`/auth/register`, { ...registerData });

      if (res?.data) {
        handleLogin(data);
      }
    } catch (e: any) {
      devLogError("onSubmit error", e.res);

      if (e.res?.data.message.includes("Email already exists")) {
        setError("email", {
          type: "manual",
          message: e.res.data.message,
        });
      }
    } finally {
      setProgress(100);
    }
  };

  const handleForgotPassword = async () => {
    setShowAuthModal(false);
    router.push("/forgot-password");
  };

  const getData = async () => {
    const res = await http.get("https://ipapi.co/json/");
    setIsData(res?.data);
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      localStorage.setItem("user", JSON.stringify(session.data));
      onParentSave();
      let entryData : any =localStorage.getItem("anonymousEntry")
      try {
        if(entryData){
           http.put(`/entries/updateEntry`, {
            entryId: JSON.parse(entryData) ,
            userData: session.data
          });
        }
      } catch (e: any) {
        console.log("Data not founds",e);
      }
    } else {
      getData();
    }
  }, [session, onParentSave]);



  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />

      <Container>
        <h1 className="fw-semibold display-7 text-center">
          {form === "login" ? "Login to" : "Signup for"}
          <div className="d-inline text-gl-primary"> GiftLips</div>
        </h1>

        <Form>
          <div className="socialLogin">
            <div className="socialLogin__button">
              <Button
                type="button"
                className="social-btn"
                onClick={() => signIn("google")}
                disabled={progress > 0}
                title={form === "login" ? "Google Login" : "Google Signup"}
              >
                <Image src={Google} alt="All events" width="18" height="18" />{" "}
                Continue with Google
              </Button>
              <Button
                type="button"
                className="social-btn"
                onClick={() => signIn("facebook")}
                disabled={progress > 0}
                title={form === "login" ? "Facebook Login" : "Facebook Signup"}
              >
                <Image src={facebook} alt="All events" width="18" height="18" />{" "}
                Continue with facebook
              </Button>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "This field is required",
                pattern: emailAddressPattern,
              })}
            />
            <ErrorMessage
              errors={errors}
              name={`email`}
              render={({ message }) => (
                <div className="gl-error-message invalid-feedback">
                  {message}
                </div>
              )}
            />
          </Form.Group>

          {form === "signup" && (
            <>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", {
                    required: "This field is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`firstName`}
                  render={({ message }) => (
                    <div className="gl-error-message invalid-feedback">
                      {message}
                    </div>
                  )}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", {
                    required: "This field is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`lastName`}
                  render={({ message }) => (
                    <div className="gl-error-message invalid-feedback">
                      {message}
                    </div>
                  )}
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="off"
              {...register("password", {
                required: "This field is required",
              })}
            />
            <ErrorMessage
              errors={errors}
              name={`password`}
              render={({ message }) => (
                <div className="gl-error-message invalid-feedback">
                  {message}
                </div>
              )}
            />
          </Form.Group>

          <Button
            className="p-0"
            variant={"link"}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Button>

          <div className="buttons mt-3">
            <Button
              variant="gl-primary"
              type="submit"
              className="w-100 rounded-1 btn-gl-primary-linear-gradient"
              onClick={handleSubmit(
                form === "login" ? handleLogin : handleSignup
              )}
              disabled={progress > 0}
            >
              {form === "login" ? "Login" : "Signup"}
            </Button>
          </div>
        </Form>

        <footer className="footer mt-1 text-center">
          <div className="container">
            {form === "login" ? (
              <span className="text-muted">
                Don’t have an account?
                <Button
                  className="p-0"
                  variant={"link"}
                  onClick={() => {
                    setForm("signup");
                  }}
                >
                  Sign up
                </Button>
              </span>
            ) : (
              <span className="text-muted">
                Already have an account?
                <Button
                  className="p-0"
                  variant={"link"}
                  onClick={() => {
                    setForm("login");
                  }}
                >
                  Log in
                </Button>
              </span>
            )}
          </div>
        </footer>
      </Container>
    </>
  );
};

export default AuthForm;
