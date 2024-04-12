const FireQuotation = require("../../../models/fire/FireQuotation");
const { Op } = require("sequelize");
const FireRateCategory = require("../../../models/fire/FireRateCategory");
const FireConstantFees = require("../../../models/fire/FireConstantFees.js");
const {
  wallType,
  insurancePeriod,
} = require("../../../utils/fireQuotationConstants");
const {
  eventResourceTypes,
  eventActions,
  Role,
} = require("../../../utils/constants");
const { duration } = require("moment");
const {
  fireApplicableLoadings,
} = require("../../../utils/fireQuotationConstants");
const FireRate = require("../../../models/fire/FireRate");
const Contact = require("../../../models/Contact");
const Employee = require("../../../models/Employee");
const Opportunity = require("../../../models/Opportunity");
const User = require("../../../models/acl/user");
const Branch = require("../../../models/Branch");
const FireShortPeriodRate = require("../../../models/fire/FireShortPeriodRate");
const FireSumInsuredDiscount = require("../../../models/fire/FireSumInsuredDiscount");
const QuotationSetting = require("./../../../models/QuotationSetting");
const {
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserAccessOnlySelf,
  canUserAccessOnlyBranch,
  canUserDelete,
} = require("../../../utils/Authrizations");

//Required package
var fs = require("fs");
var path = require("path");

// Read HTML Template
var html = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/FireQuotationCalculationSheet.html"
  ),
  "utf8"
);

const FireAlliedPerilsRate = require("../../../models/fire/FireAlliedPerilsRate");
const { QuotationCalculationType } = require("../../../utils/constants");
const FireQuotationAlliedPerils = require("../../../models/fire/FireQuotaionAliedPerilsList");
const FireApplicableWarranty = require("../../../models/fire/FireApplicableWarrantys");
const FireLoadingRate = require("../../../models/fire/FireLoadingRate");
const Partner = require("../../../models/partner/Partner");
const ACL = require("../../../models/acl/ACL");
const { formatToCurrency, printPdf } = require("../../../utils/GeneralUtils");
const PDFMerger = require("pdf-merger-js");
const MultipleFireRisk = require("../../../models/fire/FireMultipleRisk.js");
const { log } = require("console");

