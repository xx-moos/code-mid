import Link from "next/link";

const Guidelines = () => {
  return (
    <>
      {/* <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
        <h2 className="font-medium">FAQ</h2>

        {faqs.slice(0,4).map((faq) => (
          <Disclosure as="div" key={faq.question} className="pt-6">
            {({ open }) => (
              <>
                <dt className="text-lg">
                  <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                    <span className="text-sm font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <span className="ml-3 h-7 flex items-center">
                      <ChevronDownIcon
                        className={classNames(
                          { "-rotate-180": open },
                          "h-4 w-4 transform"
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </Disclosure.Button>
                </dt>
                <Disclosure.Panel as="dd" className="mt-2">
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}

        <Link passHref href="/faq"><span className="link mt-4">See more</span></Link>
      </div> */}

      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
        <h2 className="font-medium">Guidelines</h2>

        <p className="text-sm text-gray-500 mt-4">
          Printing on custom car fresheners can be a little different. Please
          review our{" "}
          <Link href="/guidelines">
            <a className="link-inline">Guidelines</a>
          </Link>{" "}
          to ensure you get the best results on your new custom air fresheners!
        </p>
      </div>
    </>
  );
};

export default Guidelines;
