import { useState } from "react";
import analytics from "universal-ga";
import { useDispatch } from "react-redux";

import Stage from "redux/models/Stage";
import { TABS } from "constants/designer";
import classNames from "classnames";

export const Tabs = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState();

  const setActiveTab = (activeTab, eventName) => {
    analytics.event("Designer", eventName);
    dispatch(Stage.types.update({ activeTab }));
    setCurrentTab(activeTab);
  };

  const navigation = [
    {
      key: TABS.TEXT,
      title: "add-text-btn",
      cb: () => setActiveTab(TABS.TEXT, "Add Text"),
    },
    {
      key: TABS.IMAGE,
      title: "add-image-btn",
      cb: () => setActiveTab(TABS.IMAGE, "Add Image"),
    },
    {
      key: TABS.BG_COLOR,
      title: "bg-color-btn",
      cb: () => setActiveTab(TABS.BG_COLOR, "Add BG Color"),
    },
    {
      key: TABS.FORMAT,
      title: "format-btn",
      cb: () => setActiveTab(TABS.FORMAT, "Format"),
    },
    {
      key: TABS.COPY,
      title: "copy-btn",
      cb: () => setActiveTab(TABS.COPY, "Copy"),
    },
  ];

  return (
    <nav className="flex lg:flex-col" aria-label="Sidebar">
      {navigation.map((item) => (
        <button
          key={item.key}
          onClick={item.cb}
          className={classNames(
            item.key === currentTab ? "opacity-1" : "opacity-60",
            `${item.title} h-[60px] w-[60px] lg:mx-0 mx-1 lg:mb-2`
          )}
          aria-current={item.key === currentTab ? "page" : undefined}
        ></button>
      ))}
    </nav>
  );
};
