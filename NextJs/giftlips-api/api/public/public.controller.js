const { S3 } = require("aws-sdk");
const Card = require("../cards/card.model");
const Template = require("../templates/template.model");
const dotenv = require("dotenv");
const axios = require("axios");
const { UidGenerator } = require("../../utils/index");

dotenv.config();
const s3Opt = {
  useAccelerateEndpoint: true,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Put you accessKeyId
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Put you accessKeyId
  Bucket: process.env.AWS_S3_BUCKET, // Put your bucket name
  signatureVersion: "v4",
  region: process.env.AWS_S3_REGION, // Put you region
};
console.log(s3Opt);
const s3 = new S3(s3Opt);

const getSignedPutUrl = async (key, type = null) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: 60 * 5,
    ACL: "public-read",
  };
  if (type) {
    params["ContentType"] = type;
  }

  try {
    return await s3.getSignedUrlPromise("putObject", params);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const download = async (req, res) => {
  const { url } = req.body;
  const response = await axios.get(url);
  return res.json({ data: response.data });
};

const sign = async (req, res) => {
  const { uploadKey, type } = req.body;
  let fileUrl = await getSignedPutUrl(uploadKey, type);
  res.json({
    uploadUrl: fileUrl,
    fileUrl: `${process.env.CLOUDFRONT_URL}/${uploadKey}`,
  });
};

const generateShortId = async (req, res) => {
  let encoded_uid;
  const _encode = async () => {
    const uid = UidGenerator();
    const card = await Card.find({ shortId: uid });
    if (card && card.length > 0) {
      _encode();
    } else {
      encoded_uid = uid;
    }
  };
  await _encode();
  res.json({ shortId: encoded_uid });
};

const getQr = async (req, res) => {
  const { shortId } = req.params;
  const item = await Card.findOne({ shortId }).populate("entries template");
  if (item) {
    res.json(item);
  } else {
    res.status(404).json("Not found");
  }
};

module.exports = {
  generateShortId,
  sign,
  download,
  getQr,
};
