const Notification = require("../models/Notification");

// Function that Add Notification
exports.AddNotification = async (req, res) => {
  try {
    const { senderId, receiverId, notificationContent, type } = req.body;

    let notification = new Notification({
      toUser: receiverId,
      fromUser: senderId,
      type: type,
      notificationContent: notificationContent,
      createdAt: Date(),
    });

    await notification.save();

    notification = await Notification.findOne({ _id: notification._id })
      .populate("toUser")
      .populate("fromUser")
      .exec();

    return res.status(200).send({
      status: true,
      message: "Added successfully.",
      result: notification,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Get Notification
exports.GetNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    let notification_List = await Notification.find({
      isDeleted: false,
      toUser: userId,
    })
      .sort({ createdAt: -1 })
      .populate("toUser")
      .populate("fromUser")
      .exec();

    return res.status(200).send(notification_List);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Read Notifications
exports.ReadNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    let notification_List = await Notification.find({
      isDeleted: false,
      toUser: userId,
    }).updateMany({}, { $set: { isUnRead: false } });
    return res
      .status(200)
      .send({ status: true, message: "Updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// Function that Delete Notification
exports.DeleteNotifications = async (req, res) => {
  try {
    const { itemIds } = req.body;
    console.log("itemIds=>", itemIds);
    itemIds.map(async (e) => {
      let oneItem = await Notification.findOne({ _id: e });
      if (!oneItem) {
        return res
          .status(400)
          .send({ status: false, message: "Something went wrong!" });
      }
      const filter = { _id: e };
      const update = {
        isDeleted: true,
        deletedAt: Date(),
      };
      let doc = await Notification.findOneAndUpdate(filter, update, {
        new: true,
      });
    });

    return res
      .status(200)
      .send({ status: true, message: "Deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
