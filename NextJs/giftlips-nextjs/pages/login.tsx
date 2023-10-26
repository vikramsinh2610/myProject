import { ErrorMessage } from "@hookform/error-message";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TermsAndPolicy from "../components/TermsAndPolicy/TermsAndPolicy";
import { emailAddressPattern } from "../helpers/common";
import logo from "../assets/img/logos/app-logo.svg";
import LoadingBar from "react-top-loading-bar";
import { signIn, useSession } from "next-auth/react";
import Google from "../assets/img/logos/google.png";
import facebook from "../assets/img/logos/facebook.png";

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [progress, setProgress] = useState(30);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setProgress(100);
  }, []);

  const handleLogin = async (data: any) => {
    setProgress(30);
    const cardIdInStorage = localStorage.getItem("cardId") || "";

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      cardId: cardIdInStorage,
      redirect: false,
    });

    if (res?.status === 401) {
      setError("password", {
        type: "manual",
        message: "Incorrect username or password",
      });
    }

    if (res?.status === 200) {
      localStorage.removeItem("cardId");

      if (cardIdInStorage) {
        router.push(`/cards/${cardIdInStorage}/edit`);
      } else {
        router.push(`/`);
      }
    }

    setProgress(100);
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      localStorage.setItem("user", JSON.stringify(session.data));
      router.push(`/`);
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Login - GiftLips</title>
      </Head>

      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />

      <main
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh", backgroundColor: "rgba(0, 0, 0, .5)" }}
      >
        <Card className="p-3" style={{ maxWidth: "440px" }}>
          <Card.Body>
            <Container className="mb-3 text-center">
              <Image
                priority
                src={logo}
                alt=""
                onClick={() => router.reload()}
                role="button"
                style={{ height: "48px", width: "auto" }}
              />
            </Container>

            <h4 className="mb-4 text-center">Login</h4>

            <Form>
              <div className="socialLogin">
                <div className="socialLogin__button">
                  <Button
                    type="button"
                    className="social-btn"
                    onClick={() => signIn("google")}
                    disabled={progress > 0}
                    title={"Google Login"}
                  >
                    <Image
                      src={Google}
                      alt="All events"
                      width="18"
                      height="18"
                    />{" "}
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    className="social-btn"
                    onClick={() => signIn("facebook")}
                    disabled={progress > 0}
                    title={"Facebook Login"}
                  >
                    <Image
                      src={facebook}
                      alt="All events"
                      width="18"
                      height="18"
                    />{" "}
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
              </Form.Group>

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

              <Form.Group className="mb-3" controlId="formForgetPassword">
                <Link
                  className="form-text text-black fw-semibold text-decoration-none"
                  role="button"
                  href="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </Form.Group>

              <div className="buttons">
                <Button
                  type="submit"
                  className="w-100 rounded-1 btn-gl-primary-linear-gradient"
                  onClick={handleSubmit(handleLogin)}
                  disabled={progress > 0}
                >
                  Log in
                </Button>
              </div>

              <hr />

              <TermsAndPolicy />

              <div className="mt-3 form-text text-center">
                <Link
                  role="button"
                  className="text-black fw-semibold text-decoration-none"
                  href="/signup"
                >
                  Not on GiftLips yet? Sign up
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </main>
    </>
  );
};

export default Login;
