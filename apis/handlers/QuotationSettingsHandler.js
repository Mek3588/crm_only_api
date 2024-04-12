const QuotationSetting = require("../../models/QuotationSetting");

const getQuotationSettings = async (req, res) => {
  try {
    const data = await QuotationSetting.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getQuotationSetting = async (req, res) => {
  try {
    const quotationSetting = await QuotationSetting.findByPk(req.params.id).then(function (quotationSetting) {
      if (!quotationSetting) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(quotationSetting);
    });

    res.status(200).json(quotationSetting);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getQuotationSettingsByProduct = async (req, res) => {
  try {
    const {product} = req.params;
    const data = await QuotationSetting.findAll({ where: {product: product} });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createQuotationSetting = async (req, res) => {
  const reqBody = req.body;
  try {
    const quotationSetting = await QuotationSetting.create(reqBody);
    res.status(200).json(quotationSetting);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editQuotationSetting = async (req, res) => {
  const reqBody = req.body;
  const {id} = req.body;
  try {
    QuotationSetting.update(
      reqBody,
      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteQuotationSetting = async (req, res) => {
  const  id  = req.params.id;
  try {
    QuotationSetting.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getQuotationSettings,
  getQuotationSetting,
  getQuotationSettingsByProduct,
  createQuotationSetting,
  editQuotationSetting,
  deleteQuotationSetting,
};
