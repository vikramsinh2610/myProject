import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import http from "../../services/http.service";
import { ErrorMessage } from "@hookform/error-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState,
    reset,
    formState: { errors },
  } = useForm();

  const { isSubmitting } = formState;

  const changePasswordHandle = (data: any) => {
    http
      .post("auth/password-change", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        newPassword2: data.newPassword2,
      })
      .then((data: any) => {
        if (data?.data?.success) {
          reset();
          showSuccessMessage();
        }
      })
      .catch((e) => {
        // setError("newPassword", { message: e.response?.data?.detail });
        showToastMessage(e.response?.data?.detail);
      });
  };

  const showToastMessage = (error: any) => {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showSuccessMessage = () => {
    toast.success("Password changed successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <Form>
      <h5 className="formTitle">Change Password</h5>
      <Form.Group className="mb-3" controlId="formPhoneoldPassword">
        <Form.Label>Old Password</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          {...register("oldPassword", {
            required: "This field is required",
          })}
        />
        {/* <ErrorMessage
          errors={errors}
          name={`oldPassword`}
          render={({ message }) => (
            <div className="gl-error-message invalid-feedback">{message}</div>
          )}
        /> */}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPhonenewPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          {...register("newPassword", {
            required: "This field is required",
          })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formnewPassword2">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          {...register("newPassword2", {
            required: "This field is required",
          })}
        />
        {/* <ErrorMessage
          errors={errors}
          name={`newPassword`}
          render={({ message }) => (
            <div className="gl-error-message invalid-feedback">{message}</div>
          )}
        /> */}
      </Form.Group>
      <div className="buttons">
        <Button
          type="button"
          className="w-100"
          disabled={isSubmitting}
          onClick={handleSubmit(changePasswordHandle)}
        >
          Change Password
        </Button>
      </div>
      <ToastContainer />
    </Form>
  );
};

export default ChangePassword;
