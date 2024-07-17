import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { postDesign } from "services/DesignerService";
import { createOrder, getOrderItems } from "services/OrderService";
import { getCartOrder, saveCartOrder } from "utils/storage";
import FaceCropWithBorderMin from "assets/images/FaceCropWithBorder-min.png";
import Badge from "./Badge";
import Link from "next/link";
import { trackViewItem } from "utils/googleTag";
import LoadingSpinnerV2 from "components/common/LoadingSpinnerV2";

export default function ShapeCard({ shape }) {
  const [loading, setLoading] = useState();
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const cartOrder = getCartOrder();
      const designResult = await postDesign({ shape: shape.id });
      let orderId = cartOrder;

      if (!!orderId) {
        await getOrderItems(orderId).catch(() => {
          orderId = null;
        });
      }

      if (!orderId) {
        orderId = await createOrder({ design: designResult.pk }).then(
          (order) => order.pk
        );
        saveCartOrder(orderId);
      }
      trackViewItem(shape);
      router.push(`/create/${orderId}/${designResult.pk}/details`);
    } catch (err) {
      setLoading(false);
    }
  };

  const renderNormalShape = () => {
    return (
      <>
        {!!shape?.min_qty_mmf && (
          <div className="absolute z-10 w-32 h-32 bottom-5 -right-2 lg:-right-5 -rotate-12">
            <Badge qty={shape.min_qty_mmf} />
          </div>
        )}
        <span className="text-sm text-gray-500">
          {Math.round((shape.width / 300 - 0.16) * 100) / 100}" x{" "}
          {Math.round((shape.height / 300 - 0.16) * 100) / 100}"
        </span>
        <div>
          <Image
            src={shape?.preview}
            alt={shape.name}
            width={195}
            height={195}
          />
        </div>
        <a
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          href={shape?.template}
          className="link"
          rel="nofollow noreferrer"
        >
          Download PDF
        </a>
      </>
    );
  };

  const renderCustomShape = () => {
    return (
      <>
        <span className="text-sm text-gray-500">
          {shape?.width}” x {shape?.height}”
        </span>
        <div className="relative my-auto">
          <Image
            src={FaceCropWithBorderMin}
            alt="FaceCropWithBorder"
            height={180}
            width={133}
            priority={true}
          />
        </div>
        <Link href="https://www.makemyfreshener.com/pages/face-air-freshener">
          <a className="link" onClick={(e) => e.stopPropagation()}>
            Learn more!
          </a>
        </Link>
      </>
    );
  };

  return (
    <button
      disabled={loading}
      type="button"
      onClick={onSubmit}
      className="relative flex flex-col items-center justify-between p-2 overflow-visible cursor-pointer card hover:border-blue-200 hover:border-2"
    >
      {loading && (
        <div className="absolute z-10 flex items-center h-full">
          <LoadingSpinnerV2 size="w-10 h-10" color="text-gray-700" />
        </div>
      )}
      <span className="text-sm text-gray-700 uppercase">{shape.name}</span>
      {shape.slug.includes("custom")
        ? renderCustomShape()
        : renderNormalShape()}
    </button>
  );
}
