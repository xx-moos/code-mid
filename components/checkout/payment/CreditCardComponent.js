export default function CreditCardComponent({ card }) {
  return (
    <div className="max-w-[230px] p-3 px-5 flex flex-col border-2 border-blue-900 rounded-md bg-gradient-to-b from-blue-800 to-blue-500 text-sm text-white">
      <div className="flex justify-between">
        <div className="">
          <p className="font-light text-xs">Brand</p>
          <p className="font-medium tracking-widest">{card.brand}</p>
        </div>
        <div className="flex justify-between">
          <div className="">
            <p className="font-light text-xs">Expiry</p>
            <p className="font-medium tracking-wider">
              {card.exp_month}/{card.exp_year}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-3">
        <p className="font-light text-xs">Number</p>
        <p className="font-medium tracking-more-wider">
          **** **** **** {card.last4}
        </p>
      </div>
    </div>
  );
}
