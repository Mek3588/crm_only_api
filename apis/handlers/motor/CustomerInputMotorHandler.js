const { Op } = require("sequelize");
const AgeLoad = require("../../../models/AgeLoad");
const CoverRate = require("../../../models/CoverRate");
const CustomerInputMotor = require("../../../models/motor/CustomerInputMotor");
const Branch = require("../../../models/Branch");
const VehicleCategory = require("../../../models/motor/VehicleCategory");
const VehicleRateChart = require("../../../models/motor/VehicleRateChart");
const Contact = require("../../../models/Contact");
const {
  ContactStatus,
  QuotationCalculationType,
  MotorCoverType,
  vehicleTypesModelsMap,
  getSearchModelAndConditions,
  tpVehicleTypesModelsMap,
  getTpSearchModelAndConditions,
  isAdditionalVehicleType,
  additionalVehicleTypes,
  SettingsEnum,
  vehicleTypes,
  motorFields,
} = require("../../../utils/constants");
const {
  wallType,
  insurancePeriod,
} = require("../../../utils/fireQuotationConstants");
const Quotation = require("../../../models/Quotation");
const Setting = require("../../../models/Setting");
const Lead = require("../../../models/Lead");
const PeriodRate = require("./../../../models/PeriodRate");
const QuotationSetting = require("./../../../models/QuotationSetting");
const TerritorialExtension = require("../../../models/TerritorialExtension");
const BSG = require("../../../models/BSG");
const DailyCashAllowanceCoverRate = require("../../../models/motor/DailyCashAllowanceCoverRate");
const TpUnitPrice = require("../../../models/quotation/tp_unitPrice");
const Learner = require("../../../models/quotation/learner");
const LimitedCoverRate = require("../../../models/motor/LimitedCoverRate");
const TipperMotorSpecialTp = require("../../../models/TipperMotorSpecial");
const TruckTankerTp = require("../../../models/TruckTankerTp");
const {
  getODPremium,
  getTPPremium,
  getComprehensivePremium,
  saveODPremium,
  saveTPPremium,
  getPremium,
  printCalculationSheet,
  saveComprehensivePremium,
  savePremium,
  getLimitedCovers,
  saveLimitedCovers,
} = require("./functions");
const MultipleRisk = require("../../../models/MultipleRisk");
const FinanceData = require("../../../models/FinanceData");
const Addons = require("../../../models/motor/Addons");
const PDFMerger = require("pdf-merger-js");
const Vehicle = require("../../../models/motor/Vehicle");
// const motorFields = require("../../../utils/constants")
// const motorFields  = require


