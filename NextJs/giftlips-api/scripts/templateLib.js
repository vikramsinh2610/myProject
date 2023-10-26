const fs = require("fs");
const { parse } = require("csv-parse");
const path = require("path");
const AWS = require("aws-sdk");
const Template = require("../api/templates/template.model");
const { slugify } = require("../utils");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const fileName = "outsourced-set-2.csv";

const runImport = () => {
  const csvFilePath = path.resolve(__dirname, `../templateLib/${fileName}`);

  fs.createReadStream(csvFilePath)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", doRunImport)
    .on("end", () => console.log("finished"))
    .on("error", (error) => console.log(error.message));
};

const doRunImport = async (row) => {
  const thumbnail = fs.readFileSync(
    path.resolve(__dirname, `../templateLib/${row[8]}`)
  );

  const uploadThumbnail = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `templates/${row[8]}`,
      Body: thumbnail,
      ACL: "public-read",
      ContentType: "image/jpg",
    })
    .promise();

  console.log(uploadThumbnail.Key);

  const svg = fs.readFileSync(
    path.resolve(__dirname, `../templateLib/${row[4]}`)
  );

  const uploadSvg = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `templates/${row[4]}`,
      Body: svg,
      ACL: "public-read",
      ContentType: "image/svg+xml",
    })
    .promise();

  console.log(uploadSvg.Key);

  let logoUrl = "";

  if (row[12] !== "") {
    const logo = fs.readFileSync(
      path.resolve(__dirname, `../templateLib/${row[12]}`)
    );

    const uploadLogo = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `templates/logo/${row[12]}`,
        Body: logo,
        ACL: "public-read",
        ContentType: "image/png",
      })
      .promise();

    logoUrl = `${process.env.CLOUDFRONT_URL}/${uploadLogo.Key}`;

    console.log(uploadLogo.Key);
  }

  const qrProps = JSON.parse(row[13]);

  try {
    await Template.findOneAndUpdate(
      {
        coverUrl: `${process.env.CLOUDFRONT_URL}/${uploadThumbnail.Key}`,
      },
      {
        assets: [{ url: `${process.env.CLOUDFRONT_URL}/${uploadSvg.Key}` }],
        width: row[5],
        height: row[6],
        orientation: row[7],
        slug: slugify(row[1]),
        title: row[1],
        description: row[2],
        keywords: row[3],
        isEnabled: true,
        categories: JSON.parse(row[0]),
        // position: 0,
        qr: {
          coreAttributes: {
            backgroundColor: qrProps.backgroundColor,
            logo: logoUrl,
            transparentBackground: qrProps.transparentBkg,
          },
          patternAttributes: {
            pattern: qrProps.qrData,
            colorDark: qrProps.colorDark,
            color1: qrProps.color01,
            color2: qrProps.color02,
          },
          eyeAttributes: {
            eyeInner: qrProps.eye_inner,
            eyeOuter: qrProps.eye_outer,
            customEyeColor: qrProps.eye_color,
            color1: qrProps.eye_color01,
            color2: qrProps.eye_color02,
          },
          frameAttributes: {
            frame: qrProps.frame,
            text: qrProps.frameText,
            font: qrProps.frametextFont,
            color1: qrProps.frameColor,
            color2: qrProps.frameColor2,
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { runImport };
