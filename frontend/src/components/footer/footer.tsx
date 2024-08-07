import "../footer/footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer-container d-flex flex-wrap justify-content-between align-items-center">
        <div className="footer-name column col-sm-6 col-12">
          Made with{" "}
          <i className="fa fa-heart" style={{ color: "var(--light-red)" }}></i>{" "}
          & milo pengs.
        </div>
        <div className="footer-copyright column col-sm-6 col-12">
          <span style={{ color: "var(--dark-gold)", fontWeight: "normal" }}>
            © 2024 Lee De En & Fabian Heng.
          </span>
          <br />
          All Rights Reserved.
        </div>
      </div>
    </>
  );
};

export default Footer;
