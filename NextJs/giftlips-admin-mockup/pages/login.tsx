import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const session: any = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (res?.status === 401) {
      toast.error("Invalid email or password");
    }

    if (res?.status === 200) {
      router.push(`/`);
    }
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      localStorage.setItem("user", JSON.stringify(session.data));
      router.push("/");
    }
  }, [session, router]);

  return (
    <>
      <ToastContainer />

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <Link href="/">
            <Image
              className="mx-auto my-0 h-auto w-auto"
              src="/logo.webp"
              alt=""
              width={200}
              height={144}
              priority
            />
          </Link>

          <div className="card bg-base-100 shadow-xl">
            <div className="prose card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="input-bordered input w-64 md:w-96"
                    required
                  />
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="input-bordered input w-64 md:w-96"
                    required
                  />
                </div>
                <button className="btn-primary btn w-full">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
