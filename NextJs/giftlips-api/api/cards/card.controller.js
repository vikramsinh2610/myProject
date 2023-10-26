const CardService = require("./card.service");
const Entry = require("../entries/entry.model");
const Card = require("./card.model");
const Template = require("../templates/template.model");
const CardInvite = require("../cardInvites/cardInvite.model");
const { UidGenerator } = require("../../utils/index");
const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const PDFDocument = require("pdfkit");
const shell = require("shelljs");
const { config } = require("../../config/index");
const moment = require("moment");
const CardMember = require("../cardMembers/cardMember.model");
const { SIZES } = require("../../utils/pdfkitPageSizes");
const { logActivity } = require("../activityLogs/activityLog.service");
const { CREATE, JOIN } = require("../activityLogs/constants");

const list = async (req, res) => {
  try {
    const user = req.auth;
    const query = {
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
    };
    let filters;

    if (req.query.status) {
      filters = req.query.status;
    }

    const paginated = await Card.paginate(
      {
        $or: [
          { userId: req.query.userId ? req.query.userId : user.sub },
          { members: { $in: [user.sub] } },
          { status: filters },
        ],
      },
      {
        ...query,
        populate: [
          "template members entries userId",
          {
            path: "members",
            populate: {
              path: "userId",
              select: { _id: 1, firstName: 1, lastName: 1, profilePhoto: 1 },
            },
          },
        ],
        sort: { updatedAt: -1 },
      }
    );
    res.json(paginated);
  } catch (e) {
    res.status(500).json({ detail: "ERROR" });
  }
};

const get = async (req, res) => {
  try {
    // let auth = req.auth;
    const { cardId } = req.params;
    let item;
    if (cardId.length <= 5) {
      item = await Card.findOne({ shortId: cardId })
        .populate("entries template members")
        .populate({
          path: "members",
          // match: { userId: auth?.sub },
        });
    } else {
      item = await Card.findById(cardId)
        .populate("entries template members")
        .populate({
          path: "members",
          // match: { userId: auth?.sub },
          justOne: true,
        });
    }
    if (item) {
      res.json(item);
    } else {
      res.status(404).json("Not found");
    }
  } catch (e) {
    res.status(500);
  }
};

