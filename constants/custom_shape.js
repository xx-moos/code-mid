import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";

import faceAndHair from "assets/images/Custom Shape - Human Face - Female.png";
import face from "assets/images/baby boy.png";
import petHead from "assets/images/Custom Shape - Pet Head - Dog with Dirt.png";
import petBody from "assets/images/Custom Shape - Pet Body - Cat.png";
import car from "assets/images/Custom Shape - Car - Blue.png";

export const STATUS_IN_PROGRESS = "in_progress";
export const STATUS_FAILED = "failed";
export const STATUS_COMPLETED = "completed";

export const TIME_INTERVAL = 1000;
export const TIMEOUT = 20000;

export const crop_types_list = [
  {
    Icon: (props) => (
      <Image
        src={faceAndHair}
        {...props}
        height={150}
        width={133}
        className="png-drop-shadow overflow-visible object-contain object-center"
      />
    ),
    value: "face_with_hair",
    label: "Face with hair",
  },
  {
    Icon: (props) => (
      <Image
        src={face}
        {...props}
        height={150}
        width={133}
        className="png-drop-shadow overflow-visible object-contain object-center"
      />
    ),
    value: "face",
    label: "Face",
  },
  {
    Icon: (props) => (
      <Image
        src={petHead}
        {...props}
        height={150}
        width={133}
        className="png-drop-shadow overflow-visible object-contain object-center"
      />
    ),
    value: "pet_head",
    label: "Pet head",
  },
  {
    Icon: (props) => (
      <Image
        src={petBody}
        {...props}
        height={150}
        width={133}
        className="png-drop-shadow overflow-visible object-contain object-center"
      />
    ),
    value: "pet",
    label: "Pet head and body",
  },
  {
    Icon: (props) => (
      <Image
        src={car}
        {...props}
        height={150}
        width={133}
        className="png-drop-shadow overflow-visible object-contain object-center"
      />
    ),
    value: "car",
    label: "Car",
  },
];

export const crop_types_lib = {
  pet_head: "Pet head",
  pet: "Pet head and body",
  face: "Face",
  face_with_hair: "Face with hair",

  car: "Car",
};
