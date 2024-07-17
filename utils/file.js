import { v4 as uuidv4 } from "uuid";

export const handleFetchSVG = async (url) => {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        // throw new Error("Network response was not ok");
      }
      return res.text();
    })
    .then((svgText) => {
      return svgText;
    });
};

export const convertHeicToPng = async (file) => {
  const heicConverter = (await import("heic-convert/browser")).default;

  const result = await heicConverter({
    buffer: new Uint8Array(await file.arrayBuffer()),
    format: "JPEG",
  });

  const pngBlob = new Blob([result], { type: "image/jpeg" });
  return new File([pngBlob], file.name.replace(/\.[^/.]+$/, ".jpeg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

export const handleConvertImage = ({ image, mirror = false }) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = function () {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (mirror) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, img.naturalWidth * -1, img.naturalHeight);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = `${uuidv4()}.png`;

        resolve(canvas.toDataURL("image/png"));
      }, "image/png");
    };
  });
};

export const downloadFile = (fileName, url) => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
};
export const resizeToDataURL = ({ resizeMinimalDimension, img, callback }) => {
  const image = new Image();
  image.src = img;
  image.crossOrigin = "anonymous";
  image.onload = () => {
    const canvas = document.createElement("canvas");

    const smallerSize = Math.min(image.naturalWidth, image.naturalHeight);
    let resize = 1;

    if (smallerSize < resizeMinimalDimension)
      resize = resizeMinimalDimension / smallerSize;

    canvas.width = resize * image.naturalWidth;
    canvas.height = resize * image.naturalHeight;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      blob.name = "fileName.png";

      callback(canvas.toDataURL("image/png"), resize);
    }, "image/png");
  };
};
