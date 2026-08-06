import Notification from "../models/notification.model.js";

const createNotification = async ({
  recipient,
  sender = null,
  type,
  post = null,
  comment = null,
  badge = null,
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
  badge,
});
};

export default createNotification;
