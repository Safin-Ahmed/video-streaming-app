import Navbar from "../Navbar";
import Footer from "../Footer";
import { ReactElement } from "react";

interface ILayout {
  children: ReactElement;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
