import React from "react";
import { EXAMPLE_STATE } from "../utils/state";
import { _Home } from "./pages/home";

const ExampleHome = (): React.ReactElement => (
  // eslint-disable-next-line react/jsx-pascal-case
  <_Home
    state={EXAMPLE_STATE}
    title="Timetable"
    now={new Date(2021, 9 - 1, 2, 15, 0)}
  />
);

export default ExampleHome;
