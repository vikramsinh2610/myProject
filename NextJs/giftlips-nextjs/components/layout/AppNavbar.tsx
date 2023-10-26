import Image from "next/image";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// import LocaleSwitcher from "./LocaleSwitcher";
import { useModalContext } from "../../context/contextLib";
import userImage from "../../assets/img/public/user-dummy-image.png";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import http from "../../services/http.service";

const AppNavbar = () => {
  const router = useRouter();
  const session: any = useSession();
  const { setShowAuthModal }: any = useModalContext();

  const [userData, setUserData] = useState<{
    email?: string;
    firstName?: number;
    lastName?: number;
    profilePhoto?: string;
  }>({});

  useEffect(() => {
    if (session.status !== "unauthenticated")
      http
        .get("auth/profile")
        .then((res) => setUserData(res.data))
        .catch((e) => console.error(e));
  }, [session]);

  const whiteList = [
    "/login",
    "/signup",
    "/forgot-password",
    "/password-reset",
  ];

  const ClickLogout = () => {
    localStorage.clear();
    signOut();
    router.push("/");
  };

  const ClickMycards = () => {
    localStorage.removeItem("Inviteduser");
  };


  const GuestNav = () => {
    if (whiteList.includes(router.pathname)) {
      return null;
    }

    return (
      <Nav className="mx-auto mx-md-0">
        <NavDropdown className="d-md-none" title="Menu">
          <NavDropdown.Item href="/video-greeting-card-for-your-business">
            Business Solutions
          </NavDropdown.Item>
          <NavDropdown.Item href="/blog">Blog</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={() => setShowAuthModal(true)}>
            Login
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Button
              className="btn-gl-primary btn-gl-primary-linear-gradient"
              onClick={() => setShowAuthModal(true)}
            >
              Create Video Gift
            </Button>
          </NavDropdown.Item>
        </NavDropdown>
        <Nav.Link
          className="d-none d-md-block"
          href="/video-greeting-card-for-your-business"
        >
          Business Solutions
        </Nav.Link>
        <Nav.Link className="d-none d-md-block" href="/blog">
          Blog
        </Nav.Link>
        <Nav.Link
          className="d-none d-md-block me-2"
          onClick={() => setShowAuthModal(true)}
        >
          Login
        </Nav.Link>
        <Button
          className="d-none d-md-block btn-gl-primary btn-gl-primary-linear-gradient"
          onClick={() => {
            setShowAuthModal(true);
          }}
        >
          Create Video Gift
        </Button>
      </Nav>
    );
  };

  const AuthNav = () => {
    if (whiteList.includes(router.pathname)) {
      return null;
    }

    return (
      <Nav>
        <NavDropdown className="d-md-none" title="Menu">
          <NavDropdown.Item href="/video-greeting-card-for-your-business">
            Business Solutions
          </NavDropdown.Item>
          <NavDropdown.Item href="/blog">Blog</NavDropdown.Item>
        </NavDropdown>
        <Nav.Link
          className="d-none d-md-block"
          href="/video-greeting-card-for-your-business"
        >
          Business Solutions
        </Nav.Link>
        <Nav.Link className="d-none d-md-block" href="/blog">
          Blog
        </Nav.Link>
        <NavDropdown
          className="userDropdown"
          title={
            <div className="userBox">
              <span className="userBox__image">
                <Image
                  src={userData.profilePhoto || userImage}
                  alt=""
                  role="button"
                  height={"100"}
                  width={"100"}
                  className="img-fluid"
                />
              </span>
            </div>
          }
        >
          <NavDropdown.Item href="/profile">
            <i className="bi bi-person-circle"></i>Profile
          </NavDropdown.Item>
          <NavDropdown.Item href="/dashboard" onClick={ClickMycards}>
            <i className="bi bi-cart-dash-fill"></i>
            My Cards
          </NavDropdown.Item>
          <NavDropdown.Item onClick={ClickLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Sign out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    );
  };

  return (
    <>
      <Navbar
        className="border-bottom py-3"
        expand="lg"
        variant="light"
        bg="white"
      >
        <Container
          className={`${session.status !== "authenticated" && "mb-2 mb-md-0"}`}
        >
          <Nav
            className={`${
              session.status !== "authenticated" && "mx-auto"
            } mx-md-0 my-2 my-lg-0`}
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Navbar.Brand href="/">
              <Image
                src="/app-logo.svg"
                alt="GiftLips"
                height={40}
                width={180}
              />
            </Navbar.Brand>
          </Nav>

          {/* <LocaleSwitcher /> */}

          {session.status === "authenticated" ? <AuthNav /> : <GuestNav />}
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;
