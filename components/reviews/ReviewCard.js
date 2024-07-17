import PropTypes from "prop-types";
import { StarIcon } from "@heroicons/react/solid";
import getConfig from "next/config";
import dayjs from "dayjs";
import Image from "next/image";

const ReviewCard = ({ review }) => {
  const {
    publicRuntimeConfig: { publicS3Url },
  } = getConfig();

  const customerName = review.request?.order?.customer?.short_name;

  return (
    <div className="card p-0 mx-5 md:mx-0">
      <div className="md:h-[256px] md:w-[242px] w-full aspect-square relative">
        <Image
          alt={`Review ${review.id}`}
          src={`${publicS3Url}/${review.image}`}
          layout="fill"
          className="absolute"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      <div className="px-3 py-5 text-xs">
        <div className="flex justify-between w-full flex-wrap items-center">
          <div className="flex justify-center items-center text-gray-500">
            <div>{customerName}</div>
            {customerName && <span className="mx-2 mb-2">•</span>}
            <div>{dayjs(review.created_date).format("MM/DD/YYYY")}</div>
          </div>
          <div className="flex justify-center">
            {Array(+review.rating)
              .fill()
              .map((item, index) => (
                <StarIcon
                  key={`${review.id}_${index}`}
                  className="h-5 w-5 text-yellow-400"
                />
              ))}
          </div>
        </div>
        <div className="mt-2 text-gray-500">"{review.review}"</div>
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.shape({
    image: PropTypes.string,
    request: PropTypes.string,
    created_date: PropTypes.string,
    rating: PropTypes.string,
    review: PropTypes.string,
  }).isRequired,
};

export default ReviewCard;
