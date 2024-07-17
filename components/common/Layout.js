import Header from "components/common/Header";
import Footer from "components/common/Footer";

import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const { status } = useSession();
  const isLogged = status === "authenticated";

  return (
    <>
      <Header isLogged={isLogged} />
      <main className="flex-1 h-screen">
        <div className="lg:pt-[90px] mx-auto">
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Layout;
