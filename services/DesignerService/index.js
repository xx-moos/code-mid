import api from "services/Api";
import axios from "axios";

export const postDesignReorder = async (id) => {
  const resp = await api.post(`/v2/store/designs/${id}/reorder`);

  return resp.data;
};

export const restoreDesignWarning = async (id) => {
  const resp = await api.post(`/v2/store/designs/${id}/warning`);

  return resp.data;
};

export const removeDesignWarning = async (id) => {
  const resp = await api.post(`/v2/store/designs/${id}/remove_warning`);

  return resp.data;
};

export const getDesignsList = async () => {
  const resp = await api.get(`/v2/store/designs/`);

  // TODO: backend filtering/ordering/pagination;
  return resp.data.filter(({artwork}) => !!artwork?.back_proof_url);
};

export const getShape = async (id) => {
  const resp = await api.get(`/v2/store/shapes/${id}`);

  return resp.data;
};

export const getDesign = async (id) => {
  const resp = await api.get(`/v2/store/designs/${id}`);

  return resp.data;
};

export const postDesign = async ({ shape, name }) => {
  const resp = await api.post(`/v2/store/designs/create`, {
    shape,
    ...(name && { name }),
  });

  return resp.data;
};

export const patchCustomDesign = async ({
  id,
  name,
  warning_enabled,
  data,
  front_url,
  back_url,
  front_proof,
  back_proof,
  cut_file,
}) => {
  const resp = await api.patch(`/v2/store/designs/custom/${id}`, {
    name,
    warning_enabled,
    ...(data && { data }),
    ...(front_url && { front_url }),
    ...(front_proof && { front_proof }),
    ...(back_url && { back_url }),
    ...(back_proof && { back_proof }),
    ...(cut_file && { cut_file }),
  });

  return resp.data;
};

export const patchDesign = async ({
  id,
  name,
  warning_enabled,
  data,
  front_url,
  back_url,
  front_proof,
  back_proof,
  cut_file,
}) => {
  const resp = await api.patch(`/v2/store/designs/${id}`, {
    name,
    warning_enabled,
    ...(data && { data }),
    ...(front_url && { front_url }),
    ...(front_proof && { front_proof }),
    ...(back_url && { back_url }),
    ...(back_proof && { back_proof }),
    ...(cut_file && { cut_file }),
  });

  return resp.data;
};

export const deleteDesign = async (designId) => {
  const resp = await api.patch(`/v2/store/designs/${designId}/delete`);

  return resp.data;
};

export const addAsset = (fileRef, id) => {
  return addAssetToS3(fileRef, id);
};

const addAssetLocally = (fileRef) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ url: URL.createObjectURL(fileRef) });
    }, 1000);
  });
};

const addAssetToS3 = async (fileRef, designID) => {
  let typeList;
  if ("name" in fileRef) {
    typeList = fileRef.name.split(".");
  } else {
    typeList = fileRef.type.split("/");
  }

  const {
    data: { presigned_url, key },
  } = await api.post(`/v2/store/designs/${designID}/assets/generate_url`, {
    mimetype: typeList[typeList.length - 1],
    content_length: fileRef.size,
    content_type: "application/x-www-form-urlencoded",
  });

  await axios.put(presigned_url, fileRef);

  await api.post(`/v2/store/designs/${designID}/assets/create`, {
    key,
    final: false,
  });

  return { url: presigned_url.replace("temp-uploads", designID).split("?")[0] };
};

export const addAssetFinalToS3 = async (
  fileRef,
  designID,
  mimetype = "png"
) => {
  // generate url
  // upload to s3
  // create asset
  // update design

  let contentType;
  let data;

  if (mimetype === "svg") {
    contentType = "image/svg+xml";
    data = fileRef; // Assuming fileRef is the SVG text
  } else if (mimetype === "png") {
    contentType = "application/x-www-form-urlencoded";
    data = new Buffer(
      fileRef.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64"
    );
  } else {
    throw new Error("Unsupported mimetype");
  }

  const {
    data: { presigned_url, key },
  } = await api.post(`/v2/store/designs/${designID}/assets/generate_url`, {
    mimetype,
    content_length: fileRef.length,
    content_type: contentType,
  });

  await axios.put(presigned_url, data, {
    headers: {
      "Content-Type": contentType,
    },
  });

  await api.post(`/v2/store/designs/${designID}/assets/create`, {
    key,
    final: true,
  });

  return { url: presigned_url.replace("temp-uploads", designID).split("?")[0] };
};

