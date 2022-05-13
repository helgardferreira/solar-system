import styled from "styled-components";
import {
  flexbox,
  layout,
  position,
  color,
  space,
  border,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  ColorProps,
  SpaceProps,
  BorderProps,
} from "styled-system";

const Box = styled.div<
  | FlexboxProps
  | LayoutProps
  | PositionProps
  | ColorProps
  | SpaceProps
  | BorderProps
>`
  ${border};
  ${flexbox};
  ${layout};
  ${position};
  ${color};
  ${space};
`;

export default Box;
