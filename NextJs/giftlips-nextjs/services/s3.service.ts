import http from "./http.service";

export const s3Upload = async (key: string, type: any, bodyData: any) => {
  try {
    const s3Response: any = await http.post(`/public/s3/sign/`, {
      uploadKey: key,
      type: type,
    });
    var options = {
      method: "PUT",
      body: bodyData,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    };
    const putResponse = await fetch(s3Response.data.uploadUrl, options);
    console.log(putResponse);
    return s3Response.data.fileUrl;
  } catch (e) {
    return null;
  }
};
