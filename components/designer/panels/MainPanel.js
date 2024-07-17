import { useMemo } from "react";
import { useSelector } from "react-redux";

import Stage from "redux/models/Stage";
import { TABS } from "constants/designer";

import { GetStartedPanel } from "./GetStartedPanel";
import { AddTextPanel } from "./AddTextPanel";
import { AddImagePanel } from "./AddImagePanel";
import { BackgroundPanel } from "./BackgroundPanel";
import { FormatPanel } from "./FormatPanel";
import { CopyPanel } from "./CopyPanel";
import { RemoveWarning } from "./RemoveWarning";

export const MainPanel = () => {
  const stage = useSelector(Stage.selectors.getStage);
  const { activeTab } = stage;

  const title = useMemo(() => {
    const tabTitle = {
      [TABS.TEXT]: "add text",
      [TABS.IMAGE]: "add image",
      [TABS.BG_COLOR]: "background color",
      [TABS.FORMAT]: "format",
      [TABS.COPY]: "copy",
    }[activeTab];

    return tabTitle || "get started";
  }, [activeTab]);


  return (
    <div id="control-pane" className="mt-4 lg:mt-0 lg:w-[300px] min-w-[300px] card p-0">
      <div className="">
        <h3 className="capitalize py-4 text-center text-lg border-b">
          {title}
        </h3>
      </div>
      <div className="flex flex-col items-center divide-y divide-slate-200">
        {!activeTab && <GetStartedPanel />}
        {activeTab === TABS.TEXT && <AddTextPanel />}
        {activeTab === TABS.IMAGE && <AddImagePanel />}
        {activeTab === TABS.BG_COLOR && <BackgroundPanel />}
        {activeTab === TABS.FORMAT && <FormatPanel />}
        {activeTab === TABS.COPY && <CopyPanel />}

        <RemoveWarning />
      </div>
    </div>
  );
};
