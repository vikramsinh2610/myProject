import { Fragment } from "react";
import { useRouter } from "next/router";

const DashboardHero = () => {
  const router = useRouter();

  return (
    <Fragment>
      <div className="px-4 py-5 text-center bg-light">
        <h1 className="display-7">My Cards</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Personalize your greeting cards using QR codes and add video
            messages from friends and families for an extra special surprise!
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 gap-3"
              onClick={() => {
                router.push("/");
              }}
            >
              Create New Card
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardHero;
