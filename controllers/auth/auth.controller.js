const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../../models/User");
const Artwork = require('../../models/Artwork')
const Collection = require('../../models/Collection')
const Video = require("../../models/Video")
const Notification = require('../../models/Notification')
const Chat = require('../../models/Chat')
const Message = require("../../models/Message");
const deleteFile = require('../../utils/deleteFile')
const sendEmail = require('../../utils/sendEmail')
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

const web_host_url = process.env.Dev_Mode == "true" ? process.env.WEB_HOST_Dev : process.env.WEB_HOST;

async function verifyGoogleToken(token) {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    return { payload: ticket.getPayload() };
  } catch (error) {
    // return { error: "Invalid user detected. Please try again" };
    return error;
  }
}

//Welcome function
exports.Welcome = async (req, res) => {
  try {

    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({ status: false, message: 'Authorization token missing' })
    }

    const accessToken = authorization.split(' ')[1];
    const data = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: data.userId })
      .populate("jobCategory")
      .exec();

    if (!user) {
      return res.status(401).send({ status: false, message: 'Invalid authorization token' });
    }

    const filter = { _id: data.userId }
    const update = { lastVisitedAt: Date() }
    let doc = await User.findOneAndUpdate(filter, update, { new: true });

    return res.status(200).send({ status: true, user: user });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

