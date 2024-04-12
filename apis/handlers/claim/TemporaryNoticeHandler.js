const TemporaryNotice = require("../../../models/TemporaryNotice");

const getTemporaryNotice = async (req, res) => {
  try {
    const data = await TemporaryNotice.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createTemporaryNotice = async (req, res) => {
  const tempNotification = req.body
  try {
    const temporaryNotice = await TemporaryNotice.create(tempNotification);
    res.status(200).json(temporaryNotice);
  } catch (error) {
    
  }
};

const getTemporaryNoticeByPk = async (req, res) => {
  try {
    const TemporaryNotice = await TemporaryNotice.findByPk(req.params.id).then(function (
      TemporaryNotice
    ) {
      if (!TemporaryNotice) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(TemporaryNotice);
    });

    res.status(200).json(TemporaryNotice);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editTemporaryNotice = async (req , res) => {
   const tempNotification = req.body
   const id = req.params.id

  try {
    
    TemporaryNotice.update(
     tempNotification,

      { where: { id: id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteTemporaryNotice = async (req, res) => {
  const  id  = req.params.id;

  try {
    TemporaryNotice.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getTemporaryNotice,
  createTemporaryNotice,
  getTemporaryNoticeByPk,
  editTemporaryNotice,
  deleteTemporaryNotice,
};
