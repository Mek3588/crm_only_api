const Branch = require("../../models/Branch");
const BranchPhones = require("../../models/BranchPhone");
const Contact = require("../../models/Contact");
const PhoneNo = require("../../models/PhoneNo");
const ShareHolderPhone = require("../../models/ShareHolderPhone");
const ShareHolders = require("../../models/shareholders/Shareholder");
const { isPhoneNoValid } = require("../../utils/GeneralUtils");
const { Op } = require("sequelize");

const getAllPhoneNos = async (req, res) => {
  try {
    const data = await PhoneNo.findAll({ raw: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getPhoneNos = async (req, res) => {
  
  const id = req.query.id;
  const category = req.query.category;
  
  try {
    const data = await PhoneNo.findAll({
      where: { ownerId: id, category: category },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getPhoneNo = async (req, res) => {
  try {
    const phoneNos = await PhoneNo.findAll({
      where: { ownerId: req.params.id },
    });
    res.status(200).json(phoneNos);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
const getPhoneNoByShareHolder = async (req, res) => {
  try {
    const phoneNos = await PhoneNo.findAll({
      include: ShareHolders,
      where: {  "$share_holders.id$": req.params.id },
    });
    res.status(200).json(phoneNos);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getPhoneNoByBranch = async (req, res) => {
  try {
    const phoneNos = await PhoneNo.findAll({
      include: Branch,
      where: {  "$branches.id$": req.params.id },
    });
    res.status(200).json(phoneNos);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const addShareHolderPhone = async (req, res) => {
  try {
           
    const phoneNos = await PhoneNo.create(req.body.phone);

    await phoneNos.addShare_holders(req.body.shareHolderId, { through: ShareHolderPhone })
    res.status(200).json(phoneNos);
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};


const addBranchPhone = async (req, res) => {
  try {
          
    const phoneNos = await PhoneNo.create(req.body.phone).then(phone => {
         phone.addBranches(req.body.branchId, { through: BranchPhones })
        
    })
   res.status(200).json(phoneNos);
   
  } catch (error) {
    
    res.status(404).json({ msg: error.message });
  }
};
//posting
const createPhoneNo = async (req, res) => {
  
  
  try {

       const contactFound = await Contact.findOne({
         where: {
           [Op.and]: [
             { id: { [Op.like]: req.body.ownerId } },
          { [Op.or]: [
             { primaryPhone: { [Op.like]: req.body.phoneNo } },
             { secondaryPhone: { [Op.like]: req.body.phoneNo } },
           ],}
           ]
         },
       });
      const foundPhoneNo = await PhoneNo.findOne({
        where: {
          [Op.and]: [
            { phoneNo: { [Op.like]: req.body.phoneNo } },
            { ownerId: { [Op.like]: req.body.ownerId } },
          ],
        },
      });
    
    if (!isPhoneNoValid(req.body.phoneNo)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    else if (contactFound != null || foundPhoneNo != null) {
      res.status(400).json({ msg: "Phone number exists" });
      return;
    }
    else {
      const phoneNo = await PhoneNo.create({
        ...req.body,
      });
      res.status(200).json(phoneNo);
    }
  } catch (error) {
    
  }
};

const editPhoneNo = async (req, res) => {
  const { id, type, phoneNo } = req.body;
  
  try {
    PhoneNo.update(
      {
        type, phoneNo,
      },

      { where: { id: id } }
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deletePhoneNo = async (req, res) => {
  const id = req.params.id;
  try {
    PhoneNo.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getPhoneNos,
  getAllPhoneNos,
  createPhoneNo,
  getPhoneNo,
  editPhoneNo,
  deletePhoneNo,
  getPhoneNoByShareHolder, addShareHolderPhone,
  getPhoneNoByBranch,
  addBranchPhone
};
