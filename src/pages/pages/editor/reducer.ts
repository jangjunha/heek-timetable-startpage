import { produce } from "immer";
import { createAction, createReducer, ActionType } from "typesafe-actions";
import { v4 as uuidv4 } from "uuid";

import {
  Lecture,
  LectureLink,
  LectureTime,
  Weekday,
} from "../../../types/lecture";
import { INITIAL_STATE } from "../../../utils/state";

export const createLecture = (): Lecture => ({
  id: uuidv4(),
  title: "",
  times: [createTime()],
});

const createTime = (): LectureTime => ({
  id: uuidv4(),
  weekday: "MON",
  beginTime: "09:00",
  endTime: "10:00",
});

const createLink = (): LectureLink => ({
  id: uuidv4(),
  label: "",
  url: "",
});

export const actions = {
  add: createAction("home/actions/add")(),
  update: createAction("home/actions/update")<
    [string, ActionType<typeof lectureActions>]
  >(),
  remove: createAction("home/actions/remove")<string>(),
};

export const lectureActions = {
  updateTitle: createAction("home/lectureActions/updateTitle")<string>(),
  updateTimes: createAction("home/lectureActions/updateTimes")<
    ActionType<typeof timesActions>
  >(),
  updateLinks: createAction("home/lectureActions/updateLinks")<
    ActionType<typeof linksActions>
  >(),
};

export const timesActions = {
  add: createAction("home/timesActions/add")(),
  update: createAction("home/timesActions/update")<
    [string, ActionType<typeof timeActions>]
  >(),
  remove: createAction("home/timesActions/remove")<string>(),
};

export const timeActions = {
  updateWeekday: createAction("home/timeActions/updateWeekday")<Weekday>(),
  updateBeginTime: createAction("home/timeActions/updateBeginTime")<string>(),
  updateEndTime: createAction("home/timeActions/updateEndTime")<string>(),
};

export const linksActions = {
  add: createAction("home/linksActions/add")(),
  update: createAction("home/linksActions/update")<
    [string, ActionType<typeof linkActions>]
  >(),
  remove: createAction("home/linksActions/remove")<string>(),
};

export const linkActions = {
  updateLabel: createAction("home/linkActions/updateLabel")<string>(),
  updateUrl: createAction("home/linkActions/updateUrl")<string>(),
};

export const reducer = createReducer<Lecture[], ActionType<typeof actions>>(
  INITIAL_STATE.lectures
)
  .handleAction(actions.add, (state, _) =>
    produce(state, (draft) => {
      draft.push(createLecture());
    })
  )
  .handleAction(actions.update, (state, action) => {
    const [id, subAction] = action.payload;
    return produce(state, (draft) => {
      const index = draft.findIndex((e) => e.id === id);
      if (index !== -1) {
        draft[index] = lectureReducer(draft[index], subAction);
      }
    });
  })
  .handleAction(actions.remove, (state, action) =>
    produce(state, (draft) => {
      const index = draft.findIndex((e) => e.id === action.payload);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    })
  );

const lectureReducer = createReducer<
  Lecture,
  ActionType<typeof lectureActions>
>(createLecture())
  .handleAction(lectureActions.updateTitle, (state, action) =>
    produce(state, (draft) => {
      draft.title = action.payload;
    })
  )
  .handleAction(lectureActions.updateTimes, (state, action) =>
    produce(state, (draft) => {
      draft.times = timesReducer(draft.times, action.payload);
    })
  )
  .handleAction(lectureActions.updateLinks, (state, action) =>
    produce(state, (draft) => {
      draft.links = linksReducer(draft.links, action.payload);
    })
  );

const timesReducer = createReducer<
  LectureTime[],
  ActionType<typeof timesActions>
>([])
  .handleAction(timesActions.add, (state, _) =>
    produce(state, (draft) => {
      if (draft.length > 0) {
        const last = draft[draft.length - 1];
        draft.push({
          id: uuidv4(),
          weekday: last.weekday,
          beginTime: last.beginTime,
          endTime: last.endTime,
        });
      } else {
        draft.push(createTime());
      }
    })
  )
  .handleAction(timesActions.update, (state, action) => {
    const [id, subAction] = action.payload;
    return produce(state, (draft) => {
      const index = draft.findIndex((e) => e.id === id);
      if (index !== -1) {
        draft[index] = timeReducer(draft[index], subAction);
      }
    });
  })
  .handleAction(timesActions.remove, (state, action) =>
    produce(state, (draft) => {
      const index = draft.findIndex((e) => e.id === action.payload);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    })
  );

const timeReducer = createReducer<LectureTime, ActionType<typeof timeActions>>(
  createTime()
)
  .handleAction(timeActions.updateWeekday, (state, action) =>
    produce(state, (draft) => {
      draft.weekday = action.payload;
    })
  )
  .handleAction(timeActions.updateBeginTime, (state, action) =>
    produce(state, (draft) => {
      draft.beginTime = action.payload;
    })
  )
  .handleAction(timeActions.updateEndTime, (state, action) =>
    produce(state, (draft) => {
      draft.endTime = action.payload;
    })
  );

const linksReducer = createReducer<
  LectureLink[],
  ActionType<typeof linksActions>
>([])
  .handleAction(linksActions.add, (state, _) =>
    produce(state, (draft) => {
      draft.push(createLink());
    })
  )
  .handleAction(linksActions.update, (state, action) => {
    const [id, subAction] = action.payload;
    return produce(state, (draft) => {
      const index = draft.findIndex((e) => e.id === id);
      if (index !== -1) {
        draft[index] = linkReducer(draft[index], subAction);
      }
    });
  })
  .handleAction(linksActions.remove, (state, action) =>
    produce(state, (draft) => {
      const index = draft.findIndex((e) => e.id === action.payload);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    })
  );

const linkReducer = createReducer<LectureLink, ActionType<typeof linkActions>>(
  createLink()
)
  .handleAction(linkActions.updateLabel, (state, action) =>
    produce(state, (draft) => {
      draft.label = action.payload;
    })
  )
  .handleAction(linkActions.updateUrl, (state, action) =>
    produce(state, (draft) => {
      draft.url = action.payload;
    })
  );
