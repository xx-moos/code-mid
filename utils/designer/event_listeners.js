import { TABS } from "constants/designer";
import Stage from "redux/models/Stage";

// occurs on each object select
export const handleObjectSelected = (event, dispatch) => {
  const type = event.target.get("type");

  switch (type) {
    case "i-text":
      dispatch(
        Stage.types.update({
          activeTab: TABS.TEXT,
          multipleItemsSelected: false,
          selectedText: event.target,
        })
      );
      break;
    case "image":
      dispatch(
        Stage.types.update({
          activeTab: TABS.FORMAT,
          multipleItemsSelected: false,
          selectedText: null,
        })
      );
      break;
    case "activeSelection":
      dispatch(
        Stage.types.update({
          activeTab: TABS.FORMAT,
          multipleItemsSelected: true,
          selectedText: null,
        })
      );
      break;
  }
};

// occurs on each object change
export const handleObjectChange = (event, dispatch) => {

  dispatch(Stage.types.handleObjectChange());
};

// occurs on each focus leave of any object on canvas
export const handleSelectionCleared = (event, dispatch) => {
  dispatch(
    Stage.types.update({
      selectedText: null,
    })
  );
};
