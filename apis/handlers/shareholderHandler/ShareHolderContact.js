const { Op } = require("sequelize");
const CompanyContact = require("../../../models/CompanyContact");
const Shareholder = require("../../../models/shareholders/Shareholder");
const ShareholderContact = require("../../../models/shareholders/ShareholderContact");

const { isEmailValid, isPhoneNoValid } = require("../../../utils/GeneralUtils");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
//activate , com'ment
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const getSearch = (st, vendorId) => {
  return {
    [Op.and]: [
      { "$shareholders.id$": { [Op.like]: vendorId } },
      // {
      //     [Op.or]: [
      //         { firstName: { [Op.like]: `%${st}%` } },
      //         { fatherName: { [Op.like]: `%${st}%` } },
      //         { secondaryPhone: { [Op.like]: `%${st}%` } },
      //         { secondaryPhone: { [Op.like]: `%${st}%` } },
      //         { primaryEmail: { [Op.like]: `%${st}%` } },
      //         { secondaryEmail: { [Op.like]: `%${st}%` } },
      //     ],
      // }
    ],
  };
};

const getShareHolderContacts = async (req, res) => {
  //queryparams:  { f: '0', r: '7', st: '', sc: 'first_name', sd: '1' }
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await CompanyContact.findAndCountAll({
      include: [Shareholder],
      where: getSearch(st, req.params.id),
      offset: Number(f),
      limit: Number(r),
      subQuery: false,
      // order: [[sc || "first_name", sd == 1 ? "ASC" : "DESC"]],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createShareHolderContact = async (req, res) => {
  const body = req.body;

  try {
    if (!isPhoneNoValid(body.primaryPhone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }

    const companyContact = await CompanyContact.create(body).then(
      async (contact) => {
        contact.addShareholders(body.shareholderId, {
          through: ShareholderContact,
        });
        let ipAddress = await getIpAddress(req.ip);
        const eventLog = await createEventLog(
          req.user.id,
          eventResourceTypes.contact,
          contact.firstName,
          contact.id,
          eventActions.create,
          "",
          ipAddress
        );
      }
    );
    res.status(200).json(companyContact);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getShareHolderContact = async (req, res) => {
  try {
    const companyContact = await CompanyContact.findByPk(req.params.id).then(
      (companyContact) => {
        if (!companyContact) {
          res.status(400).json({ message: "No Data Found" });
        } else {
          res.status(200).json(companyContact);
        }
      }
    );

    res.status(200).json(companyContact);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getShareHolderContacts,
  createShareHolderContact,
  getShareHolderContact,
};
