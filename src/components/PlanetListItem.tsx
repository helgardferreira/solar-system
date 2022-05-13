import { FC } from "react";
import capitalize from "../helpers/capitalize";

interface IProps {
  planetName: string;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  handleMouseEnter: React.MouseEventHandler<HTMLLIElement>;
  handleMouseLeave: React.MouseEventHandler<HTMLLIElement>;
}

const PlanetListItem: FC<IProps> = (props) => {
  const {
    planetName,
    handleClick: onClick,
    handleMouseEnter,
    handleMouseLeave,
  } = props;
  return (
    <li
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {capitalize(planetName)}
    </li>
  );
};

export default PlanetListItem;
