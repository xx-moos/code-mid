import Shape from "components/checkout/Shape";
import Meta from "components/common/Meta";
import {
  getScentsList,
  getShapesList,
  getStringsList,
} from "services/CheckoutService";

const ShapesPage = ({ shapes, customShape, scents, strings }) => {
  return (
    <>
      <div id="top"></div>

      <Meta
        title="Shapes for Custom Air Fresheners - Make My Freshener"
        description="Shape your freshness with Make My Freshener! Explore a variety of custom car air freshener shapes. Personalize your drive with style and signature sragrances."
        canonicalLink="https://www.makemyfreshener.com/create/shapes"
      />
      <div className="flex-1 flex flex-col lg:flex-row items-stretch -mt-6 lg:mt-6 px-5 lg:p-0">
        <Shape shapes={shapes} customShape={customShape} scents={scents} />
      </div>
    </>
  );
};

export async function getStaticProps() {
  const [shapes, scents, strings] = await Promise.all([
    getShapesList(),
    getScentsList(),
    getStringsList(),
  ]);

  return {
    props: {
      shapes: shapes.filter((shape) => !shape.slug.includes("custom")),
      customShape:
        shapes.find((shape) => shape.slug.includes("custom")) || null,
      scents,
      strings,
    },
  };
}

export default ShapesPage;