const getCustomerInputMotors = async (req, res) => {
  try {


    const data = await CustomerInputMotor.findAll({
      include: [
        Branch,
        VehicleCategory,
        CoverRate,
        CoverRate,
        AgeLoad,
        PeriodRate,
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCustomerInputMotor = async (req, res) => {
 
  let result = 0;
  const cu = req.user;
  const {
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    owner_phoneNo,
    branchId,
    coverType,
    sumInsured,
    vehicleId,
    purpose,
  } = req.body;
  req.body.userId = req.user.id;
  
  console.log("comming quotation inputs", req.body);

  try {
    let quotation = 0;

    const savedquotation = await MultipleRisk.create({
      requested_by: owner_first_name+' '+owner_middle_name+' '+owner_last_name,
      number_of_risks: 1,
    });

    if (coverType === MotorCoverType.ownDamage) {

      // 
      // 
      // let promises = await req.body.map(async (index) => {
      //   return await savePremium({
      //     ...index,
      //     requested_quotation_id: savedquotation.id,
      //   });
      // });
      quotation = await saveODPremium({ ...req.body, requested_quotation_id: savedquotation.id });
      if (quotation.msg !== "") {

        return res.status(400).json({ msg: quotation.error });

      }
      const msg = quotation.msg;
      const older = quotation.older;
      const financeObj = quotation.financeObj;
      const quotationId = quotation.quotationId;
      
      



      const fin = await saveFinance(financeObj, quotationId);

      if (msg) {
        return res.status(400).json({ msg });
      }

      await MultipleRisk.update(
        { premium: quotation.quotation },
        { where: { id: savedquotation.id } }
      );
     return  res.status(200).json([
        {
          premium: quotation.quotation,
          calculation_sheet_path: quotation.calculation_sheet_path,
          contactId: quotation.contactId,
          quotationId: quotation.quotationId,
          older,
        },
      ]);
    }
    if (coverType === MotorCoverType.thirdParty) {
      result = await saveTPPremium({ ...req.body, requested_quotation_id: savedquotation.id });
      const financeObj = result.financeObj;
      const quotationId = result.quotationId;
      

      if (result.error !== "") {
       return res.status(400).json({ msg: result.error });
      }

      const fin = await saveFinance(financeObj, quotationId);


      await MultipleRisk.update(
        { premium: result.quotation },
        { where: { id: savedquotation.id } }
      );

      res.status(200).json([
        {
          premium: result.quotation,
          calculation_sheet_path: result.calculation_sheet_path,
          contactId: result.contactId,
          quotationId: result.quotationId,
        },
      ]);
    }
    if (coverType === MotorCoverType.comprehensive) {
      const comprehensivePremium = await saveComprehensivePremium({ ...req.body, requested_quotation_id: savedquotation.id });

      if (comprehensivePremium.msg !== "") {
       return res.status(400).json({ msg: comprehensivePremium.error });
      }

      const comprhensiveFinance = comprehensivePremium.comprhensiveFinance;
      
      const quotationId = comprehensivePremium.quotationId;
      const fin = await saveFinance(comprhensiveFinance, quotationId);

      await MultipleRisk.update(
        { premium: comprehensivePremium.premium },
        { where: { id: savedquotation.id } }
      );
      return res.status(200).json([
        {
          premium: comprehensivePremium.premium,
          calculation_sheet_path: comprehensivePremium.calculation_sheet_path,
          contactId: comprehensivePremium.contactId,
          quotationId: comprehensivePremium.quotationId,
        },
      ]);
    } else if (
      coverType === MotorCoverType.fireAndTheft ||
      coverType === MotorCoverType.theftOnly ||
      coverType === MotorCoverType.fireOnly
    ) {
      // quotation = await calculateLimitedCovers(coverType, purpose, sumInsured);
      const result = await saveLimitedCovers(req.body);

      await MultipleRisk.update(
        { premium: result.quotation },
        { where: { id: savedquotation.id } }
      );

      return res.status(200).json([
        {
          premium: result.quotation,
          calculation_sheet_path: result.calculation_sheet_path,
          contactId: result.contactId,
          quotationId: result.quotationId,
        },
      ]);
    }
  } catch (error) {

   return res.status(404).json({ msg: error.message });
  }
};

const saveFinance = async (financeObj, quotationId) => {
  const newFinance = {
    sum_insured: financeObj.sum_insured,
    premium: financeObj.premium,
    tp_fund_levy: financeObj.tp_fund_levy,
    revenue_stamp: financeObj.revenue_stamp,
    quotationId: quotationId
  }

  const resultFinance = await FinanceData.create(newFinance);
  
}
const updateFinance = async (financeObj, quotationId) => {
  const newFinance = {
    sum_insured: financeObj.sum_insured,
    premium: financeObj.premium,
    tp_fund_levy: financeObj.tp_fund_levy,
    revenue_stamp: financeObj.revenue_stamp,
    quotationId: quotationId
  }
//{ where: { id: id } }
console.log("forfin", newFinance)
  const resultFinance = await FinanceData.update(newFinance, {where: {quotationId: quotationId}});
console.log("resultFinance", resultFinance)
  
}
const createCustomerInputMotors = async (req, res) => {
  
  // const { owner_name } = req.body[0];
  const reqBody = req.body.filter((risk) => risk.owner_name != "");
  if (reqBody.length > 0) {
    const { owner_name } = reqBody[0];

    

    // 
    // 
    const numberOfRisks = req.body.length;
    let premiums = [];
    let printPath = "/print_files/" + Date.now() + ".pdf";
    let response = [];

    try {
      
      //save on the multirisk database
      //requested_by, number_of_risks, premium,
      //save the data
      const savedquotation = await MultipleRisk.create({
        requested_by: owner_name,
        number_of_risks: numberOfRisks,
      });

      
      

      let promises = await req.body.map(async (index) => {
        return await savePremium({
          ...index,
          requested_quotation_id: savedquotation.id,
        });

        // const calculatedQuotation = await savePremium({
        //   ...index,
        //   requested_quotation_id: savedquotation.id,
        // });

        // 
        // response.push(calculatedQuotation);
      });
      

      Promise.all(promises).then(async function (result) {
        

      })

      

      const responses = await Promise.all(promises);
      let notFound = false;

      for (let i = 0; i < responses.length; i++) {
        
        let quited = false;
        if (responses[i] == "This vehicle is unsupported.") {
          await MultipleRisk.destroy({ where: { id: savedquotation.id } });
          notFound = true;
          break;
        }
      }

      if (notFound) {
        res.status(400).json({ msg: "This vehicle is unsupported." });
        return;
      }
      
      const result = (premiums = responses.reduce((finalResult, currentValue) => {
        
        

        return currentValue ? (finalResult * 1) + (currentValue * 1) : (finalResult * 1);
      }, 0));

      
      

      // Promise.all(promises).then(async function (results) {
      //   var merger = new PDFMerger();
      //   var prom = response.map(async (element) => {
      //     await merger.add("." + element.calculation_sheet_path);

      //   });
      //   const responses = await Promise.all(promises);




      //   Promise.all(prom).then(async function (result) {
      //     await merger.save("." + printPath);

      //   });
      //   // res.status(200).json(response);
      //   



      //   let ids = [];
      //   response.map((element) => {
      //     ids.push(element.id);
      //   });
      //   let Quotes = await Quotation.update(
      //     { calculation_sheet_path: printPath },
      //     { where: { id: ids } }
      //   );
      //   // if (Quotes) {
      //   //   let finalResult = await Quotation.findAll({
      //   //     where: { id: ids },
      //   //     include: [
      //   //       Branch,
      //   //   VehicleCategory,
      //   //   CoverRate,
      //   //   CoverRate,
      //   //   AgeLoad,
      //   //   PeriodRate,
      //   //       Branch,
      //   //       // { model: Employee, as: "employee" },
      //   //       // { model: Employee, as: "assignedEmployee" },
      //   //       // { model: User, as: "owner" },
      //   //       // { model: User, as: "user" },
      //   //       // FireAlliedPerilsRate,
      //   //       // Partner,
      //   //     ],
      //   //   });

      //   //   res.status(200).json(finalResult);

      //   // }
      //   

      //   const premiums = response.reduce((finalResult, currentValue) => {
      //     
      //     

      //     return currentValue.premium ? (finalResult * 1) + (currentValue.premium * 1) : (finalResult * 1);
      //   }, 0);

      //   

      //   // Update MultipleFireRisk with premiums
      //   // await Multiple.update(
      //   //   { premium: premiums },
      //   //   { where: { id: savedquotation.id } }
      //   // );


      // });
      // //update the data with the premium.
      await MultipleRisk.update(
        { premium: result },
        { where: { id: savedquotation.id } }
      );
      
      res.status(200).json([{ premium: result }]);
    } catch (error) {
      
      res.status(404).json({ msg: error.message });
    }
  } else {
    res.status(400).json({ msg: "Invalid request body, owner_name not provided." });
  }
};

// const getCustomerInputMotor = async (req, res) => {
//   try {
//     const customerInputMotor = await CustomerInputMotor.findByPk(
//       req.params.id,
//       { include: [Branch, VehicleCategory, CoverRate, AgeLoad, PeriodRate] }
//     ).then(function (customerInputMotor) {
//       if (!customerInputMotor) {
//     console.log("getCustomerInputMotor no",  req.params.id, )

//     res.status(404).json({ message: "No Customer Input Motor Found" });
//       }
//     console.log("getCustomerInputMotor ok",  req.params.id, customerInputMotor)

//       return res.status(200).json(customerInputMotor);
//     });
//     console.log("getCustomerInputMotor",  req.params.id)

//     // res.status(200).json(customerInputMotor);
//   } catch (error) {
//     return res.status(404).json({ msg: error.message });
//   }
// };

const getCustomerInputMotor = async (req, res) => {
  try {
    const customerInputMotor = await CustomerInputMotor.findByPk(
      req.params.id,
      { include: [Branch, VehicleCategory, CoverRate, AgeLoad, PeriodRate] }
    ).then(function (customerInputMotor) {
      if (!customerInputMotor) {
        console.log("getCustomerInputMotor no",  req.params.id, customerInputMotor)
        return res.status(404).json({ message: "No Customer Input Motor Found" });
      }
      console.log("getCustomerInputMotor",  req.params.id)
      return res.status(200).json(customerInputMotor);
    });

    // res.status(200).json(customerInputMotor);
  } catch (error) {
console.log("odError", error)
    return res.status(404).json({ msg: error.message });
  }
};

const editCustomerInputMotor = async (req, res) => {
  const {
    id,
    owner_name,
    owner_phoneNo,
    business_source,
    insurance_type,
    vehicle_type,
    manufactured_date,
    made_of,
    duration,
    coverType,
    sumInsured,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    branchId,
    vehicleId,
    purpose,
  } = req.body;
  console.log("editCustomerInputMotor", req.body)

  // if (req.file) 
  // try {
  //   CustomerInputMotor.update(
  //     {
  //       owner_name,
  //       owner_phoneNo,
  //       business_source,
  //       insurance_type,
  //       vehicle_type,
  //       manufactured_date,
  //       made_of,
  //       duration,
  //       coverType,
  //       sumInsured,
  //     },

  //     { where: { id: id } }
  //   );

  //   res.status(200).json({ id });
  // } catch (error) {
  //   res.status(404).json({ msg: error.message });
  // }
  try {
    let quotation = 0;
    const id = req.params.id
    const body = req.body;
    const requested_quotation_id = body.requested_quotation_id;

if (coverType === MotorCoverType.ownDamage) {
  console.log("MotorCoverType.ownDamage", body)

  quotation = await saveODPremium({ ...req.body, requested_quotation_id: requested_quotation_id }, id);
  if (quotation.msg !== "") {
    return res.status(400).json({ msg: quotation.error });
  }
  const msg = quotation.msg;
  const older = quotation.older;
  const financeObj = quotation.financeObj;
  const quotationId = id;

  console.log("quotationId", quotationId)


  const fin = await updateFinance(financeObj, quotationId);

  if (msg) {
    return res.status(400).json({ msg });
  }

  await MultipleRisk.update(
    { premium: quotation.quotation },
    { where: { id: requested_quotation_id} }
  );
 return  res.status(200).json([
    {
      premium: quotation.quotation,
      calculation_sheet_path: quotation.calculation_sheet_path,
      contactId: quotation.contactId,
      quotationId: id,
      older,
    },
  ]);
}
if (coverType === MotorCoverType.thirdParty) {
  result = await saveTPPremium({ ...req.body, requested_quotation_id: requested_quotation_id }, id);
  const financeObj = result.financeObj;
  const quotationId = Number(id);
  if (result.error !== "") {
   return res.status(400).json({ msg: result.error });
  }

  const fin = await updateFinance(financeObj, quotationId);


  await MultipleRisk.update(
    { premium: result.quotation },
    { where: { id: body.requested_quotation_id } }
  );

  return res.status(200).json([
    {
      premium: result.quotation,
      calculation_sheet_path: result.calculation_sheet_path,
      contactId: result.contactId,
      quotationId: Number(id),
    },
  ]);
}
  } catch (error) {
console.log("odError", error)
   return res.status(404).json({ msg: error.message });
  }
};

const createQuotation = async (body) => {
  let expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3);
  expirationDate = expirationDate.toDateString();

  
  const quotation = await Quotation.create(body);
  return quotation;
};

const deleteCustomerInputMotor = async (req, res) => {
  const id = req.params.id;
  try {
    CustomerInputMotor.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const calculateQuotation = async (index) => {
  let {
    owner_name,
    insurance_type,
    owner_phoneNo,
    business_source,
    branchId,
    duration,
    vehicle_type,
    manufactured_date,
    made_of,
    coverType,
    sumInsured,
    selectedChargeRates,
    cc,
    userId,
  } = index;

  const customerInputMotor = await CustomerInputMotor.create({
    owner_name,
    owner_phoneNo,
    business_source,
    insurance_type,
    vehicle_type,
    manufactured_date,
    cc,
    made_of,
    duration,
    coverType,
    sumInsured,
    branchId,
  });
  //getting the quotation calculation type definition
  const quotationCalculationType = await QuotationSetting.findAll();
  

  // getting the vehicle rate from the database;
  const vehicleCategory = await VehicleCategory.findByPk(vehicle_type, {
    raw: true,
  });
  const vehicleRate = vehicleCategory ? vehicleCategory.rate : 0;
  let quotation;
  var promises;
  if (
    quotationCalculationType[0].quotationCalculation ===
    QuotationCalculationType.cascading
  ) {
    console.log("inside the quotation setting ")
    //getting the cover rate from the database
    const cover_type = await CoverRate.findByPk(coverType, { raw: true });
    
    const coverRate = cover_type ? cover_type.rate : 0;
    
    //getting the year load rate
    const manufacturedDate = new Date(manufactured_date);
    const manufacturedYear = manufacturedDate.getFullYear();
    const thisYear = new Date().getFullYear();
    const age = thisYear - manufacturedYear;
    
    const ageLoadObject = await AgeLoad.findAll(
      { raw: true },
      {
        where: {
          min_age: { [Op.lt]: age },
          max_age: { [Op.gt]: age },
        },
      }
    );
    
    let ageLoadRate = 0;
    if (Array.isArray(ageLoadObject) && ageLoadObject.length > 0) {
      ageLoadRate = ageLoadObject[0].load_rate;
    }
    
    quotation = sumInsured * (vehicleRate / 100); //12,000
    // quotation = quotation + quotation * (coverRate/100); //13,200
    quotation = quotation + quotation * (ageLoadRate / 100);
    
    selectedChargeRates.forEach((selectedChargeRate) => {
      if (selectedChargeRate.rate > 0) {
        quotation = quotation + quotation * (selectedChargeRate.rate / 100);
      } else if (selectedChargeRate.rate < 0) {
        quotation = quotation - quotation * (selectedChargeRate.rate / 100);
      }
    });
    quotation = quotation.toFixed(2);
  } else if (
    quotationCalculationType[0].quotationCalculation ===
    QuotationCalculationType.flat
  ) {
    quotation = sumInsured * (vehicleRate / 100); //12,000
    quotation = quotation.toFixed(2);
  }

  const leadObject = {
    name: owner_name,
    status: "",
    productId: 0,
    branchId: branchId,
    primaryPhone: owner_phoneNo,
    primaryEmail: "",
    businessSource: 1,
  };
  const contact = {
    type: "",
    companyName: "",
    firstName: owner_name,
    middleName: "",
    primaryEmail: "",
    primaryPhone: owner_phoneNo,
    business_source_type: "Direct",
    business_source: "",
    status: "leads",
    deleted: false,
    branchId: branchId,
  };
  // const lead = await Lead.create(leadObject);
  const created_contact = await Contact.create(contact);
  // let leadId= lead.id || 0;
  let contactId = created_contact.id || 0;
  let productId = vehicle_type || 0;

  const data = await createQuotation(
    owner_name,
    sumInsured,
    Number(quotation).toFixed(2),
    "",
    0,
    contactId,
    productId,
    0,
    customerInputMotor.id,
    userId,
  );
  
  return data;
};

module.exports = {
  getCustomerInputMotor,
  createCustomerInputMotor,
  createCustomerInputMotors,
  getCustomerInputMotors,
  editCustomerInputMotor,
  deleteCustomerInputMotor,
  createQuotation,
};