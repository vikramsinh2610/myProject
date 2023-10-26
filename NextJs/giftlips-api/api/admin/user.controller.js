const User = require("../users/user.model");
const Card = require("../cards/card.model");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const list = async (req, res) => {
  const { search, page, limit, isStaff } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { email: { $regex: search } },
        { firstName: { $regex: search } },
        { lastName: { $regex: search } },
      ],
    };
  }
  query = {
    isStaff: isStaff
  }
  
  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    sort: { updatedAt: -1 },
    projection: {
      password: 0,
    },
  };

  try {
    const users = await User.paginate(query, options);
    return res.json(users);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const update = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { ...data });
    return res.json(user);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const cards = async (req, res) => {
  const { userId } = req.params;
  const { search, page, limit } = req.query;
  let query = { userId };

  if (search) {
    query = {
      userId,
      $or: [
        { title: { $regex: search } },
        { description: { $regex: search } },
        { status: { $regex: search } },
      ],
    };
  }

  const options = {
    limit: parseInt(limit) || 10,
    page: parseInt(page) || 1,
    sort: { updatedAt: -1 },
    populate: "template",
  };

  try {
    const cards = await Card.paginate(query, options);
    return res.json(cards);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

const userStatistics = async(req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if(!startDate && !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details."
      });
    }

    const start = moment(startDate, "DD-MM-YYYY")
    const end = moment(endDate, "DD-MM-YYYY")

    const getAllDatesBetweenTwoDates = (start, end) => {
      let now = start.clone();
      let dateList = [];

      while(now.isSameOrBefore(end)) {
        dateList.push(now.format('DD-MM-YYYY'));
        now.add(1, "days");
      }

      return dateList;
    }

    const allDates = getAllDatesBetweenTwoDates(start, end);
    const userDetails = await User.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    });
    let finalData = [];

    if (userDetails.length > 0) {
      allDates.map((e, i) => {
        let count = 0;

        userDetails.map((q) => {
          let created = moment(q.createdAt).format('DD-MM-YYYY');
          if(created === e) {
            count++;
            const alreadyExist = finalData.find(s => s.date === e);
            if (alreadyExist) {  
              alreadyExist.count = count;
            } else {
              finalData.push({date: e, count: count})
            }
          }
        })

        const alreadyExist = finalData.find(s => s.date === e);

        if (!alreadyExist) {
          finalData.push({date: e, count: 0})
        }
      })
      
      return res.status(200).json({
        success: true,
        data: userDetails,
        count: userDetails.length,
        dates: finalData
      })
    } else {
      return res.status(200).json({
        success: false,
        data:[],
        message: "No data found."
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    });
  }
}

const updateProfile = async (req, res) => {
  try {
    let user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Didn't find user details."
      })
    }

    const updateDetails = await User.findByIdAndUpdate(user.id, req.body, { upsert: true });

    if (updateDetails) {
      return res.status(200).json({
        success: true,
        message: "Details updated successfully.",
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details."
      });
    }

    const userDetails = await User.findById(id);
    if (userDetails) {
      return res.status(200).json({
        success: true,
        data: userDetails
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Didn't find user details."
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter required details."
      })
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Didn't find user details."
      })
    }
    const matched = await bcrypt.compare(oldPassword, user.password);
    if (matched) {
      const updatePassword = await User.findByIdAndUpdate(req.auth.sub, {$set: {
        password: bcrypt.hashSync(newPassword, Number(process.env.BCRYPT_SALT))
      }})

      if (updatePassword) {
        return res.status(200).json({
          success: true,
          message: "Password is successfully updated."
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please enter correct password."
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  list,
  update,
  cards,
  userStatistics,
  updateProfile,
  getProfile,
  changePassword
};
