const AgeLoad = require("../../../models/AgeLoad");
const Branch = require("../../../models/Branch");
const Contact = require("../../../models/Contact");
const CoverRate = require("../../../models/CoverRate");
const Opportunity = require("../../../models/Opportunity");
const Policy = require("../../../models/Policy");
const Product = require("../../../models/Product");
const Quotation = require("../../../models/Quotation");
const User = require("../../../models/acl/user");
const Customer = require("../../../models/customer/Customer");
const CustomerProposal = require("../../../models/customer/CustomerProposal");
const CustomerInputMotor = require("../../../models/motor/CustomerInputMotor");
const VehicleCategory = require("../../../models/motor/VehicleCategory");
const MoterProposal = require("../../../models/proposals/MotorProposal");
const Proposal = require("../../../models/proposals/Proposal");
const { EndorsementFiles } = require("../../../utils/constants");

//activate , com'ment
const getSearch = (st, id) => {
  return {
    proposalId: id,
  };
};

const getProposalByCustomer = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await Customer.findByPk(req.params.id, {
      include: [
        {
          model: Contact,
          include: [
            {
              model: Proposal,
              include: [
                {
                  model: Policy,
                  // include: [{ model: EndorsementFiles }],
                },
              ],
            },
            // Opportunity,
            // Opportunity,
            Branch,
          ],
        },
      ],

      // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],

      // subQuery: false,
    });
    //  const data = await CustomerProposal.findAndCountAll({
    //    include: [
    //      {
    //        model: Customer
    //      },

    //    ],
    //    offset: Number(f),
    //    limit: Number(r),
    //    // order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
    //    //   where: getSearch(st, req.params.id),
    //    subQuery: false,
    //  });
    // 
    res.status(200).json(data);
  } catch (error) {
    

    res.status(400).json({ msg: error.message });
  }
};

const createCustomerProposal = async (req, res) => {
  const body = req.body;
  try {
    const proposal = await CustomerProposal.create(body);
    res.status(200).json(proposal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCustomerWithProposal = async (req, res) => {
  const body = req.body;

  //console.log("body",body)
 // 
  const userId = req.user.id;
  try {

   // 
    body.map(async (e) => {
      const ageLoad = await AgeLoad.findOne({
        where: {
          made_of: e.made_of,
        },
      });

      const branch = await Branch.findOne({
        where: {
          branch_code: e.branchCode,
        },
      });

      const vehicleType = await VehicleCategory.findOne({
        where: {
          name: e.vehicleType,
        },
      });
      const coverType = await CoverRate.findOne({
        where: {
          coverType: e.coverType,
        },
      });

      let newContact = {
        type: e.type,
        firstName: e.firstName,
        middleName: e.fatherName,
        lastName: e.grandFatherName,
        companyName: e.companyName,
        numberOfEmployees: e.numberOfEmployees,
        industry: e.industry,
        primaryEmail: e.primaryEmail,
        secondaryEmail: e.secondaryEmail,
        primaryPhone: e.primaryPhone,
        secondaryPhone: e.secondaryPhone,
        annualRevenue: e.annualRevenue,
        country: e.country,
        region: e.region,
        city: e.city,
        subcity: e.subcity,
        woreda: e.woreda,
        kebele: e.kebele,
        building: e.building,
        officeNumber: e.officeNumber,
        poBox: e.poBox,
        TOT: e.tot,
        tinNumber: e.tinNumber,
        vatRegistrationNumber: e.vatRegistrationNumber,
        deleted: false,
        // socialSecurity: e.socialSecurity,
        registeredForVat: e.registeredForVat,
        gender: e.gender,
        business_source_type: e.business_source_type,
        business_source: e.business_source || "",
        branchId: branch.id,
        ownerId: userId,
      };
      const contact = await Contact.create(newContact);
      

      let newCustomerInputMotor = {
        // insurance_type,
        vehicle_type: vehicleType ? vehicleType.id : 0,
        manufactured_date: e.manufactured_date,
        made_of: ageLoad ? ageLoad.id : 0,
        duration: e.duration,
        coverType: coverType ? coverType.id : 0,
        sumInsured: e.sumInsured,
      };
      const customerInputMotor = await CustomerInputMotor.create(
        newCustomerInputMotor
      );

      let newQuotation = {
        sumInsured: e.sumInsured,
        subject: "Customer",
        premium: e.premium,
        contactId: contact.id || 0,
        ownerId: userId,
        customerInputMotorId: customerInputMotor.id,
        comment: "customer quotation",
        expirationDate: new Date().toString(),
      };
      const quotation = await Quotation.create(newQuotation);
      

      let newMotorProposal = {
        chassisNo: e.chassisNo,
        engineNo: e.engineNo,
        isApproved: e.isApproved,
        plateNumber: e.plateNumber,
        horsePower: e.horsePower,
        ownerId: userId,
        quotationId: quotation.id,
      };

      const motorProposal = await MoterProposal.create(newMotorProposal);

      const newCustomer = {
        active: e.active,
        registrationDate: e.registrationDate,
        expirationDate: e.expirationDate,
        userId: userId,
        contactId: contact.id || 0,
        expirationDate: e.expirationDate,
        motorProposal: motorProposal,
      };
      const customer = await Customer.create(newCustomer, {
        include: [
          {
            model: MoterProposal,
            include: [
              {
                model: Quotation,
                include: [
                  {
                    model: CustomerInputMotor,
                  },
                ],
              },
              Opportunity,
            ],
          },
        ],
      });

      
      res.status(200).json({ msg: "successfully imported" });

    });

    // const coverType = await CoverRate.findAll({
    //   where:{ coverType: req.body.coverType},
    // });
    // const
    // const proposal = await CustomerProposal.create(body);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCustomerProposal = async (req, res) => {
  const proposal = req.body;

  try {
    await CustomerProposal.update(proposal, { where: { id: proposal.id } });
    res.status(200).json({ proposal });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCustomerProposal = async (req, res) => {
  const id = req.params.id;

  try {
    CustomerProposal.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getProposalByCustomer,
  deleteCustomerProposal,
  editCustomerProposal,
  createCustomerProposal,
  createCustomerWithProposal,
};
