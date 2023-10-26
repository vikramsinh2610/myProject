import { useState, useRef, useEffect } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { emailAddressPattern } from "../helpers/common";
import { ErrorMessage } from "@hookform/error-message";
import http from "../services/http.service";
import ChangePassword from "../components/PasswordChange/PasswordChange";
import AppLayout from "../components/layout/AppLayout";
import LoadingBar from "react-top-loading-bar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import userImage from "../assets/img/public/user-dummy-image.png";
import Image from "next/image";
import ProfileUploadDropzone from "../components/ProfileUpload/ProfileUploadDropzone";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { NextSeo } from "next-seo";

const Profile = () => {
  const session = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [userProfileUrl, setUserProfileUrl] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const [userData, setUserData] = useState<{
    email?: string;
    firstName?: number;
    lastName?: number;
    profilePhoto?: string;
    phone?: string;
  }>({});

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    hiddenFileInput?.current?.click();
  };

  if (session.status === "unauthenticated") {
    router.push("/");
  }

  const fetchData = () => {
    http
      .get("auth/profile")
      .then((res) => setUserData(res.data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState,
    reset,
    formState: { errors },
  } = useForm();

  const { isSubmitting } = formState;

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setValue("email", userData.email || "");
      setValue("firstName", userData.firstName || "");
      setValue("lastName", userData.lastName || "");
      setValue("phone", userData.phone || null);
    }
  }, [userData]);

  const saveChangesHandler = (data: any) => {
    setUserData(data);
    if (userProfileUrl) {
      http
        .post("auth/profile", {
          ...data,
          profilePhoto: userProfileUrl,
        })
        .then((data: any) => {
          if (data.success) reset();
          router.reload();
          // fetchData();
          toast.success("Profile saved");
        })
        .catch((e) => toast.error(e));
    } else {
      http
        .post("auth/profile", data)
        .then((data: any) => {
          fetchData();
          toast.success("Profile saved");
        })
        .catch((e) => toast.error(e));
    }
  };

  const handleChange = (event: any) => {
    let name = "phone";
    let value = event;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <AppLayout>
      <NextSeo noindex={true} />

      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="pt-1"
      />

      <div className="profileTemplate">
        <div className="container">
          <Form className="profileInfoForm">
            <h5 className="formTitle">Profile Info</h5>
            <div className="profileImageBox">
              <Image
                src={profileImage || userData.profilePhoto || userImage}
                alt=""
                role="button"
                height={"100"}
                width={"100"}
                className="img-fluid profileImageBox-img"
              />
              <ProfileUploadDropzone
                setUserProfileUrl={setUserProfileUrl}
                setProfileImage={setProfileImage}
              ></ProfileUploadDropzone>

              <input
                type="file"
                ref={hiddenFileInput}
                style={{ display: "none" }}
              ></input>

              <Button
                style={{ marginBottom: "50px" }}
                // onClick={() => handleUploadClick()}
                className="changeProfileBtn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                </svg>
              </Button>
            </div>
            <div className="profileInfoForm__field">
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  disabled
                  {...register("email", {
                    required: "This field is required",
                    pattern: emailAddressPattern,
                    value: userData.email || "",
                  })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <PhoneInput
                  placeholder="Enter phone number"
                  onChange={handleChange}
                  value={userData?.phone}
                  defaultCountry="US"
                  name="phoneInputWithCountrySelect"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formFirstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("firstName", {
                    required: "This field is required",
                    value: userData.firstName || "",
                  })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("lastName", {
                    value: userData.lastName || "",
                  })}
                />
              </Form.Group>
            </div>
            <div className="buttons">
              <Button
                type="button"
                className="w-100"
                disabled={isSubmitting}
                onClick={handleSubmit(saveChangesHandler)}
              >
                Save
              </Button>
            </div>
          </Form>
          <ChangePassword />
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
