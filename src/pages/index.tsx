import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";

import LinkButton from "../components/LinkButton";
import Main from "../components/Main";
import { getPageKeys } from "../utils/state";

const PageList = styled.ul`
  padding: 0;
  list-style: none;
`;

const PageItem = styled.li``;

const Index = (): React.ReactElement => {
  const keys = useMemo(getPageKeys, []);
  return (
    <Main>
      <Helmet>
        <title>Heek Timetable Startpage</title>
      </Helmet>

      <h1>Heek Timetable Startpage</h1>

      <section>
        <p>Lorem ipsum ...</p>
        <Link to="/example">Show Example</Link>
      </section>

      <section>
        <h3>Pages</h3>
        <PageList>
          {keys.map((k) => (
            <PageItem>
              <LinkButton to={`/p/${k}`}>{k}</LinkButton>
            </PageItem>
          ))}
        </PageList>
        <p>Startpages are stored in your browser.</p>
      </section>
    </Main>
  );
};

export default Index;
