import React, { useReducer, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { produce } from "immer";

import Main from "../../../components/Main";
import { load, save, remove, State } from "../../../utils/state";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import styled from "styled-components";
import { GRAY_7, LIME_9, ORANGE_9 } from "../../../utils/color";
import { WEEKDAYS } from "../../../utils/time";
import { ActionType } from "typesafe-actions";
import {
  reducer,
  actions,
  lectureActions,
  timesActions,
  timeActions,
  createLecture,
  linksActions,
  linkActions,
} from "./reducer";
import { Weekday } from "../../../types/lecture";

const Label = styled.label`
  display: block;
  margin: 8px 0;
  font-weight: 600;
`;

const Wrapper = styled.div`
  position: relative;
  border-radius: 2px;
  border: 1px solid ${GRAY_7};
  padding: 4px 16px;
`;

const RightFloatButton = styled(Button)`
  position: absolute;
  right: 4px;
  top: 4px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const createState = (): State => ({
  version: "1",
  lectures: [createLecture()],
});

const Editor = (): React.ReactElement => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const [title, setTitle] = useState(id);
  const [state, dispatch] = useReducer(
    (state: State, action: ActionType<typeof actions>) =>
      produce(state, (draft) => {
        draft.lectures = reducer(state.lectures, action);
      }),
    [],
    () => load(id) ?? createState()
  );
  const valid = !title.includes("/");

  const handleClickAddLecture = () => dispatch(actions.add());
  const handleClickSave = () => {
    remove(id);
    save(title, state);
  };
  const handleClickDelete = () => {
    if (window.confirm("Really delete?")) {
      remove(id);
      history.replace("/");
    }
  };

  return (
    <Main>
      <section>
        <Label htmlFor="page-title">Page Title</Label>
        <Input
          type="text"
          id="page-title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
      </section>
      <section>
        <Label htmlFor="lectures">Lectures</Label>
        <div id="lectures">
          {state.lectures.map((lecture) => {
            const inputId = `lecture-title:${lecture.id}`;
            const dispatchUpdateLecture = (
              action: ActionType<typeof lectureActions>
            ) => dispatch(actions.update([lecture.id, action]));

            const handleChangeTitle = (
              e: React.ChangeEvent<HTMLInputElement>
            ) =>
              dispatchUpdateLecture(
                lectureActions.updateTitle(e.currentTarget.value)
              );
            const handleClickAddLink = () =>
              dispatchUpdateLecture(
                lectureActions.updateLinks(linksActions.add())
              );
            const handleClickAddTime = () =>
              dispatchUpdateLecture(
                lectureActions.updateTimes(timesActions.add())
              );
            const handleClickDeleteLecture = () =>
              dispatch(actions.remove(lecture.id));

            return (
              <Wrapper key={lecture.id}>
                <section>
                  <Label htmlFor={inputId}>Title</Label>
                  <Input
                    id={inputId}
                    value={lecture.title}
                    onChange={handleChangeTitle}
                  />
                </section>
                <section>
                  <h4>Links</h4>
                  <div>
                    {lecture.links?.map((link) => {
                      const labelId = `links:${link.id}-label`;
                      const urlId = `links:${link.id}-url`;
                      const dispatchUpdateLink = (
                        action: ActionType<typeof linkActions>
                      ) =>
                        dispatchUpdateLecture(
                          lectureActions.updateLinks(
                            linksActions.update([link.id, action])
                          )
                        );

                      const handleChangeLabel = (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        dispatchUpdateLink(
                          linkActions.updateLabel(e.currentTarget.value)
                        );
                      const handleChangeUrl = (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        dispatchUpdateLink(
                          linkActions.updateUrl(e.currentTarget.value)
                        );
                      const handleClickDeleteLink = () =>
                        dispatchUpdateLecture(
                          lectureActions.updateLinks(
                            linksActions.remove(link.id)
                          )
                        );

                      return (
                        <Wrapper
                          key={link.id}
                          aria-label="link item"
                          style={{ borderColor: LIME_9 }}
                        >
                          <Label htmlFor={labelId}>Label</Label>
                          <Input
                            type="text"
                            id={labelId}
                            value={link.label}
                            onChange={handleChangeLabel}
                          />
                          <Label htmlFor={urlId}>URL</Label>
                          <Input
                            type="url"
                            id={urlId}
                            value={link.url}
                            onChange={handleChangeUrl}
                          />
                          <RightFloatButton onClick={handleClickDeleteLink}>
                            DELETE LINK
                          </RightFloatButton>
                        </Wrapper>
                      );
                    })}
                  </div>
                  <Button onClick={handleClickAddLink}>ADD LINK</Button>
                </section>
                <section>
                  <h4>Times</h4>
                  <div>
                    {lecture.times.map((time) => {
                      const beginId = `times:${time.id}-begin`;
                      const endId = `times:${time.id}-end`;
                      const dispatchUpdateTime = (
                        action: ActionType<typeof timeActions>
                      ) =>
                        dispatchUpdateLecture(
                          lectureActions.updateTimes(
                            timesActions.update([time.id, action])
                          )
                        );

                      const handleChangeWeekday = (
                        e: React.ChangeEvent<HTMLSelectElement>
                      ) =>
                        dispatchUpdateTime(
                          timeActions.updateWeekday(
                            e.currentTarget.value as Weekday
                          )
                        );
                      const handleChangeBeginTime = (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        dispatchUpdateTime(
                          timeActions.updateBeginTime(e.currentTarget.value)
                        );
                      const handleChangeEndTime = (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        dispatchUpdateTime(
                          timeActions.updateEndTime(e.currentTarget.value)
                        );
                      const handleClickDeleteTime = () =>
                        dispatchUpdateLecture(
                          lectureActions.updateTimes(
                            timesActions.remove(time.id)
                          )
                        );

                      return (
                        <Wrapper
                          key={time.id}
                          aria-label="time slot"
                          style={{ borderColor: ORANGE_9 }}
                        >
                          <select
                            value={time.weekday}
                            onChange={handleChangeWeekday}
                            aria-label="weekday"
                          >
                            {WEEKDAYS.map((w) => (
                              <option key={w} value={w}>
                                {w}
                              </option>
                            ))}
                          </select>
                          <Label htmlFor={beginId}>Begin time</Label>
                          <Input
                            type="time"
                            id={beginId}
                            value={time.beginTime}
                            onChange={handleChangeBeginTime}
                          />
                          <Label htmlFor={endId}>End time</Label>
                          <Input
                            type="time"
                            id={endId}
                            value={time.endTime}
                            onChange={handleChangeEndTime}
                          />
                          <RightFloatButton onClick={handleClickDeleteTime}>
                            DELETE TIME
                          </RightFloatButton>
                        </Wrapper>
                      );
                    })}
                  </div>
                  <Button onClick={handleClickAddTime}>ADD TIME</Button>
                </section>
                <RightFloatButton onClick={handleClickDeleteLecture}>
                  DELETE LECTURE
                </RightFloatButton>
              </Wrapper>
            );
          })}
        </div>
        <Button onClick={handleClickAddLecture}>ADD LECTURE</Button>
      </section>
      <section>
        <Actions>
          <Button
            highlighted={true}
            disabled={!valid}
            onClick={handleClickSave}
          >
            SAVE
          </Button>
          <Button onClick={handleClickDelete}>DELETE PAGE</Button>
        </Actions>
      </section>
    </Main>
  );
};

interface RouteParams {
  id: string;
}

// interface LectureTime extends LectureTimeData {
//   lecture: Lecture;
// }

export default Editor;
