import { CheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useMemo } from "react";

const Steps = () => {
  const { asPath } = useRouter();

  const path = useMemo(() => {
    if (asPath.includes("checkout")) return "checkout";
    const lastPath = asPath.split("/")[asPath.split("/")?.length - 1];
    if (["upload", "approve", "string", "design", "lasso"].includes(lastPath))
      return "custom";

    return lastPath;
  }, [asPath]);

  const steps = {
    shapes: {
      id: 1,
      name: "shape",
    },
    details: {
      id: 2,
      name: "details",
    },
    custom: {
      id: 3,
      name: "customize",
    },
    checkout: {
      id: 4,
      name: "checkout",
    },
  };

  return (
    <div className="">
      <nav className="mx-auto w-full" aria-label="Progress">
        <ol
          role="list"
          className="rounded-md overflow-hidden flex justify-between"
        >
          {Object.values(steps).map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-hidden lg:flex-1">
              <div className={"overflow-hidden"}>
                {step.id < steps[path]?.id ? (
                  <div className="group">
                    <span
                      className={classNames(
                        "px-2 pt-3 pb-2 flex items-center text-sm font-medium"
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="w-6 h-6 flex items-center justify-center bg-gray-400 rounded-full">
                          <CheckIcon
                            className="w-4 h-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span className="mt-0.5 ml-2 min-w-0 sm:flex flex-col hidden">
                        <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                          {step.name}
                        </span>
                      </span>
                    </span>
                  </div>
                ) : step.id === steps[path]?.id ? (
                  <div aria-current="step">
                    <span
                      className={classNames(
                        "px-2 pt-3 pb-2 flex items-center text-sm font-medium"
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="w-6 h-6 flex items-center justify-center bg-sky-600 rounded-full">
                          <span className="text-white text-sm">
                            {stepIdx + 1}
                          </span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-2 min-w-0 sm:flex flex-col hidden">
                        <span className="text-xs font-semibold text-sky-600 tracking-wide uppercase">
                          {step.name}
                        </span>
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="group">
                    <span
                      className={classNames(
                        "px-2 pt-3 pb-2 flex items-center text-sm font-medium"
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="w-6 h-6 flex items-center justify-center border-2 border-gray-300 rounded-full">
                          <span className="text-gray-500 text-sm">
                            {stepIdx + 1}
                          </span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-2 min-w-0 sm:flex flex-col hidden">
                        <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                          {step.name}
                        </span>
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Steps;