const getSearch = (st) => {
  return {
    [Op.or]: [
      // { '$fire_rate.occupation$': { [Op.like]: `%${st}%` } },
      // { '$fire_rate_category.name$': { [Op.like]: `%${st}%` } },
      { owner_first_name: { [Op.like]: `%${st}%` } },
      { owner_middle_name: { [Op.like]: `%${st}%` } },
      { owner_last_name: { [Op.like]: `%${st}%` } },
      { owner_phoneNo: { [Op.like]: `%${st}%` } },
      { policy_No: { [Op.like]: `%${st}%` } },
      { wall_type: { [Op.like]: `%${st}%` } },
      { roof_type: { [Op.like]: `%${st}%` } },
      { floor_type: { [Op.like]: `%${st}%` } },
      { duration: { [Op.like]: `%${st}%` } },
      { sumInsured: { [Op.like]: `%${st}%` } },
      { premium: { [Op.like]: `%${st}%` } },
      { expirationDate: { [Op.like]: `%${st}%` } },
      { quotation_no: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getFireQuotation = async (req, res) => {
  
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  
  const { f, r, st, sc, sd } = req.query;
  
  const type = req.type;
  
  const role = req.user.role;
  try {
  
      if (type === "all") {
        const data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
          include: [
            FireRate,
            FireRateCategory,
            Opportunity,
            Branch,
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "owner" },
            { model: User, as: "user" },
            Partner,
            FireAlliedPerilsRate,
          ],
          distinct: true,
        });
        res.status(200).json(data);
      }
      else if (type === "self") {
      
        const data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: getSearch(st),
          include: [
            FireRate,
            FireRateCategory,
            Opportunity,
            Branch,
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "owner" },
            { model: User, as: "user" },
            Partner,
            FireAlliedPerilsRate,
          ],
          subQuery: false,
          where: {
            ownerId: req.user.id ? req.user.id : 0,
          },
        });
        res.status(200).json(data);
      } 
      else if (type === "customer") {
        const customerdata = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
          // include: [
          //   FireRate,
          //   FireRateCategory,
          //   Opportunity,
          //   Branch,
          //   { model: Employee, as: "employee" },
          //   { model: Employee, as: "assignedEmployee" },
          //   { model: User, as: "owner" },
          //   { model: User, as: "user" },
          //   Partner,
          //   FireAlliedPerilsRate,
          // ],
          // subQuery: false,
          // // where: {
          // //   ownerId: req.user.id ? req.user.id : 0,
          // // },
          // where: {
          //   [Op.or]: [{ userId: currentUser.id }, { "$assignedEmployee.userId$": { [Op.like]: `%${currentUser.id}%` }, }]
          // },
          include: [
            { model: User, as: "user", attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] },
          ],
          where: {
            [Op.or]: [{  userId: currentUser.id, }, ],
          }
          
        });
        
        
        res.status(200).json(customerdata);
      } else  if (type === "branch") {
      let employee = await Employee.findOne({ where: { userId: req.user.id } });
      let branchId = employee.branchId;
      const data = await FireQuotation.findAndCountAll({
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        where: getSearch(st),
        include: [
          FireRate,
          FireRateCategory,
          Opportunity,
          Branch,
          { model: Employee, as: "employee" },
          { model: Employee, as: "assignedEmployee" },
          { model: User, as: "owner" },
          { model: User, as: "user" },
          Partner,
          FireAlliedPerilsRate,
        ],
        subQuery: false,
        where: {
          branchId: branchId ? branchId : 0,
        },
      });
      res.status(200).json(data);
    } 
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getAllFireQuotations = async (req, res) => {
  try {
    if (!(await canUserRead(req.user, "fireLoadingRates"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    const data = await FireQuotation.findAndCountAll({
      include: [
        FireRate,
        FireRateCategory,
        Opportunity,
        Branch,
        { model: Employee, as: "employee" },
        { model: Contact, as: "contact" },
        { model: Employee, as: "assignedEmployee" },
        { model: User, as: "owner" },
        { model: User, as: "user" },
        Partner,
        FireAlliedPerilsRate,
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createFireQuotation = async (req, res) => {
  const { id, ...rest } = req.body;

    const {
      owner_first_name,
      owner_middle_name,
      owner_last_name,
      company_name,
      join_individual_name,
      owner_phoneNo,
      branchId,
      coverType,
      sumInsured,
      vehicleId,
      purpose,
      categoryId,
    } = req.body;
    try {

      const savedquotation = await MultipleFireRisk.create({
        requested_by: owner_first_name+' '+owner_middle_name+' '+owner_last_name,
        number_of_risks: 1,
      });
      

      const response = await calculateQuotation({ ...rest,requested_quotation_id: savedquotation.id });
      
      const result = await FireQuotation.findOne({
        where: { id: response.id },
        include: [
          FireRate,
          FireRateCategory,
          Opportunity,
          Branch,
          { model: Employee, as: "employee" },
          { model: Employee, as: "assignedEmployee" },
          { model: User, as: "owner" },
          { model: User, as: "user" },
          { model: Contact, as: "contact" },
          FireAlliedPerilsRate,
          Partner,
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      
      res.status(400).json({ msg: error.message });
    }
  };

const createFireQuotations = async (req, res) => {
  const fireRatesBody = req.body;
  const reqBody = req.body.filter((risk) => risk.owner_first_name != "");
  const { owner_first_name,owner_middle_name,owner_last_name } = reqBody[0];
  
  let response = [];
  let premiums = [];
  let printPath = "/print_files/" + Date.now() + ".pdf";
  const numberOfRisks = req.body.length;
  try {
    let distanceBnBuildings = 0;
    fireRatesBody.map(async (index) => {
      if (index.distance_bn_buildings > distanceBnBuildings) {
        distanceBnBuildings = index.distance_bn_buildings;
      }
    });
    const savedquotation = await MultipleFireRisk.create({
      requested_by: owner_first_name+' '+owner_middle_name+' '+owner_last_name,
      number_of_risks: numberOfRisks,
    });
    

    
    // if (distanceBnBuildings > 15) {


    const promises = fireRatesBody.map(async (index) => {
      const calculatedQuotation = await calculateQuotation({
        ...index,
        requested_quotation_id: savedquotation.id,
      });
    
      
    
      response.push(calculatedQuotation);
    });

   
   
    
    

    await Promise.all(promises).then(async function(result) {
      

    });


      // var promises = fireRatesBody.map(async (index) => {
      //   response.push(await calculateQuotation(index, false, true));
      // });
      

      Promise.all(promises).then(async function (results) {
        var merger = new PDFMerger();
        var prom = response.map(async (element) => {
          await merger.add("." + element.calculation_sheet_path);

        });
        const responses = await Promise.all(promises);




        Promise.all(prom).then(async function (result) {
          await merger.save("." + printPath);

        });
        // res.status(200).json(response);
        

        
        
        let ids = [];
        response.map((element) => {
          ids.push(element.id);
        });
        let fireQuotes = await FireQuotation.update(
          { calculation_sheet_path: printPath },
          { where: { id: ids } }
        );
        if (fireQuotes) {
          let finalResult = await FireQuotation.findAll({
            where: { id: ids },
            include: [
              FireRate,
              FireRateCategory,
              Opportunity,
              Branch,
              { model: Employee, as: "employee" },
              { model: Employee, as: "assignedEmployee" },
              { model: User, as: "owner" },
              { model: User, as: "user" },
              FireAlliedPerilsRate,
              Partner,
            ],
          });
          


        
            
          
          res.status(200).json(finalResult);
          
        }

        
        
        const premiums = response.reduce((finalResult, currentValue) => {
          
          

          return currentValue.premium ? (finalResult * 1) + (currentValue.premium * 1) : (finalResult * 1);
        }, 0);
    
        
    
        // Update MultipleFireRisk with premiums
        await MultipleFireRisk.update(
          { premium: premiums },
          { where: { id: savedquotation.id } }
        );

       
      });
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const calculateQuotation = async (index, editId, isMultiple) => {
  let {
    fireRateId,
    sumInsured,
    have_content_insurance,
    content_sum_insured,
    is_near_fire_birgade,
    is_congested,
    wall_type,
    roof_type,
    floor_type,
    have_security_appliances,
    fire_prone_load,
    poor_house_keeping_load,
    have_branch_discount,
    have_partnership_discount,
    want_voluntary_excess_discount,
    have_loss_ration_discount,
    duration,
    request_type,
    policy_No,
    source_type,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
    owner_phoneNo,
    categoryId,
    class_of_house,
    partnerId,
    branchId,
    assignedTo,
    reportTo,
    ownerId,
    userId,
    fire_allied_perils_rates,
    quotation_no,
    requested_quotation_id,
    
  } = index;
  
  var premium = 0;
  var startDate = new Date();
  var endDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1);
  startDate.setDate(startDate.getDate() + 1);
  endDate.setFullYear(startDate.getFullYear() + 1);

  let startDateUI =
    startDate.getDate() +
    "/" +
    startDate.getMonth() +
    "/" +
    startDate.getFullYear();
  let endDateUI =
    endDate.getDate() +
    "/" +
    Number(endDate.getMonth() + 1) +
    "/" +
    Number(endDate.getFullYear());

  quotation_no = quotation_no
    ? quotation_no
    : "FREQ/" +
    startDate.getFullYear() +
    "" +
    startDate.getMonth() +
    "" +
    startDate.getDate() +
    "" +
    startDate.getUTCHours() +
    "" +
    startDate.getMinutes() +
    "" +
    startDate.getUTCMilliseconds();

    const name = index.source_type
    ? index.source_type == "Corporate"
      ? company_name
      : index.source_type == "Join Individual"
        ? join_individual_name
        : index.source_type == "Individual"
          ? `${owner_first_name} ${owner_middle_name} ${owner_last_name ?? ''}`
          : ""
    : ""
  //print data
  var printData = {
    owner_name: name,
    risk_type: "",
    quotation_no: quotation_no,
    start_date: startDateUI,
    end_date: endDateUI,
    duration: duration,
    sum_insured: formatToCurrency(sumInsured),
    content_sum_insured: formatToCurrency(content_sum_insured ? content_sum_insured : 0),
    rate: "",
    output1: 0,
    loadingAndDiscounts: [],
    alliedPerils: [],
    premium: "",
  };
  try {
    //getting the quotation calculation type definition
    const quotationCalculationType = await QuotationSetting.findAll({
      where: { product: "Fire" },
    });

    //finding rate and calculating premium
    const fireRate = await FireRate.findByPk(Number(fireRateId));
    
    
    
    printData.risk_type = fireRate.occupation ? fireRate.occupation : "";
    let actualFireRate = Number(fireRate.rate) / 10; //per milli
    
    if (wall_type === wallType.concrete) {
      if (!have_content_insurance)
        premium = (Number(sumInsured) * actualFireRate) / 100; //rate percent
      else if (have_content_insurance)
        premium =
          ((Number(sumInsured) + Number(content_sum_insured)) *
            actualFireRate) /
          100; //rate percent
      printData.fireRate = actualFireRate;
      printData.output1 = formatToCurrency(Number(premium).toFixed(2));

      
      printData.rate = (actualFireRate); //register the actual rate for the print data
      
    } else if (wall_type === wallType.metalSheet) {
      actualFireRate = actualFireRate * 1.5; //50 % loading
      if (!have_content_insurance)
        premium = (Number(sumInsured) * actualFireRate) / 100; //rate percent
      else if (have_content_insurance)
        premium =
          ((Number(sumInsured) + Number(content_sum_insured)) *
            actualFireRate) /
          100; //rate percent
      // premium = premium + premium * 0.5; //50 % loading
      printData.rate = (actualFireRate).toFixed(2); //register the actual rate for the print data
      printData.output1 = formatToCurrency(Number(premium).toFixed(2));
      
      
    } else if (wall_type === wallType.wooden) {
      actualFireRate = actualFireRate * 2; // 100 % loading
      if (!have_content_insurance)
        premium = (Number(sumInsured) * actualFireRate) / 100; //rate percent
      else if (!have_content_insurance)
        premium =
          ((Number(sumInsured) + Number(content_sum_insured)) *
            actualFireRate) /
          100; //rate percent
      printData.rate = (actualFireRate).toFixed(); //register the actual rate for the print data
      printData.output1 = formatToCurrency(Number(premium).toFixed(2));
      
      
    }

    //calculations type
    if (
      quotationCalculationType[0].quotationCalculation ===
      QuotationCalculationType.cascading
    ) {
      //Loadings
      //area Loading
      let applicableLoads = await FireLoadingRate.findAll({
        where: { name: fireApplicableLoadings.areaLoading },
      }); //fetch the area load
      if (is_congested) {
        printData.loadingAndDiscounts.push({
          name: applicableLoads[0].name,
          rate: applicableLoads[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    applicableLoads[0].rate ? applicableLoads[0].rate : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) +
          (Number(premium) *
            (applicableLoads[0].rate ? applicableLoads[0].rate : 0)) /
          100; //apply the discount
      }

      //Fire Prone Loading
      if (fire_prone_load) {
        const applicableFireProneLoad = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.fireProneLoad },
        }); //fetch the fire prone load
        printData.loadingAndDiscounts.push({
          name: applicableFireProneLoad[0].name,
          rate: applicableFireProneLoad[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    applicableFireProneLoad[0].rate
                      ? applicableFireProneLoad[0].rate
                      : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) +
          (Number(premium) *
            (applicableFireProneLoad[0].rate
              ? applicableFireProneLoad[0].rate
              : 0)) /
          100;
        //apply the discount
      }

      //Poor House Keeping Loading
      if (poor_house_keeping_load) {
        let poorHouseKeepingLoad = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.poorHouseKeeping },
        }); //fetch the  poor house keeping load
        printData.loadingAndDiscounts.push({
          name: poorHouseKeepingLoad[0].name,
          rate: poorHouseKeepingLoad[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    poorHouseKeepingLoad[0].rate
                      ? poorHouseKeepingLoad[0].rate
                      : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) +
          (Number(premium) *
            (poorHouseKeepingLoad[0].rate ? poorHouseKeepingLoad[0].rate : 0)) /
          100; //apply the discount
      }

      //Discounts
      //area discount
      if (
        is_near_fire_birgade &&
        is_near_fire_birgade !== fireApplicableLoadings.noAreaDiscount
      ) {
        applicableLoads = await FireLoadingRate.findAll({
          where: { name: is_near_fire_birgade },
        }); //fetch the aread discount
        printData.loadingAndDiscounts.push({
          name: applicableLoads[0].name,
          rate: applicableLoads[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    applicableLoads[0].rate ? applicableLoads[0].rate : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) -
          (Number(premium) *
            (applicableLoads[0].rate ? applicableLoads[0].rate : 0)) /
          100; //apply the discount
      }

      //SI Discount
      if (sumInsured) {
        let rates = await FireSumInsuredDiscount.findAll(); //fetch all SI discount rates
        let sumInsuredDiscountRate = 0;
        rates.forEach((siRate) => {
          //identify the right discount rate
          if (
            Number(sumInsured) > siRate.minimum_amount &&
            Number(sumInsured) <= siRate.maximum_amount
          )
            sumInsuredDiscountRate = siRate.rate;
        });
        

        if (sumInsuredDiscountRate > 0) {
          printData.loadingAndDiscounts.push({
            name: "Sum Insured Discount",
            rate: sumInsuredDiscountRate + "%",
            premium:

              formatToCurrency(
                (
                  (Number(premium) * Number(sumInsuredDiscountRate)) /
                  100
                ).toFixed(2)
              ),
          });
          premium = premium - premium * (sumInsuredDiscountRate / 100); //discount the rate
        }
        
      }

      //security appliance discount
      if (have_security_appliances) {
        applicableLoads = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.securityApplianceDiscount },
        }); //fetch the aread discount
        printData.loadingAndDiscounts.push({
          name: applicableLoads[0].name,
          rate: applicableLoads[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    applicableLoads[0].rate ? applicableLoads[0].rate : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) -
          (Number(premium) *
            (applicableLoads[0].rate ? applicableLoads[0].rate : 0)) /
          100; //apply the discount
      }

      //Voluntanry Excess discount
      if (want_voluntary_excess_discount) {
        let voluntaryDiscount = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.voulentaryExcessDiscount },
        }); //fetch the voluntary excess discount
        printData.loadingAndDiscounts.push({
          name: voluntaryDiscount[0].name,
          rate: voluntaryDiscount[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    voluntaryDiscount[0].rate ? voluntaryDiscount[0].rate : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) -
          (Number(premium) *
            (voluntaryDiscount
              ? voluntaryDiscount[0]
                ? voluntaryDiscount[0].rate
                : 0
              : 0)) /
          100; //apply the discount
      }

      //Loss Ratio discount
      if (have_loss_ration_discount) {
        let lossRatioDiscount = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.lossRatioDiscount },
        }); //fetch the loss ratio discount
        printData.loadingAndDiscounts.push({
          name: lossRatioDiscount[0].name,
          rate: lossRatioDiscount[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    lossRatioDiscount[0].rate ? lossRatioDiscount[0].rate : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) -
          (Number(premium) *
            (lossRatioDiscount[0].rate ? lossRatioDiscount[0].rate : 0)) /
          100; //apply the discount
      }

      //Partnership discount
      if (have_partnership_discount && partnerId) {
        let partnershipDiscount = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.partnershipDiscount },
        }); //fetch the  partnership discount rate
        printData.loadingAndDiscounts.push({
          name: partnershipDiscount[0].name,
          rate: partnershipDiscount[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  Number(
                    partnershipDiscount[0].rate
                      ? partnershipDiscount[0].rate
                      : 0
                  )) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) -
          (Number(premium) *
            (partnershipDiscount[0].rate ? partnershipDiscount[0].rate : 0)) /
          100; //apply the discount
      }

      //Branch discount
      if (have_branch_discount) {
        const branchDiscount = await FireLoadingRate.findAll({
          where: { name: fireApplicableLoadings.branchDiscount },
        }); //fetch the  partnership discount rate
        printData.loadingAndDiscounts.push({
          name: branchDiscount[0].name,
          rate: branchDiscount[0].rate + "%",
          premium:

            formatToCurrency(
              (
                (Number(premium) *
                  (branchDiscount[0].rate ? branchDiscount[0].rate : 0)) /
                100
              ).toFixed(2)
            ),
        }); //record the data for print
        premium =
          Number(premium) -
          (Number(premium) *
            (branchDiscount[0].rate ? branchDiscount[0].rate : 0)) /
          100; //apply the discount
      }
    }

    //allied perils calculation
    if (fire_allied_perils_rates.length > 0) {
      fire_allied_perils_rates.map((peril) => {
        let perilRate = peril.rate; //find individual peril rate
        printData.alliedPerils.push({
          name: peril.alliedPerilName,
          rate: peril.rate,
          premium: formatToCurrency(
            (
              (((Number(sumInsured) + Number(content_sum_insured)) * Number(peril.rate)) / 100)
            ).toFixed(2)
          ),
        }); //register for the print
        premium =
          Number(premium) + (((Number(sumInsured) + Number(content_sum_insured)) * Number(peril.rate)) / 100); //apply the rate per mill
      });
    }

    //Period discounts
    if (duration === insurancePeriod.oneYear) {
      //No period discount
    }

    //half year
    else if (duration === insurancePeriod.halfYear) {
      let rates = await FireShortPeriodRate.findAll(); //fetch all short period rates
      var shortPeriodRate = 0;
      rates.forEach((rate) => {
        if (175 > rate.minDuration && Number(duration) <= 182)
          shortPeriodRate = rate.rate;
      }); //identify the right rate
      
      

      const policyEndDate = new Date(startDate);
      policyEndDate.setDate(policyEndDate.getDate() + 180);
      printData.end_date =
        policyEndDate.getDate() +
        "/" +
        policyEndDate.getMonth() +
        "/" +
        policyEndDate.getFullYear();

      if (shortPeriodRate > 0) {
        premium = premium * (shortPeriodRate / 100); //apply the rate
        printData.loadingAndDiscounts.push({
          name: "For the given days",
          rate: 182,
          premium: formatToCurrency(Number(premium).toFixed(2)),
        });
      }
    }
    //quarter year
    else if (duration === insurancePeriod.threeMonths) {
      let rates = await FireShortPeriodRate.findAll(); //fetch all short period rates
      var shortPeriodRate = 0;
      rates.forEach((rate) => {
        if ((rate.maxDuration = 90)) shortPeriodRate = rate.rate;
      }); //identify the right rate
      
      
      const policyEndDate = new Date(startDate);
      policyEndDate.setDate(policyEndDate.getDate() + 90);
      printData.end_date =
        policyEndDate.getDate() +
        "/" +
        policyEndDate.getMonth() +
        "/" +
        policyEndDate.getFullYear();

      if (shortPeriodRate > 0) {
        premium = premium * (shortPeriodRate / 100); //apply the rate
        printData.loadingAndDiscounts.push({
          name: "For the given days",
          rate: 90,
          premium: formatToCurrency(Number(premium).toFixed(2)),
        });
      }
    }

    //if the person specifies the day
    else {
      let rates = await FireShortPeriodRate.findAll(); //fetch all short period rates
      var shortPeriodRate = 0;
      rates.forEach((rate) => {
        if (
          Number(duration) > rate.minDuration &&
          Number(duration) <= rate.maxDuration
        )
          shortPeriodRate = rate.rate;
      });
      printData.duration = duration + " days";

      const policyEndDate = new Date(startDate);
      policyEndDate.setDate(policyEndDate.getDate() + Number(duration));
      printData.end_date =
        policyEndDate.getDate() +
        "/" +
        policyEndDate.getMonth() +
        "/" +
        policyEndDate.getFullYear();
      
      

      if (shortPeriodRate > 0) {
        premium = premium * (shortPeriodRate / 100);
        printData.loadingAndDiscounts.push({
          name: "For the given days",
          rate: shortPeriodRate + "%",
          premium: formatToCurrency(Number(premium).toFixed(2)),
        });
      }
    }

    premium = Number(premium).toFixed(2);

    // Constant percentage fees
    let constantFees = await FireConstantFees.findAll({
      where: { isPercentage: true },
    });
    constantFees.forEach((fee) => {
      if (fee.isPercentage) {
        premium = (
          Number(premium) +
          (Number(premium) * Number(fee.rate)) / 100
        ).toFixed(2);
        printData.loadingAndDiscounts.push({
          name: fee.name,
          rate: fee.rate + "%",
          premium: formatToCurrency(
            ((Number(premium) * Number(fee.rate)) / 100).toFixed(2)
          ),
        });
      }
    });

    //fees added
    let fees = await FireConstantFees.findAll({
      where: { isPercentage: false },
    });
    fees.forEach((fee) => {
      premium = Number(premium) + Number(fee.rate);
      printData.loadingAndDiscounts.push({
        name: fee.name,
        rate: "",
        premium: formatToCurrency(fee.rate),
      });
    });

    //set premium on the print data
    printData.premium = formatToCurrency(Number(premium));

    //persisiting the data
    //create lead
    const contact = {
      type: typeof source_type !== 'undefined' ? source_type : index.contact.type,
      // companyName: "",
      firstName: owner_first_name,
      middleName: owner_middle_name,
      lastName: owner_last_name,
      companyName: company_name, 
      joinIndividualName: join_individual_name, 
      // middleName: "",
      // primaryEmail: "",
      primaryPhone: owner_phoneNo,
      business_source_type: "Direct",
      business_source: "",
      status: "leads",
      deleted: false,
      branchId: branchId,
      fire_productId: categoryId | 0,
  };
  

    const created_contact = await Contact.create(contact);
    let leadId = created_contact.id || 0;

    //expiration date
    // let expirationDate = new Date();
    // expirationDate.setMonth(expirationDate.getMonth() + 3);
    // expirationDate = expirationDate.toDateString();
    let expirationDate =
    endDate.getDate() +
    "/" +
    Number(endDate.getMonth() + 1) +
    "/" +
    Number(endDate.getFullYear());


    //print data
    var document = {
      html: html,
      data: printData,
      path: "./print_files/" + Date.now() + ".pdf",
      type: "",
    };
    await printPdf(document);
    let calculation_sheet_path = document.path.substring(1);

    //additional perils id array
    let ids = [];
    if (fire_allied_perils_rates.length > 0) {
      fire_allied_perils_rates.forEach((peril) => {
        ids.push(peril.id);
      });
    }
    if (editId) {
      await FireQuotationAlliedPerils.destroy({
        where: { fireQuotationId: editId },
      });
      //Persisting Fire Quotation Data
      let fireQuotation = await FireQuotation.update(
        {
          fireRateId,
          sumInsured,
          is_near_fire_birgade,
          wall_type,
          roof_type,
          floor_type,
          have_security_appliances,
          have_security_appliances,
          fire_prone_load,
          poor_house_keeping_load,
          have_branch_discount,
          have_partnership_discount,
          want_voluntary_excess_discount,
          have_loss_ration_discount,
          duration,
          request_type,
          policy_No,
          owner_first_name,
          owner_middle_name,
          owner_last_name,
          company_name,
          join_individual_name,
          owner_phoneNo,
          categoryId,
          class_of_house,
          branchId,
          assignedTo,
          reportTo,
          ownerId,
          partnerId,
          userId,
          premium,
          leadId,
          expirationDate,
          calculation_sheet_path,
          quotation_no,
        },
        { where: { id: editId } }
      );
      let resp = await FireQuotation.findOne({ where: { id: editId } }).then(
        (quote) => {
          quote.setFire_allied_perils_rates(ids, {
            through: FireQuotationAlliedPerils,
          });
          return quote;
        }
      );
      return resp;
    } else {
      //Persisting Fire Quotation Data
      let newfireQuotation = await FireQuotation.create({
        fireRateId,
        sumInsured,
        have_content_insurance,
        content_sum_insured,
        is_near_fire_birgade,
        wall_type,
        roof_type,
        floor_type,
        have_security_appliances,
        fire_prone_load,
        poor_house_keeping_load,
        have_branch_discount,
        have_partnership_discount,
        want_voluntary_excess_discount,
        have_loss_ration_discount,
        duration,
        request_type,
        policy_No,
        owner_first_name,
        owner_middle_name,
        owner_last_name,
        company_name,
        join_individual_name,
        owner_phoneNo,
        categoryId,
        class_of_house,
        branchId,
        assignedTo,
        reportTo,
        ownerId,
        partnerId,
        userId,
        premium,
        leadId,
        expirationDate,
        calculation_sheet_path,
        quotation_no,
        requested_quotation_id,
      }).then(async (quote) => {
        await quote.addFire_allied_perils_rates(ids, {
          through: FireQuotationAlliedPerils,
        });
        return quote;
      });
      return newfireQuotation;
    }
  } catch (error) {
    
    return { msg: error.message };
  }
};


const getFireQuotationByPk = async (req, res) => {
  try {
    const fireRate = await FireQuotation.findByPk(req.params.id, {
      include: [
        FireRate,
        FireRateCategory,
        Opportunity,
        Branch,
        { model: Employee, as: "employee" },
        { model: Employee, as: "assignedEmployee" },
        { model: User, as: "owner" },
        { model: User, as: "user" },
        { model: Contact, as: "contact" },
        Partner,
        FireAlliedPerilsRate,
      ],
    }).then(function (fireRate) {
      if (!fireRate) {
        res.status(404).json({ message: "No Data Found" });
      } else res.status(200).json(fireRate);
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFireQuotationsByGroup = async (req, res) => {
  
  
  const { f, r, st, sc, sd, id } = req.query;
  
  
  const role = req.user.role;
  
  
  try {
    switch (role) {
      case Role.superAdmin:
        data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          // where: getSearch(st),
          where: {requested_quotation_id : id},
          include: [
            //  { model: Employee, as: "employee"}, , {model: User, as: "owner"},  VehicleCategory
            //  {model: Employee, as: "assignedEmployee"},
            { model: User, as: "user" },
           
            Opportunity,
            { model: Branch, as: "branch" },
          ],
        });
        res.status(200).json(data);
        break;
      case Role.sales:
        data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "owner" },
            { model: User, as: "user" },
            VehicleCategory,
           
            Opportunity,
          ],
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    "$assignedEmployee.userId$": {
                      [Op.like]: `%${req.user.id}%`,
                    },
                  },
                  { "$employee.userId$": { [Op.like]: `%${req.user.id}%` } },
                ],
              },
              getSearch(st),
              { id },
            ],
          },
        });
        res.status(200).json(data);
        break;
      case Role.branchManager:
        data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "owner" },
            { model: User, as: "user" },
            VehicleCategory,
        
            Opportunity,
          ],
          where: {
            [Op.and]: [
              {
                "$assignedEmployee.userId$": { [Op.like]: `%${req.user.id}%` },
              },
              getSearch(st),
              { id },
            ],
          },
        });
        res.status(200).json(data);
        break;
      case Role.agent:
        data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          include: [
            { model: Employee, as: "employee" },
            { model: Employee, as: "assignedEmployee" },
            VehicleCategory,
      
            Opportunity,
            { model: User, as: "user" },
            { model: User, as: "owner" },
          ],
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          where: {
            [Op.and]: [
              { userId: { [Op.like]: `%${req.user.id}%` } },
              getSearch(st),
              { id },
            ],
          },
        });
        res.status(200).json(data);
        break;
      case Role.customer:
        data = await FireQuotation.findAndCountAll({
          offset: Number(f),
          limit: Number(r),
          order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
          include: [
            { model: Employee, as: "assignedEmployee" },
            { model: User, as: "user" },
          ],
          where: {
            [Op.and]: [
              {
                userId: id,
              },
              getSearch(st),
            ],
          },
        });
        res.status(200).json(data);
        break;
      default:
        break;
    }
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};




