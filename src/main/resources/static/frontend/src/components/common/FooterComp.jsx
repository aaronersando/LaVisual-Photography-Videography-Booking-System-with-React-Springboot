import "./common.css";

function FooterComp(){
    return(
        <>
        <footer className="footer">
        <div className="container footer-content">
          <div className="footer-col branding-col">
            <h3>
            <span>La</span>Visual
            </h3>
            <p>
              Capturing moments that last a lifetime.
              <br />
              Premium photography and videography services for all your special
              occasions.
            </p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-x-twitter"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Portfolio</a></li>
              <li><a href="#">Packages</a></li>
              <li><a href="#">Book a Session</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Wedding Photography</a></li>
              <li><a href="#">Portrait Sessions</a></li>
              <li><a href="#">Pre-Photoshoot</a></li>
              <li><a href="#">Event Coverage</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <p><i className="fas fa-map-marker-alt"></i> San Jose, Paombong, Bulacan, Philippines</p>
            <p><i className="fas fa-phone"></i> +63 926-0515-815</p>
            <p><i className="fas fa-envelope"></i> lavisualmedia@gmail.com</p>
          </div>
        </div>

        <div className="footer-divider container"></div>

        <div className="footer-bottom container">
          <p>&copy; 2025 LaVisual. All rights reserved.</p>
        </div>
      </footer>
        </>
    )
}

export default FooterComp;