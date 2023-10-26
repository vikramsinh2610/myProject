import { ErrorMessage } from "@hookform/error-message";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import http from "../services/http.service";
import logo from "../assets/img/logos/app-logo.svg";
import TermsAndPolicy from "../components/TermsAndPolicy/TermsAndPolicy";
import Link from "next/link";
import { devLog, devLogError } from "../helpers/logger";

const PasswordReset = () => {
  const router = useRouter();
  const [ progress, setProgress ] = useState(30);

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (data.password !== data.password2) {
      setError("password", {
        type: "manual",
        message: "Password does not match.",
      });
      setValue("password", "");
      setValue("password2", "");
      return;
    }

    try {
      setProgress(30);
      const response = await http.post(
        `/auth/reset-password-confirm${window.location.search}`,
        data
      );
      devLog("test response", response);

      if (response?.data) {
        router.push("/login");
      }
    } catch (e: any) {
      devLogError("onSubmit error", e.response);
      if (!e.response) {
        setError("password", {
          type: "manual",
          message: "Password does not match.",
        });
      }
    } finally {
      setProgress(100);
    }
  };

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <>
      <Head>
        <title>Password Reset - GiftLips</title>
      </Head>

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

            <h4 className="mb-4 text-center">Password Reset</h4>

            <Form>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "This field is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`password`}
                  render={({ message }) => (
                    <div className="gl-error-message invalid-feedback">{message}</div>
                  )}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  {...register("password2", {
                    required: "This field is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`password2`}
                  render={({ message }) => (
                    <div className="gl-error-message invalid-feedback">{message}</div>
                  )}
                />
              </Form.Group>

              <div className="buttons">
                <Button
                  type="submit"
                  className="w-100"
                  onClick={handleSubmit(onSubmit)}
                  disabled={progress > 0}
                >
                  Reset Password
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

export default PasswordReset;
