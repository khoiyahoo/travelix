import styled from "styled-components";

interface Props {
  $borderWidth?: number | string;
  $borderColor?: string;
}
export const Divider = styled.div<Props>`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-width: ${(props) => `${props.$borderWidth}px`} !important;
  border-style: solid;
  border-color: ${(props) => `var(${props.$borderColor})`} !important;
`;
