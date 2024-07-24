import { useState } from "react";
import SignInForm from "components/common/SignInForm";
import SignUpForm from "components/common/SignUpForm";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";

export default function AuthSection() {
  const [hasAccount, setHasAccount] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
          {hasAccount ? "Sign in to proceed" : "Create an account to proceed"}
          <ArrowCircleRightIcon width={25} />
        </h2>
        <button type="button" onClick={() => setHasAccount(!hasAccount)}>
          <span className="link">
            {hasAccount
              ? "Don't have an account? Create one!"
              : "Already have an account? Sign in!"}
          </span>
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4">
        {hasAccount ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
