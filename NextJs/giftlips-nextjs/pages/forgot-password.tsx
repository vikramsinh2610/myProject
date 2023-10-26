import { ErrorMessage } from "@hookform/error-message";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TermsAndPolicy from "../components/TermsAndPolicy/TermsAndPolicy";
import { emailAddressPattern } from "../helpers/common";
import http from "../services/http.service";
import logo from "../assets/img/logos/app-logo.svg";
import LoadingBar from "react-top-loading-bar";

const ForgotPassword = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(30);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setProgress(30);
      const response = await http.post(`/auth/reset-password`, data);

      if (response?.data) {
        router.push("/login");
      }
    } catch (e: any) {
      if (!e.response) {
        setError("password", {
          type: "manual",
          message: "Email not found.",
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
        <title>Forgot Password - GiftLips</title>
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

            <h4 className="mb-4 text-center">Forgot Password</h4>

            <Form>
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

              <div className="buttons">
                <Button
                  type="submit"
                  className="w-100"
                  onClick={handleSubmit(onSubmit)}
                  disabled={progress > 0}
                >
                  Request new password
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

export default ForgotPassword;
