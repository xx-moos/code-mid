import MmfLogo from "assets/svg/MmfLogo";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "TERMS AND CONDITIONS", href: "/terms" },
  { name: "FAQ", href: "/faq" },
  { name: "SHAPES", href: "/create/shapes" },
  { name: "GUIDELINES", href: "/guidelines" },
  { name: "PRICING", href: "/create/shapes" },
  { name: "REVIEWS", href: "/reviews" },
  { name: "LOGIN", href: "/auth/signin", prefetch: false },
  { name: "CONTACT US", href: "/contact", prefetch: false },
];

const Footer = () => {
  return (
    <footer className="bg-white mt-6 w-full">
      <nav className="max-w-[80rem] relative mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <ul
          className="-mx-5 -my-2 flex lg:flex-wrap lg:flex-row flex-col justify-start"
          aria-label="Footer"
        >
          {navigation.map((item) => (
            <li key={item.name} className="px-5 py-2">
              <Link
                href={item.href}
                {...(!item.prefetch && { prefetch: false })}
              >
                <a className="cursor-pointer text-base text-gray-500 hover:text-gray-900">
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-left text-base text-gray-500">
          &copy; {new Date().getFullYear()} MAKEMYFRESHENER.COM
        </p>
        <div className="text-transparent absolute top-1/3 -translate-y-1/3 lg:right-0 right-3 flex items-center lg:flex-row flex-col-reverse justify-center gap-2">
          <Image
            width={80}
            height={80}
            className="pr-3"
            alt="made in USA"
            src="https://flower-manufacturing.s3.amazonaws.com/frontend/makemyfresheners/img/usa.webp"
          />
          <div className="flex items-center justify-center lg:mb-0 mb-5">
            <MmfLogo width={150} height={100} />
          </div>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
