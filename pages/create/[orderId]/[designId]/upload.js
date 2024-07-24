import PropTypes from "prop-types";
import Checkout from "redux/models/Checkout";
import Order from "redux/models/Order";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import CustomShape from "redux/models/CustomShape";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import SelectImage from "components/customShape/SelectImage";
import CustomDesignLayout from "components/checkout/CustomDesignLayout";
import withState from "hocs/withState";
import dataURLtoFile from "utils/dataURLtoFile";
import HowToCropModal from "components/customShape/HowToCropModal";
import { getHowToCropAppeared, setHowToCropAppeared } from "utils/storage";
import { STATUS_FAILED, crop_types_list } from "constants/custom_shape";
import { convertHeicToPng } from "utils/file";
import CropTypeButton from "components/customShape/CropTypeButton";
import cropByHand from "assets/gif/crop-by-hand.gif";
import Image from "next/image";
import Link from "next/link";

const UploadPage = () => {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState("");
  const [isModalHowToVisible, setIsModalHowToVisible] = useState(false);
  const selectedDesign = useSelector(Checkout.selectors.getSelectedDesign);
  const order = useSelector((state) => Order.selectors.getOrder(state));

  const cropType = useSelector(Checkout.selectors.getCustomCropType);

  const router = useRouter();

  const handleStartImageProcessing = useCallback(
    (img) => {
      // generate file from base64 string
      const file = dataURLtoFile(img, `${uuidv4()}.png`);

      dispatch(
        CustomShape.types.processImage({
          file,
          cropType,
          cb: (status) => {
            if (status === STATUS_FAILED)
              router.push(`/create/${order?.id}/${selectedDesign}/lasso`);
          },
        })
      );

      router.push(`/create/${order?.id}/${selectedDesign}/approve`);
    },
    [cropType, selectedDesign, order]
  );

  useEffect(() => {
    setIsModalHowToVisible(!getHowToCropAppeared());
  }, []);

  return (
    <CustomDesignLayout disableSteps={!!cropType}>
      <div className="flex items-center justify-between px-4 py-2 rounded-t">
        <div className="w-full">
          {!!cropType && (
            <SelectImage
              startObjectRecognition={handleStartImageProcessing}
              imgSrc={imgSrc}
            />
          )}

          {!cropType && (
            <div className="flex flex-col items-center justify-center w-full space-y-8 my-5">
              <h2 className="text-lg text-blue-500 font-bold">
                Select Crop Type Then Upload
              </h2>
              <div className="flex flex-col items-center justify-center w-full space-y-5 bg-[#13B5EA] p-5 rounded">
                <h3 className="text-xl text-white">Automatic Cropping</h3>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 w-full">
                  {crop_types_list.map((option, index) => (
                    <CropTypeButton
                      key={option?.value}
                      option={option}
                      setImgSrc={setImgSrc}
                      className={
                        index >= 3
                          ? "lg:col-span-3 col-span-1"
                          : "lg:col-span-2 col-span-1"
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-full space-y-5 bg-gray-100 p-5 rounded">
                <h3 className="text-xl text-gray-800">Manual Cropping</h3>
                <div className="grid grid-cols-1 lg:flex w-full flex-col items-center justify-center">
                  <CropTypeButton
                    option={{
                      value: "other",
                      label: "Crop by hand",
                      Icon: () => (
                        <div className="crop-by-hand-gif">
                          <Image src={cropByHand} />
                        </div>
                      ),
                    }}
                    setImgSrc={setImgSrc}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full space-y-5">
                <h4 className="text-xl text-gray-800 text-center">
                  These crop types not working for your photo?
                </h4>

                <Link href="/create/shapes">
                  <a className="clear-button text-xl">Select a Shape</a>
                </Link>
              </div>
            </div>
          )}
        </div>
        <HowToCropModal
          isOpened={isModalHowToVisible}
          onClose={() => {
            setIsModalHowToVisible(false);
            setHowToCropAppeared(true);
          }}
        />
      </div>
    </CustomDesignLayout>
  );
};

UploadPage.propTypes = {
  onSubmit: PropTypes.func,
};

export default withState(UploadPage);
