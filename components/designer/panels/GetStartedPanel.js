import { useDispatch } from "react-redux";
import analytics from "universal-ga";

import Stage from "redux/models/Stage";
import { TABS } from "constants/designer";

export const GetStartedPanel = () => {
  const dispatch = useDispatch();
  const setActiveTab = (activeTab) =>
    dispatch(Stage.types.update({ activeTab }));

  const handleAddText = () => {
    analytics.event("Designer", "Add Text");
    setActiveTab(TABS.TEXT);
  };
  const handleAddImage = () => {
    analytics.event("Designer", "Add Image");
    setActiveTab(TABS.IMAGE);
  };
  const handleBgColor = () => {
    analytics.event("Designer", "Add BG Color");
    setActiveTab(TABS.BG_COLOR);
  };

  return (
    <>
      <h5 className="w-full py-4 text-center text-gray-500">
        How do you want to begin?
      </h5>
      <button onClick={handleAddImage} className="add-image-cta clear-button mb-4 w-[135px] h-[70px]" />
      <button onClick={handleAddText} className="add-text-cta clear-button mb-4 w-[135px] h-[70px]" />
      <button onClick={handleBgColor} className="add-bg-cta clear-button mb-4 w-[135px] h-[70px]" />

    </>
  );
};
