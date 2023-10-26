const Entry = require("./entry.model");
const { userCanUploadEntry } = require("./entry.service");
const Card = require("../cards/card.model");
const mongoose = require("mongoose");
const CardMember = require("../cardMembers/cardMember.model");
const { logActivity } = require("../activityLogs/activityLog.service");
const { LIKE_VIDEO, UPLOAD, UNLIKE_VIDEO, COMMENT } = require("../activityLogs/constants");
const User = require("../users/user.model");
const notifier = require("node-notifier");
const { error } = require("shelljs");

const deleteEntry = async (req, res) => {
  const { entryId } = req.params;
  try {
    if (!entryId) {
      return res.status(400).json({
        success: false,
        message: "Please enter requied details."
      })
    }
    const item = await Entry.findById(entryId);
    item.isDeleted = true;
    const saveData = await item.save();
    if(saveData) {
      await Card.findByIdAndUpdate(item.cardId, { $pullAll: {entries: [entryId]}})
      res.json(item);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json("Failed");
  }
};

const getEntries = async (req, res) => {
  const user = req.auth;
  try {
    let { cardId } = req.query;
    if (cardId.length < 5) {
      let card = await Card.findOne({ shortId: cardId });
      cardId = card._id;
    }
    let entries = await Entry.find({ cardId: cardId }).populate({
      path: "userId",
      select: "email firstName lastName _id",
    });
    res.json(entries);
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

const createEntry = async (req, res) => {
  const user = req.auth;
  const { cardId, url, metadata, thumbnailUrl } = req.body;
  // let membership = await CardMember.findOne({
  //   cardId: cardId,
  //   userId: user?.sub,
  // });
  // console.log("user====>",membership);
  // if (userCanUploadEntry(membership)) {
    let entry = await Entry.create({
      userId: user?.sub,
      cardId: cardId,
      metadata,
      url,
      thumbnailUrl
    });
    // membership.usage.videos++;
    // await membership.save();

    if (entry) {
      const notify = await Entry.findOne({ cardID: entry.cardId }).populate(
        "userId"
      );

      let cardTitle = await Card.findOne({
        cardID: cardId
      });
      const organizer = notify.userId._id;
      const updateUserDetails = await User.findByIdAndUpdate(
        organizer,
        {
          $push: {
            notify: {
              userId: organizer,
              entryId: notify._id,
              cardId: notify.cardId,
            },
          },
        },
        { upsert: true, new: true }
      );

      if (updateUserDetails) {
        notifier.notify({
          title: cardTitle.title,
          message: "Video was successfully uploaded",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Somthing went wrong" });
      }
      // Add entry ID to card record
      await Card.findByIdAndUpdate(
        cardId,
        { $push: { entries: entry._id } },
        { upsert: true }
      );
    }

    await logActivity({
      cardId: cardId,
      actorId: user.sub,
      type: UPLOAD,
      entry,
    });
    res.json(entry);
  // } else {
  //   res.status(400).json({
  //     detail: "User upload limit reached. Please upgrade your plan.",
  //     code: "LIMIT_EXCEEDED",
  //   });
  // }
};

const createEntryforUnauth = async (req, res) => {
  const { cardId, url, metadata, thumbnailUrl, userid } = req.body;
  const user = userid;
    let entry = await Entry.create({
      userId: user,
      cardId: cardId,
      metadata,
      url,
      thumbnailUrl
    });
    if (entry) {
      const notify = await Entry.findOne({ cardID: entry.cardId }).populate(
        "userId"
      );

      let cardTitle = await Card.findOne({
        cardID: cardId,
        userId: user,
      });
      const organizer = notify.userId;
      const updateUserDetails = await User.findByIdAndUpdate(
        organizer,
        {
          $push: {
            notify: {
              userId: organizer,
              entryId: notify._id,
              cardId: notify.cardId,
            },
          },
        },
        { upsert: true, new: true }
      );
        
      if (updateUserDetails) {
        notifier.notify({
          title: cardTitle.title,
          message: "Video was successfully uploaded",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Somthing went wrong" });
      }
      // Add entry ID to card record
      await Card.findByIdAndUpdate(
        cardId,
        { $push: { entries: entry._id } },
        { upsert: true }
      );
    }

    await logActivity({
      cardId: cardId,
      actorId: user,
      type: UPLOAD,
      entry,
    });
    res.json(entry);
  // } else {
  //   res.status(400).json({
  //     detail: "User upload limit reached. Please upgrade your plan.",
  //     code: "LIMIT_EXCEEDED",
  //   });
  // }
};



const updateEntry = async (cardId, userId, entryId, cardMemberId) => {
  console.log(`cardId: ${cardId}`);
  console.log(`userId: ${userId}`);
  console.log(`entryId: ${entryId}`);
  console.log(`cardMemberId: ${cardMemberId}`);
  try {
    let likeFlag;
    if (!cardId && !userId && !entryId && !cardMemberId) {
      return {
        success: false,
        message: "Please enter required details.",
      };
    }
    const check = await Card.find({
      $and: [{ _id: cardId }, { members: { $in: [cardMemberId] } }],
    });
    const isalreadyLikedOrNot = await Entry.find({
      $and: [{ _id: entryId }, { like: { $in: [userId] } }],
    });
    console.log(`check: ${check}`);
    console.log(`isalreadyLikedOrNot: ${isalreadyLikedOrNot}`);
    if (check && check.length > 0) {
      if (isalreadyLikedOrNot && isalreadyLikedOrNot.length > 0) {
        likeFlag = 0;
      } else {
        likeFlag = 1;
      }
      if (likeFlag === 1) {
        const entry = await Entry.findByIdAndUpdate(
          entryId,
          {
            $push: { like: userId },
          },
          { upsert: true, new: true }
        );
        if (entry) {
          await logActivity({
            cardId: cardId,
            actorId: userId,
            type: LIKE_VIDEO,
          });
          return {
            success: true,
            message: "Video is liked.",
            data: { entryId: entry._id, videoCount: entry.like.length },
          };
        }
      } else if (likeFlag === 0) {
        const entry = await Entry.findByIdAndUpdate(
          entryId,
          {
            $pullAll: { like: [userId] },
          },
          { new: true }
        );
        if (entry) {
          await logActivity({
            cardId: cardId,
            actorId: userId,
            type: UNLIKE_VIDEO,
          });
          return {
            success: true,
            message: "Video is unliked.",
            data: { entryId: entry._id, videoCount: entry.like.length },
          };
        }
      }
    } else {
      return {
        success: false,
        message: "Not a member of card",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

const addComment = async (cardId, userId, entryId, cardMemberId, comments) => {
  try {
    if (
      !cardId &&
      !userId &&
      !entryId &&
      !cardMemberId &&
      !comments &&
      !comments.user &&
      !comments.message
    ) {
      return {
        success: false,
        message: "Please enter required details.",
      };
    }

    const checkMemberOrNot = await Card.find({
      $and: [{ _id: cardId }, { members: { $in: [cardMemberId] } }],
    });

    if (checkMemberOrNot && checkMemberOrNot.length > 0) {
      const entry = await Entry.findByIdAndUpdate(
        entryId,
        {
          $push: {
            comments: { user: comments.user, message: comments.message },
          },
        },
        { upsert: true, new: true }
      ).populate("comments.user");
      if (entry) {
        await logActivity({
          cardId: cardId,
          actorId: userId,
          type: COMMENT,
        });
        return {
          success: true,
          data: { entryId: entry._id, comments: entry.comments },
        };
      } else {
        return {
          success: false,
          message: "Something went wrong to add comment",
        };
      }
    } else {
      return {
        success: false,
        message: "Not a member of card",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

const get = async (req, res) => {
  const { entryId } = req.params;

  if (!entryId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required parameter 'entryId'." });
  }

  try {
    const entry = await Entry.findById(entryId);
    return res.status(200).json({ status: true, data: entry });
  } catch (error) {
    return res.status(500).json({ status: false, message: error });
  }
};

const getLikes = async (req, res) => {
  const { entryId } = req.params;
  try {
    if (!entryId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required data.",
      });
    }
    const entry = await Entry.findById(entryId).populate("like");
    if (entry) {
      return res.status(200).json({
        success: true,
        data: { entryId: entry._id, like: entry.like },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const getComments = async (req, res) => {
  const { entryId } = req.params;
  try {
    if (!entryId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required data.",
      });
    }
    const entry = await Entry.findById(entryId).populate("comments.user");
    if (entry) {
      return res.status(200).json({
        success: true,
        data: { entryId: entry._id, comments: entry.comments },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  getEntries,
  createEntry,
  createEntryforUnauth,
  deleteEntry,
  updateEntry,
  addComment,
  get,
  getLikes,
  getComments,
};
