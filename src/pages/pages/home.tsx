import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import { Link, Redirect, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import {
  Lecture,
  LectureTime as LectureTimeData,
  Weekday,
} from "../../types/lecture";
import { GRAY_5, GRAY_7, GRAY_8, GRAY_9, RED_7 } from "../../utils/color";
import { parseTime, WEEKDAYS } from "../../utils/time";
import { AnchorButton } from "../../components/LinkButton";
import Main from "../../components/Main";
import { load, State } from "../../utils/state";

const TimetableContainer = styled.div`
  width: 100%;
  display: flex;
  background: ${GRAY_8};
  border: 1px solid ${GRAY_7};
`;

const VERTICAL_SEPARATOR_WIDTH = 1;
const Column = styled.div`
  flex: 1;
  &:not(:first-child) {
    border-left: ${VERTICAL_SEPARATOR_WIDTH}px solid ${GRAY_7};
  }
`;
const ColumnHeader = styled.div`
  padding: 5px 0;
  text-align: center;
  color: ${GRAY_5};
`;
const ColumnContent = styled.div`
  min-height: 600px;
  height: 90vh;
  position: relative;
`;

interface CellProps {
  highlighted: boolean;
  begin: number;
  end: number;
  min: number;
  max: number;
}
const Cell = styled.div<CellProps>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid ${GRAY_7};
  margin: ${-VERTICAL_SEPARATOR_WIDTH}px;
  padding: 8px 8px 0 8px;
  background-color: ${GRAY_9};
  overflow: hidden;
  position: absolute;
  left: 0px;
  right: 0px;
  top: ${({ begin, min, max }) =>
    `calc(100% * (${begin - min} / ${max - min}))`};
  height: ${({ begin, end, min, max }) =>
    `calc(100% * (${end - begin} / ${max - min}))`};
  z-index: 1;
`;

interface TimeIndicatorProps {
  current: number;
  min: number;
  max: number;
}
const TimeIndicator = styled.div<TimeIndicatorProps>`
  display: ${({ current, min, max }) =>
    current >= min && current <= max ? "block" : "none"};
  background-color: ${RED_7};
  position: absolute;
  left: -10px;
  right: -10px;
  top: ${({ current, min, max }) =>
    `calc(100% * (${current - min} / ${max - min}))`};
  height: 1px;
`;

const LectureTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
`;

const LinkContainer = styled.ul`
  flex: 1;
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
`;

const LinkItem = styled.li`
  &:not(:first-child) {
    margin-top: 4px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const PageTitle = styled.h2`
  flex: 1;
`;

const EditButton = styled(Link)`
  text-decoration: none;
`;

export const _Home = ({
  state,
  title,
  now,
}: {
  state: State;
  title: string;
  now: Date;
}): React.ReactElement => {
  const { url } = useRouteMatch();
  const times: LectureTime[] = state.lectures.flatMap((lecture) =>
    lecture.times.map((time) => ({ ...time, lecture }))
  );
  const weekdays = ((times: LectureTime[]) => {
    const list = times.map((t) => WEEKDAYS.indexOf(t.weekday));
    if (list.length === 0) {
      return WEEKDAYS;
    }
    const min = Math.min(...list);
    const max = Math.max(...list);
    return WEEKDAYS.slice(min, max + 1);
  })(times);
  const minTime = Math.min(...times.map((t) => parseTime(t.beginTime)));
  const maxTime = Math.max(...times.map((t) => parseTime(t.endTime)));
  const currentWeekday: Weekday = (() => {
    switch (now.getDay()) {
      case 0:
        return "SUN";
      case 1:
        return "MON";
      case 2:
        return "TUE";
      case 3:
        return "WED";
      case 4:
        return "THU";
      case 5:
        return "FRI";
      case 6:
        return "SAT";
      default:
        throw new Error("Unexpected weekday");
    }
  })();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const beginTimeThreshold = -15;
  const endTimeThreshold = -1;

  return (
    <Main>
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <section>
        <HeaderWrapper>
          <PageTitle>{title}</PageTitle>
          <EditButton to={`${url}/edit`} title="Edit">
            ✏️
          </EditButton>
        </HeaderWrapper>
        <TimetableContainer>
          {weekdays.map((w) => (
            <Column key={w}>
              <ColumnHeader>{w}</ColumnHeader>
              <ColumnContent>
                <TimeIndicator
                  current={currentTime}
                  min={minTime}
                  max={maxTime}
                />
                {times
                  .filter((t) => t.weekday === w)
                  .map((t) => {
                    const beginTime = parseTime(t.beginTime);
                    const endTime = parseTime(t.endTime);
                    const highlighted =
                      currentWeekday === w &&
                      currentTime >= beginTime + beginTimeThreshold &&
                      currentTime <= endTime + endTimeThreshold;
                    return (
                      <Cell
                        key={t.lecture.id}
                        highlighted={highlighted}
                        begin={beginTime}
                        end={endTime}
                        min={minTime}
                        max={maxTime}
                      >
                        <LectureTitle>{t.lecture.title}</LectureTitle>
                        <LinkContainer>
                          {t.lecture.links?.map(({ id, label, url }) => (
                            <LinkItem key={id}>
                              <AnchorButton
                                highlighted={highlighted}
                                href={url}
                                rel="noopener noreferrer"
                              >
                                {label}
                              </AnchorButton>
                            </LinkItem>
                          ))}
                        </LinkContainer>
                      </Cell>
                    );
                  })}
              </ColumnContent>
            </Column>
          ))}
        </TimetableContainer>
      </section>
    </Main>
  );
};

const Home = (): React.ReactElement => {
  const { id } = useParams<RouteParams>();
  const { url } = useRouteMatch();
  const state = useMemo(() => load(id), [id]);

  const [, setCounter] = useState(0);
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    function tick() {
      setCounter((prev) => prev + 1);
      timerId = setTimeout(tick, (60 - (new Date()).getSeconds()) * 1000);
    }
    tick();
    return () => clearTimeout(timerId);
  }, []);

  if (state == null) {
    return <Redirect to={`${url}/edit`} />;
  }
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <_Home state={state} title={id} now={new Date()} />
  );
};

interface RouteParams {
  id: string;
}

interface LectureTime extends LectureTimeData {
  lecture: Lecture;
}

export default Home;
