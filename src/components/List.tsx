import styled from "styled-components";
import { color, space, ColorProps, SpaceProps } from "styled-system";

const List = styled.ul<ColorProps | SpaceProps>`
  ${color};
  ${space};

  padding: 0;
  margin: 0;
  list-style: none;
`;

export default List;
