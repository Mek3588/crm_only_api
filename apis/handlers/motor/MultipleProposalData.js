const { Op } = require("sequelize");
// const  = require("../../models/mul");
const MultipleProposalData = require("../../../models/motor/MultipleProposalData")
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
} = require("../../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../../utils/GeneralUtils");

const getMultipleProposalData = async (req, res) => {
  try {
    if (!(await canUserRead(req.user, "multipleProposalDatas"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const id = req.params.id;
    
    const data = await MultipleProposalData.findAndCountAll({
      // offset: Number(f),
      // limit: Number(r),
      // order: sc
      //   ? [[sc, sd == 1 ? "ASC" : "DESC"]]
      //   : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      where: { multipe_riskId: id }
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getMultipleProposalData,
};
