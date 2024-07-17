import Guidelines from "./Guidelines";
import PropTypes from "prop-types";

const SideBarWrapper = ({ children, title }) => {
  return (
    <aside className="w-full items-start lg:w-[420px] h-full justify-center flex">
      <div className="mt-0 lg:pr-12 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-5 lg:mb-0">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>

        <div className="mt-4 sm:mt-0 bg-white border border-gray-200 rounded-lg shadow-sm">
          {children}
          <Guidelines />
        </div>
      </div>
    </aside>
  );
};

SideBarWrapper.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default SideBarWrapper;
