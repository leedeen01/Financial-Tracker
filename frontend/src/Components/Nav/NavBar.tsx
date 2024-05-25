import { FaAlignJustify } from "react-icons/fa";

interface Props {
  onToggle: () => void;
}

const NavBar = ({ onToggle }: Props) => {
  return (
    <>
      <div>
        <FaAlignJustify className="hamburger" onClick={onToggle} />
        <span className="appName">Trackspence</span>
      </div>
    </>
  );
};

export default NavBar;
