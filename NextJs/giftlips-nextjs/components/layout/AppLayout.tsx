import Footer from "./Footer";
import AppNavbar from "./AppNavbar";

const AppLayout = ({ children }: any) => {
  return (
    <>
      <AppNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;
