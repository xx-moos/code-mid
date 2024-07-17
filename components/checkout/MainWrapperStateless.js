import Steps from "./Steps";

const MainWrapperStateless = ({ children, disableSteps = false }) => {
  return (
    <>
      <main className="flex-1 h-full justify-center flex mt-10 lg:mt-0 ">
        <section
          aria-labelledby="primary-heading"
          className="min-w-0 max-w-2xl flex-1 h-full flex flex-col lg:order-last"
        >
          {!disableSteps && (
            <div className="max-w-2xl">
              <Steps />
            </div>
          )}

          {children}
        </section>
      </main>
    </>
  );
};

export default MainWrapperStateless;
