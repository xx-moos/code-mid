import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, TrashIcon } from "@heroicons/react/solid";
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/outline";

import Checkout from "redux/models/Checkout";
import Stage from "redux/models/Stage";
import classNames from "classnames";
import Design from "redux/models/Design";
import DesignNameForm from "components/common/DesignNameForm";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Order from "redux/models/Order";
import { pusher } from "config/pusherConfig";
import App from "redux/models/App";
import { getDesign } from "services/DesignerService";

export const TopBar = () => {
  const dispatch = useDispatch();
  const stage = useSelector(Stage.selectors.getStage);
  const { currentSide, hasUndo, hasRedo } = stage;
  const router = useRouter();
  const { designId } = router.query;

  const selectedDesign = useSelector(Checkout.selectors.getSelectedDesign);
  const { name } = useSelector((state) =>
    Design.selectors.getDesign(state, selectedDesign)
  );
  const order = useSelector((state) => Order.selectors.getOrder(state));

  const handleToggleSide = () => dispatch(Stage.types.toggleSide());

  const handleSave = () => {
    dispatch(
      Stage.types.saveDesign({
        cb: () => {
          const channel = pusher.subscribe(`design-${selectedDesign}`);
          channel.bind("generate_and_upload_artwork", () =>
            dispatch(App.types.hideLoader())
          );
        },
      })
    );
  };

  const handleDone = useCallback(() => {
    dispatch(
      Stage.types.saveDesign({
        cb: () => {
          const channel = pusher.subscribe(`design-${selectedDesign}`);
          channel.bind("generate_and_upload_artwork", async ({ status }) => {
            if (status === "complete") {
              const design = await getDesign(designId);
              dispatch(
                Order.types.updateArtwork({
                  designId,
                  back_proof: design.back_proof,
                  front_proof: design.front_proof,
                })
              );
              router.push(`/cart/${order?.id}`);
            }
            dispatch(App.types.hideLoader());
          });
        },
      })
    );
  }, [order, selectedDesign]);

  return (
    <div>
      <div className="flex justify-between items-center border-b rounded-t py-2 px-4">
        <DesignNameForm defaultName={name} designId={designId} />

        <div className="hidden md:flex flex-col justify-center items-center">
          <h1 className="text-lg ">
            {stage.shapeName} {stage.width}"<span className="text-xs">x</span>
            {stage.height}"
          </h1>
          <span className="italic text-xs text-gray-500">
            Note: Not scaled to size
          </span>
        </div>
        <div className="flex ml-2 lg:ml-0 gap-2 items-center">
          <button
            onClick={handleSave}
            className="clear-button text-xs md:text-base"
          >
            Save
          </button>
          <button
            onClick={handleDone}
            className="blue-button text-xs md:text-base"
          >
            Done
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center border-b py-2 px-4">
        <div className="flex justify-around">
          <button
            className="clear-button md:px-4 md:py-2 p-1 items-center"
            onClick={() => {
              dispatch(Stage.types.undo());
            }}
            disabled={!hasUndo[currentSide]}
          >
            <ArrowCircleLeftIcon className="h-4 w-4" />
            <span className="sr-only lg:not-sr-only lg:ml-2 ">Undo</span>
          </button>
          <button
            className="clear-button md:px-4 md:py-2 p-1 ml-2 items-center"
            disabled={!hasRedo[currentSide]}
            onClick={() => {
              dispatch(Stage.types.redo());
            }}
          >
            <span className="sr-only lg:not-sr-only lg:mr-2">Redo</span>
            <ArrowCircleRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-center">
          <div>
            <nav
              className="relative z-0 rounded-lg shadow border border-gray-200 flex divide-x divide-gray-200"
              aria-label="Tabs"
            >
              {["front", "back"].map((tab) => (
                <button
                  key={tab}
                  disabled={currentSide === tab}
                  onClick={handleToggleSide}
                  className={classNames(
                    currentSide === tab
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-700",
                    tab === "front" ? "rounded-l-lg" : "",
                    tab === "back" ? "rounded-r-lg" : "",
                    "group relative min-w-0 flex-1 overflow-hidden bg-white py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                  )}
                  aria-current={currentSide === tab ? "page" : undefined}
                >
                  <span className="uppercase">{tab}</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      currentSide === tab ? "bg-blue-500" : "bg-transparent",
                      "absolute inset-x-0 bottom-0 h-1"
                    )}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex justify-around">
          <button
            className="clear-button md:px-4 md:py-2 p-1 text-red-500 items-center"
            disabled={!"itemSelected"}
            onClick={() => {
              dispatch(Stage.types.deleteItem());
            }}
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only lg:not-sr-only lg:ml-2">Delete</span>
          </button>
          <button
            className="clear-button md:px-4 md:py-2 p-1 ml-2 items-center"
            onClick={() => {
              dispatch(Stage.types.togglePreview());
            }}
          >
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only lg:not-sr-only lg:ml-2">Preview</span>
          </button>
        </div>
      </div>
      <div className="flex justify-evenly items-center border-b py-2 px-4">
        <div className="flex items-center">
          <div className="border-b-[3px] w-5 md:w-20 mr-3 border-red-500 border-dashed"></div>
          <span className="text-sm text-gray-600">Art Bleed</span>
        </div>

        <div className="flex items-center">
          <div className="border-b-[3px] w-5 md:w-20 mr-3 border-gray-800 border-dashed"></div>
          <span className="text-sm text-gray-600">Die Cut</span>
        </div>

        <div className="flex items-center">
          <div className="border-b-[3px] w-5 md:w-20 mr-3 border-green-500 border-dashed"></div>
          <span className="text-sm text-gray-600">Text Safe</span>
        </div>
      </div>
      {/* {showBlankSideWarningModal && <BlankSideWarningModal/>} */}
    </div>
  );
};
