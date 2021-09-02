import styled from "styled-components";
import { GRAY_7, GRAY_8 } from "../utils/color";

const Input = styled.input`
  border: 1px solid ${GRAY_7};
  border-radius: 2px;
  background-color: ${GRAY_8};
  color: inherit;
  padding: 8px;
  font-size: 1.2rem;
`;

export default Input;
