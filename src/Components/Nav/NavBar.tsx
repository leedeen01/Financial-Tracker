import { FaAlignJustify } from "react-icons/fa";

interface Props {
    onToggle: () => void;
}

const NavBar = ({onToggle}: Props) => {
    return (<>
        <FaAlignJustify className="hamburger" onClick={onToggle} />
        <div className="appName">Trackspence</div>
        </>);
}

export default NavBar;