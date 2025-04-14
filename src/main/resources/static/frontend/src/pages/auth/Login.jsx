import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/FooterComp";
import LoginBox from "../../components/forms/Loginform";

function Login() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-20">
        <LoginBox />
      </main>
      <Footer />
    </>
  );
}

export default Login;