const getcard = async (req, res) => {
  try {
    // let auth = req.auth;
    const { cardId } = req.params;
    let item;
    if (cardId.length <= 5) {
      item = await Card.findOne({ shortId: cardId });
    } else {
      item = await Card.findById(cardId);
    }
    if (item) {
      res.json(item);
    } else {
      res.status(404).json("Not found");
    }
  } catch (e) {
    res.status(500);
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.template) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details.",
      });
    }

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
    const assetsData = await Template.findById(data.template, "assets");

    if (!assetsData) {
      return res.status(400).json({
        success: false,
        message: "Didn't get assets",
      });
    }

    const item = await CardService.create({
      userId: data.userId,
      shortId: data.shortId ? data.shortId : encoded_uid,
      title: data.title,
      description: data.description,
      template: data.template,
      assets: assetsData.assets[0] ? [{ url: assetsData.assets[0].url }] : [],
    });

    await Template.findByIdAndUpdate(
      data.template,
      {
        $inc: { popular: 1 },
      },
      { upsert: true }
    );

    if (item.userId) {
      const cardMemberDetails = await CardMember.create({
        userId: req.body.userId,
        cardId: item._id,
        limits: { videos: 5 },
      });
      let cardDetails;

      if (cardMemberDetails) {
        cardDetails = await Card.findByIdAndUpdate(
          item._id,
          {
            $push: { members: cardMemberDetails._id },
          },
          { upsert: true, new: true }
        );
      }

      await logActivity({
        cardId: item._id,
        actorId: req.body.userId,
        type: CREATE,
      });

      if (cardDetails) {
        return res.status(200).json({ success: true, data: cardDetails });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Somthing went wrong" });
      }
    }

    if (item) {
      return res.status(200).json({ success: true, data: item });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Somthing went wrong" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const createEmptyCards = async (req, res) => {
  try {
    const user = req.auth;
    let data = req.body;
    if (!data.title && !data.template) {
      return res
        .status(400)
        .json({ success: false, message: "Somthing went wrong" });
    }
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
    const assetsData = await Template.findById(data.template, "assets");
    if (!assetsData) {
      return res.status(400).json({
        success: false,
        message: "Didn't get assets",
      });
    }
    const emptycards = await Card.create({
      shortId: data.shortId ? data.shortId : encoded_uid,
      title: data.title,
      description: data.description,
      template: data.template,
      assets: [
        {
          url: assetsData.assets[0].url || [],
        },
      ],
    });

    if (emptycards) {
      return res.status(200).json({ success: true, data: emptycards });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Somthing went wrong" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const emptyCardDetails = async (req, res) => {
  const user = req.auth;
  const { cardId } = req.params;
  try {
    const item = await Card.findById(cardId);
    if (item) {
      const emptyCardMemberDetails = await CardMember.create({
        userId: user?.sub,
        cardId: item._id,
      });
      let emptyCardDetails;
      if (emptyCardMemberDetails) {
        emptyCardDetails = await Card.findByIdAndUpdate(
          item._id,
          {
            $push: { members: emptyCardMemberDetails._id },
            $set: { userId: user.sub },
          },
          { upsert: true, new: true }
        );
      }
      if (emptyCardDetails) {
        return res.status(200).json({ success: true, data: emptyCardDetails });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Somthing went wrong" });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "CardId is not valid.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const claimCard = async (req, res) => {
  const user = req.auth;
  const { cardId } = req.params;
  try {
    let videoLimit = 1;
    const item = await Card.findById(cardId);
    if (!item.userId) {
      item.userId = user?.sub;
      await item.save();
      videoLimit = 5;
      await logActivity({
        cardId,
        actorId: user?.sub,
        type: CREATE,
      });
    } else {
      await logActivity({
        cardId,
        actorId: user?.sub,
        type: JOIN,
      });
    }
    let isMember = await CardMember.exists({
      userId: user?.sub,
      cardId: item._id,
    });
    if (!isMember) {
      await CardMember.create({
        userId: user?.sub,
        cardId: item._id,
        limits: { videos: videoLimit },
      });
    }

    res.json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const createEntry = async (req, res) => {
  const user = req.auth;
  const { cardId } = req.params;
  const { url } = req.body;
  try {
    await Entry.create({
      userId: user?.sub,
      cardId: cardId,
      url,
    });
    res.json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const deleteEntry = async (req, res) => {
  const { id, entryId } = req.params;
  try {
    const card = await Card.findById(id);
    card.entries.remove(entryId);
    await card.save();

    const item = await Entry.findById(entryId);
    item.isDeleted = true;
    item.save();
    res.json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const createPublicEntry = async (req, res) => {
  const { shortId } = req.params;
  const { url } = req.body;
  try {
    const item = await Card.findOne({ shortId });
    const newEntry = await Entry.create({ url });
    item.entries.push(newEntry);
    await item.save();
    res.json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const setAssets = async (req, res) => {
  const user = req.auth;
  const { id } = req.params;
  const { assets, variables } = req.body;
  try {
    let parsedAssets = assets.map((asset) => {
      return { url: asset.url, variables: asset.variables };
    });
    const item = await Card.findById(id);
    item.coverUrl = parsedAssets[0].url;
    item.variables = variables;
    item.assets = parsedAssets;
    await item.save();
    const updatedItem = await Card.findById(id).populate("entries template");
    res.json(updatedItem);
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const setPublished = async (req, res) => {
  const user = req.auth;
  const { cardId } = req.params;
  const { assets } = req.body;
  try {
    const item = await Card.findById(cardId);
    item.status = "published";
    if (
      item.stripe.subscriptionId &&
      item.stripe.subscriptionStatus === "active"
    ) {
      item.expiryAt = moment().add(1, "year");
    } else {
      item.expiryAt = moment().add(21, "days");
    }
    await item.save();
    res.json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const fetchUrlAsBuffer = async (assets) => {
  let promises = [];
  for (const asset of assets) {
    promises.push(await axios.get(asset.url, { responseType: "arraybuffer" }));
  }
  return (await Promise.all(promises)).map((response) => response.data);
};

const downloadAsPng = async (
  assets,
  resize = 4,
  width = config.card.defaultWidth,
  height = config.card.defaultHeight
) => {
  let promises = [];
  for (const asset of assets) {
    promises.push(
      await sharp(asset)
        .resize({ width: width * resize, height: height * resize })
        .png({ palette: true })
        .withMetadata({ density: 300 })
        .toBuffer()
    );
  }
  return await Promise.all(promises);
};

const zipData = async (buffers, ext) => {
  var zip = new AdmZip();
  buffers.forEach((buffer, index) => {
    zip.addFile(`page-${index}.${ext}`, buffer);
  });
  return zip.toBuffer();
};

const downloadAsJpg = async (
  assets,
  resize = 4,
  quality = 100,
  width = config.card.defaultWidth,
  height = config.card.defaultHeight
) => {
  let promises = [];
  for (const asset of assets) {
    promises.push(
      await sharp(asset)
        .resize({ width: width * resize, height: height * resize })
        .jpeg({
          quality: quality,
        })
        .withMetadata({ density: 300 })
        .toBuffer()
    );
  }
  return await Promise.all(promises);
};

let RESPONSE_CONTENT_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
  svg: "image/svg+xml",
};

const _download = async (res, buffers, file_type) => {
  if (buffers.length === 1) {
    res.setHeader("content-type", RESPONSE_CONTENT_TYPES[file_type]);
    res.send(buffers[0]);
  } else {
    let zipBuffer = await zipData(buffers, file_type);
    res.setHeader("content-type", "application/zip");
    res.send(zipBuffer);
  }
};

const fontConfigTemplate = (fontPath) => `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontPath}</dir>
  <cachedir>/tmp/fonts-cache/</cachedir>
  <config></config>
</fontconfig>
`;

const enableCustomFonts = () => {
  // Create the font config file
  const fontDir = path.resolve(path.join(__dirname, "../../", "fonts"));
  // console.log(fontDir);
  fs.writeFileSync(
    path.join(fontDir, "fonts.conf"),
    fontConfigTemplate(fontDir)
  );
  // Set the environment variable path
  process.env.FONTCONFIG_PATH = fontDir;
  process.env.PANGOCAIRO_BACKEND = "fontconfig";
  // Set font config debugging to true
  process.env.FC_DEBUG = "1";
  console.log(shell.exec("fc-list").stdout);
};

enableCustomFonts();

const download = async (req, res) => {
  enableCustomFonts();

  const { id } = req.params;
  const resize = 1;
  const { file_type = "png", jpeg_quality = 100, pageSize = "A5" } = req.body;
  let buffers;

  try {
    const item = await Card.findById(id).populate("template");
    let itemWidth = item.template.width || config.card.defaultWidth;
    let itemHeight = item.template.height || config.card.defaultHeight;
    let pageOrientation = item.template.orientation || "portrait";
    // let pageSize = item.template.pageSize || "A5";
    let data = await fetchUrlAsBuffer(item.assets);

    if (file_type === "png") {
      buffers = await downloadAsPng(data, resize, itemWidth, itemHeight);
      await _download(res, buffers, file_type);
    } else if (file_type === "jpeg") {
      buffers = await downloadAsJpg(
        data,
        resize,
        jpeg_quality,
        itemWidth,
        itemHeight
      );
      await _download(res, buffers, file_type);
    } else if (file_type === "pdf") {
      buffers = await downloadAsJpg(data, resize, 100, itemWidth, itemHeight);
      res.setHeader("content-type", "application/pdf");

      const doc = new PDFDocument({
        size: pageSize,
        layout: pageOrientation,
        autoFirstPage: false,
      });
      doc.pipe(res);

      let imageDimensions = [SIZES[pageSize][0], SIZES[pageSize][1]];
      if (pageOrientation === "landscape") {
        imageDimensions = [SIZES[pageSize][1], SIZES[pageSize][0]];
      }
      buffers.forEach((buffer) => {
        doc.addPage();
        doc.image(buffer, 0, 0, {
          width: imageDimensions[0],
          height: imageDimensions[1],
        });
      });
      doc.end();
    } else if (file_type === "svg") {
      await _download(res, data, file_type);
    } else {
      res.status(400).json({ error: "Wrong format" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const put = async (req, res) => {
  const { cardId } = req.params;
  const item = await CardService.updateById(cardId, req.body);
  if (item) {
    res.json(item);
  } else {
    res.status(400).json("Error");
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;
  const item = await CardService.findById(id);
  if (!item) {
    res.status(400).json("Error");
  } else if (item && item.status === "published") {
    res.status(400).json({ detail: "Error. Card is already published." });
  } else {
    item.isDeleted = true;
    await item.save();
    res.json("OK");
  }
};

const createCardInvitations = async (req, res) => {
  const { id } = req.params;
  const item = await CardService.updateById(id, { isDeleted: true });
  if (item) {
    res.json(item);
  } else {
    res.status(400).json("Error");
  }
};

const listInvited = async (req, res) => {
  try {
    const { email } = req.auth;
    const { limit = 10, offset = 0 } = req.query;

    const cardInvites = await CardInvite.find(
      { email, accepted: false },
      "cardId"
    );

    const paginated = await Card.paginate(
      { _id: { $in: cardInvites.map((i) => i.cardId) } },
      { limit, offset }
    );
    res.json(paginated);
  } catch (e) {
    res.status(500).json({ detail: "ERROR" });
  }
};

const members = async (req, res) => {
  const { cardId } = req.params;

  try {
    const members = await CardInvite.find({ cardId, accepted: true });
    return res.json(members);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

module.exports = {
  list,
  create,
  get,
  getcard,
  put,
  deleteItem,
  deleteEntry,
  createEntry,
  createPublicEntry,
  setAssets,
  setPublished,
  download,
  createCardInvitations,
  listInvited,
  members,
  claimCard,
  createEmptyCards,
  emptyCardDetails,
};
