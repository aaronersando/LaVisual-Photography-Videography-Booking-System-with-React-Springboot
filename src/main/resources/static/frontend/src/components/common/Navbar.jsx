import "./common.css";

function Navbar(){
    return(
        <><header className="navbar">
        <div className="container navbar-inner">
          <div className="logo">
            La<span>Visual</span>
          </div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Portfolio</a>
            <a href="#">Packages</a>
            <a href="#">Booking</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
          <div className="auth-buttons">
            <a href="#" className="login">Log in</a>
            <a href="#" className="signup">Sign up</a>
          </div>
        </div>
      </header>
        </>
    )
}

export default Navbar;