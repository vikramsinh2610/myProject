import { useModalContext, useUserContext } from "../../context/contextLib";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const LoginToContinueButton = ({
  saveData,
  variant,
  onClick,
  children,
  onClickNotLoggedIn = null,
}: any) => {
  const session = useSession();
  const { setSavedCardId } = useUserContext();
  const { setShowAuthModal } = useModalContext();

  const defaultOnClickNotLoggedIn = () => {
    setSavedCardId(saveData);
    setTimeout(() => {
      setShowAuthModal(true);
    });
  };

  useEffect(() => {
    return () => {
      if (!onClickNotLoggedIn) {
        onClickNotLoggedIn = defaultOnClickNotLoggedIn;
      }
    };
  }, [onClickNotLoggedIn]);

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => {
        if (session.status !== "authenticated") {
          onClickNotLoggedIn();
        } else {
          onClick();
        }
      }}
    >
      {children}
    </Button>
  );
};

export default LoginToContinueButton;
