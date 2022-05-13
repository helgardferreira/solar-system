import styled from "styled-components";
import { color, space, ColorProps, SpaceProps } from "styled-system";

const List = styled.ul<ColorProps | SpaceProps>`
  ${color};
  ${space};

  padding: 0;
  margin: 0;
  list-style: none;

  li:first-child {
    margin-bottom: 1rem;
  }

  li {
    cursor: pointer;
  }

  li:not(:first-child):not(:last-child) {
    margin-bottom: 0.2rem;
  }
`;

export default List;
