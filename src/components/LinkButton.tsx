import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";
import { BLUE_7, GRAY_7, GRAY_8 } from "../utils/color";

interface ContainerProps {
  highlighted?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  border: 1px solid ${({ highlighted }) => (highlighted ? BLUE_7 : GRAY_7)};
  border-radius: 2px;
  background-color: ${({ highlighted }) => (highlighted ? BLUE_7 : GRAY_8)};

  > a {
    flex: 1;
    position: relative;
    color: inherit;
    text-decoration: none;
    padding: 8px calc(4px + 1em) 8px 4px;

    &:after {
      content: "〉";
      font-size: 12px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 4px;
    }
  }
`;

export type LinkButtonProps = LinkProps & ContainerProps;

const LinkButton = ({
  highlighted,
  children,
  ...linkProps
}: LinkButtonProps): React.ReactElement => {
  return (
    <Container highlighted={highlighted}>
      <Link {...linkProps}>{children}</Link>
    </Container>
  );
};

export default LinkButton;
