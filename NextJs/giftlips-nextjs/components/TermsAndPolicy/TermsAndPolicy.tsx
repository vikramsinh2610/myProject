import Link from "next/link";

const TermsAndPolicy = () => {
  return (
    <>
      <div className="d-inline-block form-text text-center privacy-policy">
        By continuing, you agree to GiftLips{" "}
        <div className="d-inline-block">
          <Link
            href="#terms-of-service"
            className="text-black fw-semibold text-decoration-none"
          >
            Terms of Service
          </Link>
        </div>{" "}
        and acknowledge you've read our{" "}
        <div className="d-inline-block">
          <Link
            href="#privacy-policy"
            className="text-black fw-semibold text-decoration-none"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </>
  );
};

export default TermsAndPolicy;
