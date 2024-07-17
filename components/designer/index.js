import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { pusher } from "config/pusherConfig";

import {
  handleObjectChange,
  handleObjectSelected,
  handleSelectionCleared,
} from "utils/designer/event_listeners";
import Stage from "redux/models/Stage";

import Checkout from "redux/models/Checkout";
import { resetZoom } from "utils";
import { Tabs } from "./Tabs";
import { MainPanel } from "./panels/MainPanel";
import { MainStage } from "./MainStage";
import LoadingSpinner from "components/common/LoadingSpinner";

const Designer = () => {
  const dispatch = useDispatch();
  const stage = useSelector(Stage.selectors.getStage);
  const selectedDesign = useSelector(Checkout.selectors.getSelectedDesign);

  const handleAssetProcessed = ({ status, url }) => {
    if (status === "complete") {
      dispatch(Stage.types.displayProcessedImage({ url }));
    } else {
      toast.error(message || "Something went wrong!");
    }
  };

  useEffect(() => {
    if (!selectedDesign) return;

    const channel = pusher.subscribe(`design-${selectedDesign}`);
    channel.bind("asset_processed", handleAssetProcessed);

    return () => {
      channel.unbind();
      pusher.unsubscribe(`design-${selectedDesign}`);
    };
  }, [selectedDesign]);

  useEffect(() => {
    const bindEvents = (side) => {
      try {
        const configObject = {
          "selection:updated": (e) => handleObjectSelected(e, dispatch),
          "selection:created": (e) => handleObjectSelected(e, dispatch),
          "selection:cleared": (e) => handleSelectionCleared(e, dispatch),
          "object:modified": (e) => handleObjectChange(e, dispatch),
        };

        side.on(configObject);
      } catch {}
    };
    if (stage?.back && stage?.front)
      [stage.back, stage.front].forEach(bindEvents);
  }, [stage?.back, stage?.front]);

  useEffect(() => resetZoom(), []);

  return (
    <section
      id="designer-container"
      className="px-2 pb-2 lg:space-x-4 lg:flex w-full mt-12 lg:mt-0"
    >
      {!stage || !selectedDesign ? (
        <div className="w-full flex justify-center p-10">
          <LoadingSpinner className="w-24 h-24 text-blue-600" />
        </div>
      ) : (
        <>
          <Tabs />
          <MainPanel />
          <MainStage />
        </>
      )}
    </section>
  );
};

export default Designer;
