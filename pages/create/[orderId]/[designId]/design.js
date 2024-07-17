import Designer from "components/designer";

import Meta from "components/common/Meta";
import Loader from "components/common/Loader";
import withState from "hocs/withState";
import { ArrowNarrowUpIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import scrollToTop from "utils/scrollToTop";

const DesignPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window?.innerWidth < 1024);
  }, []);

  useEffect(() => {
    scrollToTop();
    document.body.style["overflow-y"] = "hidden";
    return () => (document.body.style["overflow-y"] = "auto");
  });

  return (
    <>
      <div id="top"></div>

      <Meta
        title="Air Freshener Fragrances | Custom Car Air Fresheners"
        description="Make My Freshener offers a variety of distinct shapes to choose from. If you have a design in mind for your custom car air freshener, find a shape that compliements it!"
        canonicalLink="https://www.makemyfreshener.com/create/shapes/"
      />
      <Loader />

      {isMobile ? (
        <div className="pr-5 pl-3 h-[90vh] overflow-y-auto overflow-x-visible">
          <Designer />
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row items-stretch -mt-6 lg:mt-6 px-3 lg:p-0">
          <Designer />
        </div>
      )}
    </>
  );
};

export default withState(DesignPage);
