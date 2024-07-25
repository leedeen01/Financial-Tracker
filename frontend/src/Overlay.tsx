import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const Overlay = () => {

  return (
    <>
        <div className="overlay">
            <div className="overlay-box flex-column gap-3">
                <div className="overlay-text">Create a <Nav.Link as={Link} to="/budgets"><b style={{textDecoration: "underline"}}>category</b></Nav.Link> to start logging your transactions!</div>
                <i className="fa fa-cube" style={{fontSize: "20px"}} />
            </div>
        </div>
    </>
  );
};

export default Overlay;