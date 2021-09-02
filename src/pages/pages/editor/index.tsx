import { produce } from "immer";
import React, { useReducer, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ActionType } from "typesafe-actions";
import * as yup from "yup";
import { SchemaOf, ValidationError } from "yup";

import Main from "../../../components/Main";
import { load, save, remove, State } from "../../../utils/state";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import styled from "styled-components";
import { GRAPE_9, GRAY_7, LIME_9 } from "../../../utils/color";
import { WEEKDAYS } from "../../../utils/time";
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
import {
  Lecture,
  LectureLink,
  LectureTime,
  Weekday,
} from "../../../types/lecture";

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

const ErrorMessage = styled.div`
  color: red;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const createState = (): State => ({
  version: "1",
  lectures: [createLecture()],
});

const linkSchema: SchemaOf<LectureLink> = yup
  .object()
  .shape({
    id: yup.string().required(),
    label: yup.string(),
    url: yup.string().required("URL is required"),
  })
  .defined();
const timeSchema: SchemaOf<LectureTime> = yup
  .object()
  .shape({
    weekday: yup.mixed<Weekday>().oneOf(WEEKDAYS).defined(),
    beginTime: yup
      .string()
      .defined()
      .matches(
        /^\d{2}:\d{2}$/,
        "Invalid time. Check all of am/pm, hours, minutes typed"
      ),
    endTime: yup
      .string()
      .defined()
      .matches(
        /^\d{2}:\d{2}$/,
        "Invalid time. Check all of am/pm, hours, minutes typed"
      ),
  })
  .defined();
const lectureSchema: SchemaOf<Lecture> = yup
  .object()
  .shape({
    id: yup.string().required(),
    title: yup.string().required("Title is required"),
    links: yup.array().of(linkSchema),
    times: yup
      .array()
      .min(1, "Lecture must have at least 1 time slot")
      .of(timeSchema),
  })
  .defined();
const schema = yup.object().shape({
  title: yup
    .string()
    .matches(/^[^/\\]*$/, "Slashes('/', '\\') are not allowed")
    .required("Title is required"),
  lectures: yup.array().of(lectureSchema).defined(),
});

const flattenError = (
  errors: ValidationError[]
): { path?: string; message: string }[] => {
  return errors.flatMap((err) => {
    return [
      ...err.errors.map((e) => ({ path: err.path, message: e })),
      ...flattenError(err.inner),
    ];
  });
};

const validate = (form: {
  title: string;
  lectures: Lecture[];
}): { path?: string; message: string }[] => {
  try {
    schema.validateSync(form, { abortEarly: false });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return flattenError([err]);
    } else {
      throw err;
    }
  }
  return [];
};

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
  const errors = validate({
    title,
    lectures: state.lectures,
  });
  const pageTitleErrors = errors.filter((e) => e.path === "title");

  const handleClickAddLecture = () => dispatch(actions.add());
  const handleClickSave = () => {
    remove(id);
    save(title, state);
    history.push(`/p/${title}`);
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
        {pageTitleErrors.map((e) => (
          <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
        ))}
      </section>
      <section>
        <Label htmlFor="lectures">Lectures</Label>
        <div id="lectures">
          {state.lectures.map((lecture, li) => {
            const inputId = `lecture-title:${lecture.id}`;
            const titleErrors = errors.filter(
              (e) => e.path === `lectures[${li}].title`
            );
            const linksErrors = errors.filter(
              (e) => e.path === `lectures[${li}].links`
            );
            const timesErrors = errors.filter(
              (e) => e.path === `lectures[${li}].times`
            );
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
                  {titleErrors.map((e) => (
                    <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
                  ))}
                </section>
                <section>
                  <h4>Links</h4>
                  <div>
                    {lecture.links?.map((link, ki) => {
                      const labelId = `links:${link.id}-label`;
                      const urlId = `links:${link.id}-url`;
                      const labelErrors = errors.filter(
                        (e) => e.path === `lectures[${li}].links[${ki}].label`
                      );
                      const urlErrors = errors.filter(
                        (e) => e.path === `lectures[${li}].links[${ki}].url`
                      );
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
                          {labelErrors.map((e) => (
                            <ErrorMessage key={e.message}>
                              {e.message}
                            </ErrorMessage>
                          ))}
                          <Label htmlFor={urlId}>URL</Label>
                          <Input
                            type="url"
                            id={urlId}
                            value={link.url}
                            onChange={handleChangeUrl}
                          />
                          {urlErrors.map((e) => (
                            <ErrorMessage key={e.message}>
                              {e.message}
                            </ErrorMessage>
                          ))}
                          <RightFloatButton onClick={handleClickDeleteLink}>
                            DELETE LINK
                          </RightFloatButton>
                        </Wrapper>
                      );
                    })}
                    {linksErrors.map((e) => (
                      <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
                    ))}
                  </div>
                  <Button onClick={handleClickAddLink}>ADD LINK</Button>
                </section>
                <section>
                  <h4>Times</h4>
                  <div>
                    {lecture.times?.map((time, ti) => {
                      const beginId = `times:${time.id}-begin`;
                      const endId = `times:${time.id}-end`;
                      const weekdayErrors = errors.filter(
                        (e) => e.path === `lectures[${li}].times[${ti}].weekday`
                      );
                      const beginTimeErrors = errors.filter(
                        (e) =>
                          e.path === `lectures[${li}].times[${ti}].beginTime`
                      );
                      const endTimeErrors = errors.filter(
                        (e) => e.path === `lectures[${li}].times[${ti}].endTime`
                      );
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
                          style={{ borderColor: GRAPE_9 }}
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
                          {weekdayErrors.map((e) => (
                            <ErrorMessage key={e.message}>
                              {e.message}
                            </ErrorMessage>
                          ))}
                          <Label htmlFor={beginId}>Begin time</Label>
                          <Input
                            type="time"
                            id={beginId}
                            value={time.beginTime}
                            onChange={handleChangeBeginTime}
                          />
                          {beginTimeErrors.map((e) => (
                            <ErrorMessage key={e.message}>
                              {e.message}
                            </ErrorMessage>
                          ))}
                          <Label htmlFor={endId}>End time</Label>
                          <Input
                            type="time"
                            id={endId}
                            value={time.endTime}
                            onChange={handleChangeEndTime}
                          />
                          {endTimeErrors.map((e) => (
                            <ErrorMessage key={e.message}>
                              {e.message}
                            </ErrorMessage>
                          ))}
                          <RightFloatButton
                            onClick={handleClickDeleteTime}
                            disabled={lecture.times.length <= 1}
                          >
                            DELETE TIME
                          </RightFloatButton>
                        </Wrapper>
                      );
                    })}
                    {timesErrors.map((e) => (
                      <ErrorMessage key={e.message}>{e.message}</ErrorMessage>
                    ))}
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
            disabled={errors.length > 0}
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
