import { getExtension } from "../helpers/common";
import http from "./http.service";
import get from "./get.card.service";
import { file } from "@babel/types";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";




export const getPresignedUrl = async (key: any, fileType: any) => {
  let response = await http.post(`/public/s3/sign/`, {
    uploadKey: key,
    type: fileType,
  });
  return response.data;
};

export const presignedUpload = async (file: any, presignedPutUrl: any) => {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedPutUrl, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(file);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(true);
        } else {
          reject(xhr.status);
        }
      }
    };
  });
};

export const createCardEntry = async (
  cardId: any,
  url: any,
  fileMetaData: any,
  thumbnailUrl: any
) => {
  return await http.post(`/entries`, {
    cardId: cardId,
    url: url,
    thumbnailUrl: thumbnailUrl,
    metadata: {
      name: fileMetaData.name,
      fileType: fileMetaData.type,
      size: fileMetaData.size,
      videoHeight: fileMetaData.videoHeight,
      videoWidth: fileMetaData.videoWidth,
    },
  });
};

export const createAnonymousEntry = async (
  cardId: any,
  url: any,
  fileMetaData: any,
  thumbnailUrl: any,
  invitedUser: any
) => {
  const code = localStorage.getItem("uniqueCode")
  try {
    const response = await get.post(`/entries/cardentry`, {
      cardId: cardId,
      url: url,
      thumbnailUrl: thumbnailUrl,
      metadata: {
        name: fileMetaData.name,
        fileType: fileMetaData.type,
        size: fileMetaData.size,
        videoHeight: fileMetaData.videoHeight,
        videoWidth: fileMetaData.videoWidth,
      },
      invitedUser: invitedUser,
      unauthUser:  code
    });
    localStorage.setItem("anonymousEntry", JSON.stringify(response?.data));

    return response;
  } catch (e) {
    console.log(e);
  }
};

export const deleteCardEntryImage = async (entryId: any) => {
  return await http.delete(`/entries/${entryId}`);
};

export const dropzoneS3Upload = async (file: any, cardId: any) => {
  console.log("dropzoneS3Upload ");

  let ext = getExtension(file.name);
  let uploadKey = `cards/${cardId}/${uuidv4()}.${ext}`;

  try {
    let s3Data = await getPresignedUrl(uploadKey, file.type);
    await presignedUpload(file, s3Data.uploadUrl);
    let responseEntry = await createCardEntry(
      cardId,
      s3Data.fileUrl,
      file,
      null
    );
    return responseEntry.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const dropzoneS3UploadUnauth = async (
  file: any,
  cardId: any,
  invitedUser: any
) => {
  console.log("dropzoneS3Upload ");
  let ext = getExtension(file.name);
  let uploadKey = `cards/${cardId}/${uuidv4()}.${ext}`;

  try {
    let s3Data = await getPresignedUrl(uploadKey, file.type);
    await presignedUpload(file, s3Data.uploadUrl);
    let responseEntry = await createAnonymousEntry(
      cardId,
      s3Data.fileUrl,
      file,
      null,
      invitedUser
    );
    return responseEntry?.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
