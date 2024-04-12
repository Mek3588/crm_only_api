const Notification = require("../../../models/Notification");

const getNotification = async (req, res) => {
  try {
    const data = await Notification.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    
  }
};

//posting
const createNotification = async (req, res) => {
  const notificationBody = req.body
  try {
    const notification = await Notification.create(notificationBody);
    res.status(200).json(notification);
  } catch (error) {
    
  }
};

const getNotificationByPk = async (req, res) => {
  try {
    const Notification = await Notification.findByPk(req.params.id).then(function (
      Notification
    ) {
      if (!Notification) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(Notification);
    });

    res.status(200).json(Notification);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editNotification = async (req , res) => {
   const notificationBody = req.body
   const id = req.params.id

  try {
    
    Notification.update(
     notificationBody,

      { where: { id: notificationBody.id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteNotification = async (req, res) => {
  const  id  = req.params.id;

  try {
    Notification.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getNotification,
  createNotification,
  getNotificationByPk,
  editNotification,
  deleteNotification,
};