const getNotifications = async (req, res) => {
  const currentUser = await User.findByPk(req.user.id, {
    include: [Employee],
  });
  try {
   
    if (req.type == "branch") {
      let employee = await Employee.findOne({ where: { userId: currentUser.id } });
      let branchId = employee.branchId;
      const fireRate = await FireQuotation.findAndCountAll({
        include: [
          FireRate,
          FireRateCategory,
          Opportunity,
          Branch,
          { model: Employee, as: "employee" },
          { model: Employee, as: "assignedEmployee" },
          { model: User, as: "owner" },
          { model: User, as: "user" },
          { model: Contact, as: "contact" },
          Partner,
          FireAlliedPerilsRate,
        ],
        where: {
          want_negotiation: true,
          branchId: branchId,
        },
      }).then(function (fireRate) {
        if (!fireRate) {
          res.status(404).json({ message: "No Data Found" });
        } else res.status(200).json(fireRate);
      });
    } else {
      res.status(200).json({ message: "No Data Found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editFireQuotation = async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    console.log("the isdnfs",req.body)
    let response = await calculateQuotation(req.body, id);
    console.log("the inside the proposal",response)
    let quotes = await FireQuotation.findByPk(response.id, {
      include: [
        FireRate,
        FireRateCategory,
        Opportunity,
        Branch,
        { model: Employee, as: "employee" },
        { model: Employee, as: "assignedEmployee" },
        { model: User, as: "owner" },
        { model: User, as: "user" },
        { model: Contact, as: "contact" },
        FireAlliedPerilsRate,
        Partner,
      ],
      distinct: true,
    });
    // FireQuotation.update(response, { where: { id: id } });
    
    res.status(200).json(quotes);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const deleteFireQuotation = async (req, res) => {
  const id = req.params.id;
  try {
    if (!(await canUserDelete(req.user, "fireQuotations"))) {
      return res.status(401).json({ msg: "unauthorized access!" });
    }
    FireQuotation.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const notifyBranchManager = async (req, res) => {
  try {
    const id = req.params.id;

    // let roles = await ACL.findAll({
    //   where: { path: "fireQuotations", onlyMyBranch: true },
    // });
    // let userIds = await UserGroup.findAll({
    //   where: { groupId: roles[0].groupId ? roles[0].groupId : 0 },
    // });
    //find users and send them messges.

    const quotation = await FireQuotation.findByPk(id);
    let updatedQuotation = await FireQuotation.update(
      { ...quotation, want_negotiation: true },
      { where: { id: id } }
    );

    res.status(200).json(updatedQuotation);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const generateReport = async (req, res) => {

  let quotation;
  console.log("quo report req", req.user.role)

  if (!(await canUserRead(req.user, "fireQuotations"))) {
    return res.status(401).json({ msg: "unauthorized access!" });
  }

  const { f, r, st, sc, sd, purpose } = req.query;
  const {
    quotation_numbers,
    names,
    phone_numbers,
    categorys,
    occupations,
    startDate,
    endDate
  } = req.body;
  const role = req.user.role;

  let formattedStartDate;
  let formattedEndDate;

  if (startDate) {
    formattedStartDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    formattedEndDate = new Date(new Date(endDate).setHours(23, 59, 59, 0));
  }

  const pagination = purpose === "export" || {
    offset: Number(f),
    limit: Number(r),
  };

  console.log("generateReport", req.body, categorys)


  try {
    if (role == Role.superAdmin) {
      const conditions = {
        [Op.and]: [
          quotation_numbers && quotation_numbers.length !== 0 && quotation_numbers[0] !== 0
            ? {
              quotation_no: {
                [Op.in]: quotation_numbers,
              },
            }
            : {},
          names && names.length !== 0 && names[0] !== 0
            ? {
                [Op.or]: {
                  [Op.and]: {
                    owner_first_name: {
                      [Op.in]: names.map((name)=> {
                        let nameParts = name.split(' ')
                        console.log("nameParts[0]", nameParts[0])
                        return nameParts[0];
                      })
                    },
                    owner_middle_name: {
                      [Op.eq]: names.map((name)=> {
                        let nameParts = name.split(' ')
                        console.log("nameParts[1]", nameParts[1])

                        return nameParts[1];
                      })
                    },
                  },
                  company_name: {
                    [Op.in]: names,
                  },
                  join_individual_name: {
                    [Op.in]: names,
                  },
                },
              }
            : {},
          phone_numbers && phone_numbers.length !== 0 && phone_numbers[0] !== 0
            ? {
              owner_phoneNo: {
                [Op.in]: phone_numbers,
              },
            }
            : {},
          categorys && categorys.length !== 0 && categorys[0] !== 0
            ? {
              categoryId: {
                [Op.in]: categorys.map((category) => {
                  return category
                }),
              },
            }
            : {},
          occupations && occupations.length !== 0 && occupations[0] !== 0
            ? {
              fireRateId: {
                [Op.in]: occupations.map((occupation) => {
                  return occupation
                }),
              },
            }
            : {},
          formattedStartDate ? { createdAt: { [Op.gte]: formattedStartDate } } : {},
          formattedEndDate ? { createdAt: { [Op.lte]: formattedEndDate } } : {},
        ],
      };

      console.log("condition is  ", conditions);

      quotation = await FireQuotation.findAndCountAll({
        include: [
          FireRate,
          FireRateCategory,
        ],
        subQuery: false,
        ...pagination,
        order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
        distinct: true,
        where: {
          ...conditions,
        },
      });
    }

    if (await canUserAccessOnlySelf(req.user, "fireQuotations")) {
      quotation = await FireQuotation.findAll({
        include: [User],
        order: [["createdAt", "DESC"]],
        where: {
          ...pagination,
          "$user.id$": req.user.id,
          deleted: false,
        },
      });
    }

    console.log("quo report====", quotation)
    if (!quotation) {
      res.status(404).json({ message: "No Data Found" });
    } else res.status(200).json(quotation);
  } catch (error) {
    console.log("the error is ", error);
    res.status(400).json({ msg: error.message });
  }
};

const getAllFireQuotationsReport = async (req, res) => {
  try {
    const data = await FireQuotation.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getFireQuotation,
  getAllFireQuotations,
  createFireQuotation,
  createFireQuotations,
  getFireQuotationByPk,
  getFireQuotationsByGroup,
  getNotifications,
  editFireQuotation,
  deleteFireQuotation,
  notifyBranchManager,
  generateReport,
  getAllFireQuotationsReport
};