// Login function
exports.SignIn = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    let user = await User.findOne({ email: email, isDeleted: false })
      .populate("jobCategory")
      .exec();

    if (!user) {
      return res.status(400).send({ status: false, code: 1, message: "User doesn't exist" });
    }

    if (user.isBlocked == true) {
      return res.status(400).send({ status: false, code: 2, message: "Blocked" });
    }

    if (user.isVerified == false) {
      return res.status(400).send({ status: false, code: 3, message: "Not Verified" });
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(400).send({ status: false, message: 'Invalid password!' })

    const filter = { email: email }
    const update = { lastVisitedAt: Date() }
    let doc = await User.findOneAndUpdate(filter, update, { new: true });

    let accessToken;
    if (remember == true) {
      accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN_remember });
    } else {
      accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN_onetime });
    }

    return res.status(200).send({
      status: true,
      message: "Login Successfully.",
      user: user,
      accessToken: accessToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

// Login function with Google
exports.SignInWithGoogle = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    const verificationResponse = await verifyGoogleToken(tokens?.id_token);
    const payload = verificationResponse.payload;
    const password = payload.sub

    console.log("payload=>>", payload)

    let user = await User.findOne({ email: payload.email, isDeleted: false })
      .populate("jobCategory")
      .exec();

    if (!user) {
      return res.status(200).send({ status: false, code: 1, message: "User doesn't exist" });
    }

    if (user.isBlocked == true) {
      return res.status(200).send({ status: false, code: 2, message: "Blocked" });
    }

    if (user.isVerified == false) {
      return res.status(200).send({ status: false, code: 3, message: "Not Verified", email: payload.email });
    }

    // const isValid = await bcrypt.compare(password, user.password)
    // if (!isValid) return res.status(400).send({ status: false, message: 'Invalid password!' })

    const filter = { email: payload.email }
    const update = { lastVisitedAt: Date() }
    let doc = await User.findOneAndUpdate(filter, update, { new: true });

    let accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN_remember });

    return res.status(200).send({
      status: true,
      message: "Login Successfully.",
      user: user,
      accessToken: accessToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

// Register function
exports.SignUp = async (req, res) => {
  const { role, fullName, email, screenName, password, subscribe, } = req.body;
  try {
    let user = await User.findOne({
      isDeleted: false,
      $or: [{ email }, { screenName }]
    });

    if (user) {
      if (user.screenName === screenName) {
        return res.status(400).send({ status: false, message: 'ScreenName already exists' });
      } else if (user.email === email) {
        return res.status(400).send({ status: false, message: 'Email already exists' });
      } else if (user.isBlocked == true) {
        return res.status(400).send({ status: false, message: 'Blocked' });
      }
    }

    const verifyToken = crypto.randomBytes(20).toString("hex");
    const emailVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    const emailVerifyExpiry = Date.now() + 15 * 60 * 1000;

    const emailVerifyUrl = `${web_host_url}/signup/email-verify/${verifyToken}`;

    user = new User({
      role: role,
      fullName: fullName,
      email: email,
      screenName: screenName,
      password: password,
      subscribe: subscribe,
      emailVerifyToken: emailVerifyToken,
      emailVerifyExpiry: emailVerifyExpiry
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: {
        name: user.fullName,
        emailVerifyUrl: emailVerifyUrl
      }
    });

    return res.status(200).send({ status: true, message: "Register Successfully.", });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

// Register function with Google
exports.SignUpWithGoogle = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    const verificationResponse = await verifyGoogleToken(tokens?.id_token);
    const payload = verificationResponse.payload;

    console.log("payload=>>", payload)

    let userExists = await User.findOne({
      isDeleted: false,
      $or: [{ email: payload.email }]
    });

    if (userExists) {
      if (userExists.email === payload.email) {
        return res.status(400).send({ status: false, message: 'Email already exists' });
      } else if (userExists.isBlocked == true) {
        return res.status(400).send({ status: false, message: 'Blocked' });
      }
    }

    const verifyToken = crypto.randomBytes(20).toString("hex");
    const emailVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    const emailVerifyExpiry = Date.now() + 15 * 60 * 1000;
    const emailVerifyUrl = `${web_host_url}/signup/email-verify/${verifyToken}`;

    const user = new User({
      role: "client",
      fullName: payload.name,
      email: payload.email,
      screenName: payload.email,
      password: payload.sub,
      subscribe: true,
      emailVerifyToken: emailVerifyToken,
      emailVerifyExpiry: emailVerifyExpiry
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(payload.sub, salt);

    await user.save();

    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: {
        name: user.fullName,
        emailVerifyUrl: emailVerifyUrl
      }
    });

    return res.status(200).send({ status: true, message: "Register Successfully.", email: payload.email });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

//Update Profile function
exports.UpdateProfile = async (req, res) => {
  try {
    let { _id, role, fullName, email, showEmail, screenName, clientJob, jobCategory, country,
      state, city, address, phoneNumber, personalLink, zipCode, birthday, about, avatarUrl, coverImg } = req.body;

    let userExists = await User.findOne({
      isDeleted: false,
      $or: [{ email }, { screenName }]
    });

    if (userExists && userExists._id.toString() !== _id.toString()) {
      return res.status(404).send({ status: false, message: 'User Already Exists' });
    }

    if (userExists.avatarUrl !== "" && req.files?.avatarUrl) {
      await deleteFile('avatar/', userExists.avatarUrl);
    }

    if (userExists.coverImg !== "" && req.files?.coverImg) {
      await deleteFile('cover/', userExists.coverImg);
    }

    let result = personalLink.includes("http")
    if (result == false) {
      personalLink = "https://" + personalLink;
    }

    const filter = { _id: _id };
    let update = {
      fullName: fullName,
      email: email,
      showEmail: showEmail,
      screenName: screenName,
      clientJob: clientJob,
      jobCategory: JSON.parse(jobCategory),
      country: country,
      state: state,
      city: city,
      address: address,
      phoneNumber: phoneNumber,
      personalLink: personalLink,
      zipCode: zipCode,
      birthday: birthday,
      about: about,
      avatarUrl: req.files?.avatarUrl ? req.files.avatarUrl[0].filename : avatarUrl,
      coverImg: req.files?.coverImg ? req.files.coverImg[0].filename : coverImg
    }

    await User.findOneAndUpdate(filter, update, { new: true });

    return res.status(200).send({ status: true, message: 'Update Successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

//Update Social function
exports.UpdateSocial = async (req, res) => {
  try {
    const { _id, facebookLink, instagramLink, linkedinLink, twitterLink } = req.body;

    const filter = { _id: _id };
    const update = {
      facebookLink: facebookLink,
      instagramLink: instagramLink,
      linkedinLink: linkedinLink,
      twitterLink: twitterLink
    }

    let doc = await User.findOneAndUpdate(filter, update, { new: true });
    return res.status(200).send({ status: true, message: 'Update Successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

//Update Password function
exports.UpdatePassword = async (req, res) => {
  try {
    const {
      _id,
      oldPassword,
      newPassword,
      confirmNewPassword
    } = req.body;

    let user = await User.findOne({ _id: _id });

    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      return res.status(400).send({ status: false, message: 'Invalid old password!' })
    }

    const filter = { _id: _id };

    const salt = await bcrypt.genSalt(10);

    const new_password = await bcrypt.hash(newPassword, salt);

    const update = { password: new_password };

    let doc = await User.findOneAndUpdate(filter, update, { new: true })
    return res.status(200).send({ status: true, message: 'Update Successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

// User Verification
exports.UserVerification = async (req, res) => {
  try {
    const emailVerifyToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log("req.params.token=>", req.params.token)
    console.log("emailVerifyToken=>", emailVerifyToken)

    // const emailVerifyUrl = `${web_host_url}/signup/email-verify/${verifyToken}`;

    let user = await User.findOne({
      emailVerifyToken,
      emailVerifyExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(200).send({ status: false, message: 'User not found or Expired email verification link' })
    }

    const filter = { _id: user._id }
    const update = { isVerified: true }
    let doc = await User.findOneAndUpdate(filter, update, { new: true })

    // await sendEmail({
    //   email: user.email,
    //   templateId: process.env.SENDGRID_RESET_TEMPLATEID,
    //   data: {
    //     name: user.fullName,
    //     emailVerifyUrl: emailVerifyUrl
    //   }
    // });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN_onetime });

    user = await User.findOne({ _id: user._id })
      .populate("jobCategory")
      .populate("artistCategory")
      .populate("likes")
      .populate({
        path: 'artworks',
        populate: [
          {
            path: 'author',
            populate: [
              { path: 'jobCategory' }
            ]
          },
          {
            path: 'comments',
            populate: [
              { path: 'author' }
            ]
          }
        ]
      })
      .populate("reposted")
      .populate("bought")
      .populate({
        path: "collections",
        populate: [
          { path: 'author' }
        ]
      })
      .populate("videos")
      .populate("viewed")
      .exec();

    return res.status(200).send({
      status: true,
      message: 'Email Verified',
      user: user,
      accessToken: accessToken,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }

};

// User Re-Verification
exports.ResendVerification = async (req, res) => {
  try {
    const { currentEmail } = req.body;

    let user = await User.findOne({ email: currentEmail, isDeleted: false, isBlocked: false, isVerified: false });

    if (!user) {
      return res.status(200).send({ status: false, message: 'User not found' })
    }

    const verifyToken = crypto.randomBytes(20).toString("hex");
    const emailVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    const emailVerifyExpiry = Date.now() + 15 * 60 * 1000;
    const emailVerifyUrl = `${web_host_url}/signup/email-verify/${verifyToken}`;

    const filter = { _id: user._id }
    const update = {
      emailVerifyToken: emailVerifyToken,
      emailVerifyExpiry: emailVerifyExpiry
    }

    let doc = await User.findOneAndUpdate(filter, update, { new: true })

    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: {
        name: user.fullName,
        emailVerifyUrl: emailVerifyUrl
      }
    });

    return res.status(200).send({ status: true, message: 'Success resend link' })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }

};

//Forgot Password
exports.ForgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, isDeleted: false, isBlocked: false, isVerified: true });
    if (!user) {
      return res.status(200).send({ status: false, message: 'User Not Found' })
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    const filter = { email: req.body.email }

    const update = {
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpiry: resetPasswordExpiry
    }

    await User.findOneAndUpdate(filter, update, { new: true })

    const resetPasswordUrl = `${web_host_url}/password/reset/${resetToken}/${req.body.email}`;

    try {
      await sendEmail({
        email: user.email,
        templateId: process.env.SENDGRID_RESET_TEMPLATEID,
        data: {
          emailVerifyUrl: resetPasswordUrl
        }
      });

      return res.status(200).json({ status: true, message: `We've sent a reset password link to: ${user.email}` });

    } catch (error) {
      console.error(error)
      return res.status(500).send({ status: false, message: 'Internal server error' });
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

//Reset Password
exports.ResetPassword = async (req, res) => {
  console.log("reset password")
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(200).send({ status: false, message: 'User Not Found' })
    }

    const filter = { _id: user._id };

    const salt = await bcrypt.genSalt(10);

    const new_password = await bcrypt.hash(req.body.password, salt);

    const update = {
      password: new_password,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined
    };

    await User.findOneAndUpdate(filter, update, { new: true })
    return res.status(200).send({ status: true, message: 'Update Successfully.' });
  } catch (error) {
    console.error(error)
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
}

//Delete account
exports.DeleteAccount = async (req, res) => {
  try {
    const { userId } = req.body;

    let userExist = await User.findOne({ _id: userId });

    console.log(userId)

    const filter = { _id: userId };

    const update = {
      isDeleted: true,
      deletedAt: Date()
    }

    // await User.findOneAndUpdate(filter, update, { new: true });
    await User.deleteOne({ _id: userId })
    await Artwork.find({ author: userId }).updateMany({}, { $set: update })
    await Collection.find({ author: userId }).updateMany({}, { $set: update })
    await Video.find({ author: userId }).updateMany({}, { $set: update })
    await Notification.find({ $or: [{ toUser: userId }, { fromUser: userId }] }).updateMany({}, { $set: update })
    await Chat.deleteMany({ users: { $in: [userId] } })
    await Message.deleteMany({ sender: userId })

    if (userExist.avatarUrl !== "") {
      await deleteFile('avatar/', userExist.avatarUrl);
    }

    if (userExist.coverImg !== "") {
      await deleteFile('cover/', userExist.coverImg);
    }

    return res.status(200).send({ status: true, message: 'Delete Successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};