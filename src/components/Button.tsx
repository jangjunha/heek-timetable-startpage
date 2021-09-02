import styled from "styled-components";

import { BLUE_7, GRAY_9 } from "../utils/color";

export interface ButtonProps {
  highlighted?: boolean;
}

const Button = styled.button.attrs((props) => ({
  type: "button",
}))<ButtonProps>`
  padding: 8px;
  border: 1px solid ${BLUE_7};
  border-radius: 2px;
  background-color: ${({ highlighted }) => (highlighted ? BLUE_7 : GRAY_9)};
  color: ${({ highlighted }) => (highlighted ? GRAY_9 : BLUE_7)};
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 16px;

  ${({ highlighted }) =>
    highlighted &&
    `
      &:hover {
        color: white;
      }
      `};

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export default Button;
