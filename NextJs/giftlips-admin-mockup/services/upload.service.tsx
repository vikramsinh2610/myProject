import http from "./http.service";

export const getPresignedUrl = async (key: any, fileType: any) => {
  let response = await http.post(`/public/s3/sign/`, {
    uploadKey: key,
    type: fileType,
  });
  return response.data;
};
