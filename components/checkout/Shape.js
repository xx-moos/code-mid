import SideBarWrapper from "./SideBarWrapper";
import Link from "next/link";
import BadgeTopQuality from "assets/svg/BadgeTopQuality";
import ShapeCard from "./ShapeCard";
import MainWrapperStateless from "./MainWrapperStateless";

const Shape = ({ shapes, customShape, scents }) => {
  return (
    <>
      <MainWrapperStateless>
        <form>
          <div>
            <div>
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium text-gray-900">
                  Select Shape
                </h1>
              </div>
              <p className="bg-green-700 px-2 py-4 rounded-lg mt-4 text-white text-center text-md">
                Click on a shape to see pricing and begin designing your custom
                car air freshener.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                {customShape && <ShapeCard shape={customShape} />}
                {shapes.map((shape) => (
                  <ShapeCard key={shape.id} shape={shape} />
                ))}
              </div>
            </div>
          </div>
        </form>
      </MainWrapperStateless>
      <SideBarWrapper>
        <div className="py-6 px-4 space-y-6 sm:px-6">
          <div className="flex items-center ">
            <h2 className="font-medium">Available fragrances</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {scents.map(
              (
                scent // TODO - filter by store
              ) => (
                <div key={scent.id} className="text-xs text-gray-600">
                  {scent.name}
                </div>
              )
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
          <h2 className="font-medium mb-4">Upload file types</h2>
          <span className="text-sm text-gray-600">
            You can upload PNG and JPG files into the tool. More information
            about resolution, refer to our{" "}
            <Link href="/guidelines">
              <a className="link">Guidelines</a>
            </Link>
            .
          </span>
        </div>

        <div className="border-t border-gray-200 py-6 px-4 sm:px-6 flex flex-col items-center">
          <h2 className="mb-5">TOP QUALITY MATERIALS</h2>

          <BadgeTopQuality
            width={"180"}
            height={"180"}
            alt="TOP QUALITY MATERIALS"
          />

          <span className="text-sm text-gray-600 text-center my-4">
            We use the top quality materials to give your freshener a sturdy,
            durable feel with vibrant printing and a great fragrance.
          </span>
          <Link href="/samples" prefetch={false}>
            <a className="cursor-pointer w-full flex justify-center bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50">
              Sample requests
            </a>
          </Link>
        </div>
      </SideBarWrapper>
    </>
  );
};

export default Shape;
