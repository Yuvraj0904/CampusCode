import Notification from "../models/notification.model.js";

const createNotification = async ({
  recipient,
  sender,
  type,
  post = null,
  comment = null,
}) => {
  // Don't notify yourself
  if (recipient.toString() === sender.toString()) {
    return;
  }

  await Notification.create({
    recipient,
    sender,
    type,
    post,
    comment,
  });
};

export default createNotification;
