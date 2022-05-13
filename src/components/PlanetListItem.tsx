import { FC } from "react";
import styled from "styled-components";
import capitalize from "../helpers/capitalize";

interface IProps {
  planetName: string;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  handleMouseEnter: React.MouseEventHandler<HTMLLIElement>;
  handleMouseLeave: React.MouseEventHandler<HTMLLIElement>;
  isActive: boolean;
}

const ListItem = styled.li<{ $isActive: boolean }>`
  color: ${(p) => (p.$isActive ? "#30e3ca" : "#ffffff")};
`;

const PlanetListItem: FC<IProps> = (props) => {
  const {
    planetName,
    handleClick: onClick,
    handleMouseEnter,
    handleMouseLeave,
    isActive,
  } = props;
  return (
    <ListItem
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      $isActive={isActive}
    >
      {capitalize(planetName)}
    </ListItem>
  );
};

export default PlanetListItem;
