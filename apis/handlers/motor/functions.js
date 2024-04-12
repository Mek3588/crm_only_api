const { Op } = require("sequelize");
const AgeLoad = require("../../../models/AgeLoad");
const BSG = require("../../../models/BSG");
const PeriodRate = require("../../../models/PeriodRate");
const QuotationSetting = require("../../../models/QuotationSetting");
const ComprehensiveTp = require("../../../models/ComprehnsicveTp")
const Setting = require("../../../models/Setting");
const TerritorialExtension = require("../../../models/TerritorialExtension");
const DailyCashAllowanceCoverRate = require("../../../models/motor/DailyCashAllowanceCoverRate");
const {
  wallType,
  insurancePeriod,
} = require("../../../utils/fireQuotationConstants");
const {
  vehicleTypesModelsMap,
  getSearchModelAndConditions,
  QuotationCalculationType,
  MotorCoverType,
  getTpSearchModelAndConditions,
  tpVehicleTypesModelsMap,
  vehicleTypes,
  purposes,
  motorFields,
  comprehensivetypes,
} = require("../../../utils/constants");
const Contact = require("../../../models/Contact");
const Quotation = require("../../../models/Quotation");
const TpUnitPrice = require("../../../models/quotation/tp_unitPrice");
const TruckTankerTp = require("../../../models/TruckTankerTp");
const { formatToCurrency, printPdf, printPdfLandScape, generateNumber } = require("../../../utils/GeneralUtils");
//Required package
var fs = require("fs");
var path = require("path");
const CoverRate = require("../../../models/CoverRate");
const PDFMerger = require("pdf-merger-js");
const { log } = require("console");
const LimitedCoverRate = require("../../../models/motor/LimitedCoverRate");
const YellowCard = require("../../../models/YellowCard");
const YellowCardShort = require("../../../models/YellowCardShort");
const TipperMotorSpecialTp = require("../../../models/TipperMotorSpecial");
const Addons = require("../../../models/motor/Addons");
const motorProposal = require("../../../models/proposals/MotorProposal");
const MultipleProposalData = require("../../../models/motor/MultipleProposalData");
const Branch = require("../../../models/Branch");
const { type } = require("os");
// const motorFields= require("../../../utils/constants")
// Read HTML Template
var html = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/MotorQuotationCalculationSheet.html"
  ),
  "utf8"
);

var motorScheduleHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/MotorScheduleTemplate.html"
  ),
  "utf8"
);
var html2 = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/MotorComprehensiveCalculationSheet.html"
  ),
  "utf8"
);

var multipleMotorScheduleHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/MotorMultipleRiskScheduleTemplate.html"
  ),
  "utf8"
);

var multipleMotorTruckScheduleHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/MotorTruckMultipleRiskScheduleTemplate.html"
  ),
  "utf8"
);

var fireAndTheftEndorsementHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/endorsement/third_party/FireAndTheftEndorsement.html"
  ),
  "utf8"
);

var fireEndorsementHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/endorsement/third_party/FireEndorsement.html"
  ),
  "utf8"
);

var TheftEndorsementHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../../templates/endorsement/third_party/TheftEndorsement.html"
  ),
  "utf8"
);

const getODPremium = async (body) => {

  let quotation = 0;
  let msg = "";
  let {
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
    insurance_type,
    owner_phoneNo,
    business_source,
    branchId,
    duration,
    vehicle_type,
    bsg_vehicle,
    manufactured_date,
    made_of,
    coverType,
    sumInsured,
    selectedChargeRates,
    cc,
    userId,
    used_for,
    vehicleId,
    vehicleRateChartId,
    addonCoversList,
    dailyCashAllowance,
    teritorialExtensionCountrysList,
    carrying_capacity,
    purpose,
    additional_drivers,
    is_trailer,
    quotation_no,
    quotationId,
    comprehensive_cover_type_id,
    other_daily_cash,
    dailyCashAllowanceduration,


  } = body;

  // console.log("topings",dailyCashAllowanceduration)
  console.log("getODPremsssssssium",addonCoversList)

  // const addonResult = await saveAddon(addonCoversList);




  let older = false;
  const thisYear = new Date().getFullYear();
  const commingDate = new Date(manufactured_date).getFullYear();
  const age = thisYear - commingDate;
  if (age > 35) {
    older = true;
  }

    // const coming_manufactured_date = new Date(body.manufactured_date);
    // coming_manufactured_date.setDate(coming_manufactured_date.getDate() + 1);
    // const formattedmanufactured_date = coming_manufactured_date.toDateString().split('T')[0];
    // body.manufactured_date = formattedmanufactured_date;
    const coming_manufactured_date = new Date(body.manufactured_date);
    coming_manufactured_date.setDate(coming_manufactured_date.getDate() + 1);
    const year = coming_manufactured_date.getFullYear();
    body.manufactured_date = year.toString();
  // find the effectiveFrom date from motor proposal table
  // const motorProposalData = await motorProposal.findOne({
  //   where: {quotationId, quotationId },
  //   raw: true,
  // });

  // 

  // Now check whether effectiveFrom date is not before today

  let startDate = new Date();
  //   if (new Date(motorProposalData.effectiveFrom.getDate()) < new Date(startDate.getDate()) && motorProposalData.effectiveFrom !== null) {
  //     .
  //     effectiveFrom = startDate;
  //   } else {
  //     effectiveFrom = new Date(motorProposalData.effectiveFrom);
  //   }

  // startDate = effectiveFrom;

  // let startDate = new Date();

  let endDate = new Date(startDate);
  startDate.setMonth(startDate.getMonth() + 1);
  startDate.setDate(startDate.getDate() + 1);
  endDate.setFullYear(startDate.getFullYear() + 1);

  const startDateUI =
    startDate.getDate() +
    "/" +
    startDate.getMonth() +
    "/" +
    startDate.getFullYear();
  const endDateUI =
    endDate.getDate() +
    "/" +
    Number(endDate.getMonth() + 1) +
    "/" +
    Number(endDate.getFullYear());

  quotation_no = quotation_no
    ? quotation_no
    : "MOTQ/" +
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

  const name = body.type
    ? body.type == "Corporate"
      ? company_name
      : body.type == "Join Individual"
        ? join_individual_name
        : body.type == "Individual"
          ? `${owner_first_name} ${owner_middle_name} ${owner_last_name ?? ''}`
          : ""
    : ""

  //print data
  let printData = {
    owner_name: name,
    cover_type: "Own Damage",
    quotation_no: quotation_no,
    start_date: startDateUI,
    end_date: endDateUI,
    duration: duration,
    sum_insured: formatToCurrency(sumInsured),
    vehicle_type: vehicle_type,
    rate: "",
    vehicle_purpose: purpose,
    output1: "",
    year: "",
    isTP: true,
    loadingAndDiscounts: [],
    addonCovers: [],
    premium: "",

  };


  // Print multiple motor schedule data
  // let printMultipleMotorScheduleData = {
  //   plate_no: 0,
  //   chassis_no: 0,
  //   engine_no: 0,
  //   vehicle_type: "",
  //   cc: 0,
  //   year_of_manufacture: "",
  //   seating_capacity: "",
  //   carrying_capacity: "",
  //   sum_insured: sumInsured,
  // }

  let financeObj = {
    sum_insured: sumInsured,
    premium: 0,
    tp_fund_levy: 0,
    revenue_stamp: 0,
    excess_cont: 0,
    other: 0,
    sum: 0,
  }

  

  const quotationCalculationType = await QuotationSetting.findAll({
    where: { product: "Motor" },
  });

  const comprehensivetype = await ComprehensiveTp.findAll({
    where: { id: comprehensive_cover_type_id }
  });


  if (vehicle_type == "")
    return {
      quotation: 0,
      printData: {},
      msg: "Vehicle type is not selected.",
    };



  let temp = getSearchModelAndConditions(vehicle_type, body);


  for (let key in temp) {


    if (key == "isTrailer") {


      if (temp[key] == false) {
        temp[key] = null;
      }


    } else if (key == "driverType") {
      if (temp[key] == '') {
        temp[key] = null;
      }
    }
  }
  let vehicles = await vehicleTypesModelsMap[vehicle_type].findAll({
    where: temp,
  });


  if (!vehicles || vehicles.length == 0) {

    return { quotation: 0, printData: {}, msg: "This vehicle is unsupported. Please check your input." };
  }
  const manufacturedDate = new Date(manufactured_date);
  printData.year = manufacturedDate.getFullYear() + "";
  const manufacturedYear = manufacturedDate.getFullYear();
  let vehicle;
  vehicles.forEach((currentVehicle) => {
    let minManufacturedYear = currentVehicle.min_manufactured_year
      ? new Date(currentVehicle.min_manufactured_year).getFullYear()
      : 0;
    let maxManufacturedYear = currentVehicle.max_manufactured_year
      ? new Date(currentVehicle.max_manufactured_year).getFullYear()
      : 0;
    if (
      minManufacturedYear <= manufacturedYear &&
      maxManufacturedYear >= manufacturedYear
    ) {
      vehicle = currentVehicle;
    }
  });

  if (!vehicle) vehicle = vehicles[0];
  let vehicleRate = vehicle ? vehicle.rate : 0;
  printData.vehicle_type = vehicle.vehicleType;
  printData.rate = vehicleRate;

  if (
    quotationCalculationType[0].quotationCalculation ===
    QuotationCalculationType.cascading
  ) {

    const thisYear = new Date().getFullYear();
    let age = thisYear - manufacturedYear;

    if (isNaN(age)) age = 1000;
    const ageLoadObject = await AgeLoad.findAll({
      where: {
        min_age: { [Op.lte]: age },
        max_age: { [Op.gte]: age },
        made_of: made_of || 1,
      },
    });

    let ageLoadRate = 0;
    if (Array.isArray(ageLoadObject) && ageLoadObject.length > 0) {
      ageLoadRate = ageLoadObject[0].load_rate;
    }
    
    quotation = (Number(sumInsured) * Number(vehicleRate)) / 100;
    printData.output1 = formatToCurrency(quotation.toFixed(2));
   
    if (ageLoadRate)
      printData.loadingAndDiscounts.push({
        name: "Age Load",
        rate: ageLoadRate + "%",
        premium: formatToCurrency((quotation * (ageLoadRate / 100)).toFixed(2)),
      });

    quotation = quotation + quotation * (ageLoadRate / 100);


    if (selectedChargeRates) {
      const toBoSorted = [...selectedChargeRates];
      selectedChargeRates = [];

      for (let i = 0; i < toBoSorted.length; i++) {
        let selectedChargeRate = toBoSorted[i];
        if (selectedChargeRate.isLoading) {
          selectedChargeRates.push(selectedChargeRate);
        }
      }
      for (let i = 0; i < toBoSorted.length; i++) {
        let selectedChargeRate = toBoSorted[i];
        if (!selectedChargeRate.isLoading) {
          selectedChargeRates.push(selectedChargeRate);
        }
      }

      selectedChargeRates.forEach((selectedChargeRate) => {
        printData.loadingAndDiscounts.push({
          name: selectedChargeRate.chargeReson,
          rate: selectedChargeRate.rate,
          premium: formatToCurrency(
            (quotation * (selectedChargeRate.rate / 100)).toFixed(2)
          ),
        });
        if (selectedChargeRate.isLoading) {
          quotation = quotation + quotation * (selectedChargeRate.rate / 100);
        } else {
          quotation = quotation - quotation * (selectedChargeRate.rate / 100);
        }
      });

      quotation = Number(quotation.toFixed(2));
    }
  } else if (
    quotationCalculationType[0].quotationCalculation ===
    QuotationCalculationType.flat
  ) {
    quotation = sumInsured * (vehicleRate / 100);
    quotation = quotation.toFixed(2);
  }

  //Additional coverss

  let addonJSON = {
    ignition_sum_insured: 0,
    property_limit_extension_amount: 0,
    bodt_limit_extension_amount: 0,
    dailyCash_benefit: 0,
    dailyCash_duration: '',
    territorial_countryId: 0,
    ignition_key_premium: 0,
    TP_limit_extension_premium: 0,
    bsg_premium: 0,
    dailyCash_premium: 0,
    flood_premium: 0,
    territorialExtension__premium: 0,
    yellow_card_vehicle_type: '',
    period: '',
    yellowCard_premium: 0,
    bsg_vehicle: '',



  }


  // Promise.all((promises).then(function(results){}))
  addonCoversList?.map(async (addOn) => {


    switch (addOn.flag) {
      case MotorCoverType.comprehensive_tp:
        const basicPremium = cc * 0.1 + 300;
        let cost = 0;
        let amount = 0;
        console.log("conmsasf", comprehensivetype)
        comprehensivetype.forEach(item => {
          if (item.isRate === false) {
            amount = item.amount / 100;
            console.log("amountsdd", amount);
          }

          else {

            amount = item.amount;
          }
        });
        // if (comprehensivetype.vehicleType === comprehensivetypes.agricultural_vehicles_machineries) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.bus) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.car_hire_taxi) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.general_cartage) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.learners) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.minibus) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.motor_cycle) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.motor_trade) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.own_goods) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.private_vehicles) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.special_vehicles) {
        //   cost = basicPremium * (1 + amount);
        // } else if (comprehensivetype.vehicleType === comprehensivetypes.tanker) {
        //   cost = basicPremium * (1 + amount);
        // }
        cost = basicPremium * (amount);
        quotation = Number(quotation) + cost;
        // (Number(sumInsured) * Number(bsgCover[0].rate)) / 100;
        quotation = Number(quotation.toFixed(2));
        printData.addonCovers.push({
          name: MotorCoverType.comprehensive_tp,
          rate: amount,
          premium: formatToCurrency(cost.toFixed()),
        });

        break;
      case MotorCoverType.ignition_key:
        const ignition_key = await CoverRate.findOne({
          where: { flag: MotorCoverType.ignition_key },
        });
        const ignition_key_rate = ignition_key ? ignition_key.rate : 8;
        const { ignition_key_sum_insured } = body;

        const ignition_key_cost =
          ignition_key_sum_insured * (ignition_key_rate / 100);

        quotation = Number(quotation) + ignition_key_cost;
        quotation = Number(quotation.toFixed(2));

        addonJSON.ignition_sum_insured = ignition_key_sum_insured;
        addonJSON.ignition_key_premium = ignition_key_cost

        printData.addonCovers.push({
          name: MotorCoverType.ignition_key,
          rate: ignition_key_sum_insured + " * " + ignition_key_rate / 100,
          premium: formatToCurrency(ignition_key_cost.toFixed()),
        });
        break;
      case MotorCoverType.TP_limit_extension:
        const { property_limit_extension, body_injury_limit_extension } = body;
        const rate = purpose === purposes.private ? 0.001 : 0.0125;
        const tp_limit_extension_cost =
          property_limit_extension * rate + body_injury_limit_extension * rate;
        quotation = Number(quotation) + tp_limit_extension_cost;
        quotation = Number(quotation.toFixed(2));

        addonJSON.property_limit_extension_amount = property_limit_extension;
        addonJSON.bodt_limit_extension_amount = body_injury_limit_extension;
        addonJSON.TP_limit_extension_premium = tp_limit_extension_cost


        printData.addonCovers.push({
          name: "TP Body limit",
          rate: body_injury_limit_extension + " * " + rate,
          premium: formatToCurrency(
            (body_injury_limit_extension * rate).toFixed()
          ),
        });
        printData.addonCovers.push({
          name: "TP Property limit",
          rate: property_limit_extension + " * " + rate,
          premium: formatToCurrency(
            (property_limit_extension * rate).toFixed()
          ),
        });
        break;
      case MotorCoverType.bsg:
        let bsgCover = await BSG.findAll({
          where: { vehicle: bsg_vehicle },
        });
        console.log("opppppopopopoopp", bsgCover)
        if (bsgCover.length > 0) {
          printData.addonCovers.push({
            name: MotorCoverType.bsg,
            rate: bsgCover[0].rate + " %",
            premium: formatToCurrency(
              ((Number(sumInsured) * Number(bsgCover[0].rate)) / 100).toFixed(2)
            ),
          });
          const bsg_cost = (Number(sumInsured) * Number(bsgCover[0].rate)) / 100;
          quotation =
            Number(quotation) + bsg_cost

          quotation = Number(quotation.toFixed(2));
          addonJSON.bsg_premium = bsg_cost;
          addonJSON.bsg_vehicle = bsgCover[0].vehicle;

          
        }
        break;
      case MotorCoverType.dailyCash: ///////////////////
        let dailyCashAllowanceRate = dailyCashAllowanceduration.id
          ? dailyCashAllowanceduration.id
          : 0;


        const dailyCashAllowanceCover =
          await DailyCashAllowanceCoverRate.findByPk(dailyCashAllowanceRate);
        if (dailyCashAllowanceCover) {
          let dailyCashCost
          console.log("the other casha", other_daily_cash)
          if (other_daily_cash !== 0) {
            printData.addonCovers.push({
              name: MotorCoverType.dailyCash,
              rate: dailyCashAllowanceCover.surcharge,
              premium: formatToCurrency(
                (
                  dailyCashAllowanceCover.surcharge *
                  Number(other_daily_cash) *
                  Number(dailyCashAllowanceCover.duration)
                ).toFixed(2)
              ),
            });
            dailyCashCost = dailyCashAllowanceCover.surcharge *
              Number(other_daily_cash) *
              Number(dailyCashAllowanceCover.duration)
            quotation =
              Number(quotation) + dailyCashCost
          } else if (dailyCashAllowanceCover.premium > 0) {
            printData.addonCovers.push({
              name: MotorCoverType.dailyCash,
              rate: dailyCashAllowanceCover.surcharge,
              premium: formatToCurrency(
                (
                  dailyCashAllowanceCover.surcharge *
                  Number(dailyCashAllowance) *
                  Number(dailyCashAllowanceCover.duration)
                ).toFixed(2)
              ),
            });
            console.log("intoaa", dailyCashAllowance)

            dailyCashCost = dailyCashAllowanceCover.surcharge *
              Number(dailyCashAllowance) *
              Number(dailyCashAllowanceCover.duration)
            quotation =
              Number(quotation) + dailyCashCost;
            quotation = Number(quotation.toFixed(2));

          }

          if (other_daily_cash !== 0){
            addonJSON.dailyCash_benefit = other_daily_cash;
          }
            else{
              addonJSON.dailyCash_benefit = dailyCashAllowanceCover.benefit;
          
            }
          addonJSON.dailyCash_duration = dailyCashAllowanceCover.duration;
          addonJSON.dailyCash_premium = dailyCashCost
        }
        break;
      case MotorCoverType.flood:
        let floodCover = await CoverRate.findAll({
          where: { flag: MotorCoverType.flood },
        });
        printData.addonCovers.push({
          name: MotorCoverType.flood,
          rate: "+" + floodCover[0].rate + " %",
          premium: formatToCurrency(
            ((Number(sumInsured) * Number(floodCover[0].rate)) / 100).toFixed(2)
          ),
        });
        const flood_cost = (Number(sumInsured) * Number(floodCover[0].rate)) / 100;
        quotation =
          Number(quotation) + flood_cost;
        quotation = Number(quotation.toFixed(2));

        addonJSON.flood_premium = flood_cost
        break;
        case MotorCoverType.territorialExtension:
          try {
              let territorialExtension = await TerritorialExtension.findByPk(
                  teritorialExtensionCountrysList.id
              );
              
              if (!territorialExtension) {
                  throw new Error("Territorial extension not found");
              }
      
              const territorialExtensionRate = territorialExtension.rate ? territorialExtension.rate : 0;
      
              addonJSON.territorial_countryId = teritorialExtensionCountrysList.id;
      
              printData.addonCovers.push({
                  name: MotorCoverType.territorialExtension,
                  rate: territorialExtensionRate + " %",
                  premium: formatToCurrency(((Number(quotation) * Number(territorialExtensionRate)) / 100).toFixed(2)),
              });
      
              const territorialExtensionCost = (Number(sumInsured) * Number(territorialExtensionRate)) / 100
              quotation = (
                  Number(quotation) + territorialExtensionCost
              ).toFixed(2);
      
              addonJSON.territorialExtension__premium = territorialExtensionCost;
          } catch (error) {
              console.error("Error fetching territorial extension:", error);
          }
          break;
      

      case MotorCoverType.yellow_card:
        const { yellow_card_vehicle_type, period } = body
        const yellowCardResult = await getYellowCard(body);


        printData.addonCovers.push({
          name: MotorCoverType.yellow_card,
          rate: yellowCardResult.rate,
          premium: formatToCurrency(Number(yellowCardResult.result).toFixed(2)),
        });
        quotation = (
          Number(quotation) + (Number(yellowCardResult.result))
        ).toFixed(2);

        addonJSON.yellow_card_vehicle_type = yellow_card_vehicle_type
        addonJSON.period = period
        addonJSON.yellowCard_premium = Number(yellowCardResult.result)
        break;
      default: /////////
        printData.addonCovers.push({
          name: addOn.coverType,
          rate: addOn.rate ? addOn.rate : addOn.constant,
          premium: formatToCurrency(
            (
              (Number(sumInsured) * Number(TerritorialExtension.rate)) /
              100
            ).toFixed(2) + Number(addOn.constant)
          ),
        });
        quotation =
          Number(quotation) +
          Number(quotation) * Number(addOn.rate) +
          Number(addOn.constant);
        break;
    }3
  });
  //Period discounts

  // Third party discount
  if (coverType === MotorCoverType.thirdParty) {
    printData.duration = "1 Year";
  }

  if (duration === insurancePeriod.oneYear) {
    printData.duration = "1 Year";
  }


  //half year
  else if (duration === insurancePeriod.halfYear) {
    let rates = await PeriodRate.findAll(); //fetch all  short period rates
    var shortPeriodRate = 0;
    rates.forEach((rate) => {
      if (rate.minDuration < 175 && rate.maxDuration <= 182)

        shortPeriodRate = rate.rate;
      console.log("indied the half year", shortPeriodRate)
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
      quotation = (Number(quotation) * Number(shortPeriodRate)) / 100; //apply the rate
      printData.loadingAndDiscounts.push({
        name: "For  " + 182 + " days",
        rate: shortPeriodRate + "%",
        premium: formatToCurrency(Number(quotation).toFixed(2)),
      });
    }
  }
  //quarter year
  else if (duration === insurancePeriod.threeMonths) {
    let rates = await PeriodRate.findAll(); //fetch all  short period rates
    var shortPeriodRate = 0;
    rates.forEach((rate) => {
      if ((rate.maxDuration = 90)) shortPeriodRate = rate.rate;
      console.log("indied the three month", shortPeriodRate)

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
      quotation = quotation * (shortPeriodRate / 100); //apply the rate
      quotation = Number(quotation.toFixed(2));
      printData.loadingAndDiscounts.push({
        name: "For  " + 90 + " days",
        rate: shortPeriodRate + " %",
        premium: formatToCurrency(Number(quotation).toFixed(2)),
      });
    }
  }

  //if the person specifies the day
  else {
    let rates = await PeriodRate.findAll(); //fetch all  short period rates
    var shortPeriodRate = 0;
    rates.forEach((rate) => {
      if (
        Number(duration) > rate.minDuration &&
        Number(duration) <= rate.maxDuration
      )
        shortPeriodRate = rate.rate;
      console.log("indied the half person", shortPeriodRate)
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
      quotation = quotation * (shortPeriodRate / 100);
      quotation = Number(quotation.toFixed(2));
      printData.loadingAndDiscounts.push({
        name: "For  " + Number(duration) + " days",
        rate: shortPeriodRate + "%",
        premium: formatToCurrency(Number(quotation).toFixed(2)),
      });
    }
  }

  //constant fees
  const constantPercentFees = await Setting.findAll({
    where: {
      [Op.and]: [
        {
          isForTP: false,
        },
        {
          isPercentage: true,
        },
      ],
    },
  });
  if (constantPercentFees.length > 0) {
    constantPercentFees.map((fee) => {
      printData.loadingAndDiscounts.push({
        name: fee.name,
        rate: fee.rate + "%",
        premium: formatToCurrency((Number(quotation) * Number(fee.rate)) / 100),
      });
      quotation =
        Number(quotation) + (Number(quotation) * Number(fee.rate)) / 100;
    });
  }

  const constantFees = await Setting.findAll({
    where: {
      [Op.and]: [
        {
          isForTP: false,
        },
        {
          isPercentage: false,
        },
      ],
    },
  });
  if (constantFees.length > 0) {
    constantFees.map((fee) => {
      quotation = Number(quotation) + Number(fee.rate);
      printData.loadingAndDiscounts.push({
        name: fee.name,
        rate: "",
        premium: formatToCurrency(Number(fee.rate)),
      });

      if (fee.name == "Revenue Stamp") {
        financeObj.revenue_stamp = Number(fee.rate)
      }

    });
  }
  printData.premium = formatToCurrency(quotation);

  financeObj.premium = quotation;



  return { quotation: quotation, printData: printData, msg, older, addons: addonCoversList, addonJSON, financeObj };
};
// 
const printCalculationSheet = async (printData, doc) => {
  var document = {
    html: html,
    data: printData,
    path: "./print_files/" + Date.now() + ".pdf",
    type: "",
  };
  if (printData) {
    let resp = await printPdf(doc ? doc : document);
    let calculation_sheet_path = document.path.substring(1);
    if (resp) return calculation_sheet_path;
  }
};

const printMotorSchedule = async (printData, doc) => {
  // 
  // let doc = motorScheduleHtml;
  var document = {
    html: motorScheduleHtml,
    data: printData,
    path: "./print_files/" + Date.now() + ".pdf",
    type: "",
  };
  if (printData) {
    let resp = await printPdf(document);
    let calculation_sheet_path = document.path.substring(1);
    if (resp) return calculation_sheet_path;
  }
};

// Print multiple motor schedule
const printMultipleMotorSchedule = async (printData, doc) => {

  var document = {
    html: multipleMotorScheduleHtml,
    data: printData,
    path: "./print_files/" + Date.now() + "multiple" + ".pdf",
    type: "",
  };
  if (printData) {
    let resp = await printPdfLandScape(document);
    let calculation_sheet_path = document.path.substring(1);
    if (resp) return calculation_sheet_path;
  }
};

// Multiple Motor Truck Schedule
const printMultipleMotorTruckSchedule = async (printData, doc) => {
  //
  var document = {
    html: multipleMotorTruckScheduleHtml,
    data: printData,
    path: "./print_files/" + Date.now() + "multipleTruck" + ".pdf",
    type: "",
  };
  if (printData) {
    let resp = await printPdf(document);
    let calculation_sheet_path = document.path.substring(1);
    if (resp) return calculation_sheet_path;
  }
};

const printTpEndorsement = async (printData, endorsementType, CoverType) => {

  try {
    let endorsementHtml = "";

    console.log("endor template tp", endorsementType[0]?.limitedCoverRate?.name)

    // if (CoverType === MotorCoverType.ownDamage) {
    //   if (endorsementType[0]?.coverRate?.coverType === MotorCoverType.fireAndTheft)
    //     endorsementHtml = fireAndTheftEndorsementHtml
    //   else if (endorsementType[0]?.coverRate?.coverType === MotorCoverType.fireOnly)
    //     endorsementHtml = fireEndorsementHtml
    //   else if (endorsementType[0]?.coverRate?.coverType === MotorCoverType.theftOnly)
    //     endorsementHtml = TheftEndorsementHtml
    // }
    // else {
      if (endorsementType[0]?.limitedCoverRate?.name === MotorCoverType.fireAndTheft)
        endorsementHtml = fireAndTheftEndorsementHtml
      else if (endorsementType[0]?.limitedCoverRate?.name === MotorCoverType.fireOnly)
        endorsementHtml = fireEndorsementHtml
      else if (endorsementType[0]?.limitedCoverRate?.name === MotorCoverType.theftOnly)
        endorsementHtml = TheftEndorsementHtml
    // }



    var document = {
      html: endorsementHtml,
      data: printData,
      path: "./print_files/" + Date.now() + ".pdf",
      type: "",
    };
    if (printData) {
      let resp = await printPdf(document);
      let tp_endorsement_sheet_path = document.path.substring(1);
      if (resp) return tp_endorsement_sheet_path;
    }
  } catch (error) {
    console.log("tp print error", error)
  }

};

const getTPPremium = async (body) => {

  let {
    type,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
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
    used_for,
    vehicleId,
    vehicleRateChartId,
    addonCoversList,
    dailyCashAllowanceduration,
    teritorialExtensionCountrysList,
    carrying_capacity,
    purpose,
    additional_drivers,
    is_trailer,
    person_carrying_capacity,
    has_trailer,
    quotation_no,
    is_semi_trailer,
    vehicle_name,
    taxi_type,
    limitted_cover_type,
    purpose_limitted,
    isLimittedChecked,
    isYellowCardChecked,
    yellow_card_vehicle_type,
    period,
    made_in,
  } = body;



  var startDate = new Date();
  var endDate = new Date(startDate);
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
    : "MOTQ/" +
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

  const name = type
    ? type == "Corporate"
      ? company_name
      : type == "Join Individual"
        ? join_individual_name
        : type == "Individual"
          ? `${owner_first_name} ${owner_middle_name} ${owner_last_name ?? ''}`
          : ""
    : ""
  //print data
  var printData = {
    owner_name: name,
    cover_type: "Third Party",
    quotation_no: quotation_no,
    start_date: startDateUI,
    end_date: endDateUI,
    duration: duration,
    sum_insured: "",
    vehicle_type: vehicle_type,
    rate: "",
    output1: "",
    isTP: true,
    vehicle_purpose: purpose,
    init_premium: "",
    loadingAndDiscounts: [],
    addonCovers: [],
    premium: "",
  };

  let financeObj = {
    sum_insured: sumInsured,
    premium: 0,
    tp_fund_levy: 0,
    revenue_stamp: 0,
    excess_cont: 0,
    other: 0,
    sum: 0,
  }

  let vehicle = {};


  let vehicleType;

  if (vehicle_type == vehicleTypes.trucks && vehicleId !== 0) {

    vehicleType = vehicleTypes.trucks;
  } else if (vehicle_type == vehicleTypes.trucks && vehicleId == 0
  ) {

    if (carrying_capacity !== 0) {


      vehicleType = vehicleTypes.other_truck;
    } else {
      return ({ error: "Please check the carrying capacity" });

    }

  } else {


    vehicleType = vehicle_type;
  }


  "the search condition / where value ",

  console.log("then the vehicle type",vehicle_type)
  console.log("then the vehicle body",body)

  vehicle = await tpVehicleTypesModelsMap[vehicle_type].findAll(
    {
      where: getTpSearchModelAndConditions(vehicleType, body),
    },
    { raw: true }
  );
  console.log("then the dskd",vehicle)

if (vehicle.length === 0) {
  return { error: "No such vehicle is registered." };
}






  // let allUnitPrice= await TpUnitPrice.findAll({where: { vehicle_type: vehicle_type }, raw: true});

  // 

  let vehicleUnitPrice = await TpUnitPrice.findAll({
    where: { vehicle_type: vehicle_type },
    raw: true,
  });



  let unitPrice = 1;
  let find = false;
  if (vehicleUnitPrice.length == 1) {
    unitPrice = vehicleUnitPrice[0]?.unit_price;

    find = true;
  } else if (vehicleUnitPrice.length > 1) {
    vehicleUnitPrice.forEach((element) => {
      if (element.purpose == purpose) {
        unitPrice = element.unit_price;

        find = true;
      }
    });
  }

  if (!find) {
    const baseUnitPriceVehicle = vehicleUnitPrice.filter(
      (vehicle) => vehicle.purpose == null || vehicle.purpose == ""
    );


    unitPrice = baseUnitPriceVehicle[0].unit_price;
  }



  let settings = await Setting.findAll({
    where: { isForTP: true },
    raw: true,
  });


  if (
    vehicle_type !== vehicleTypes.motor_trade_garage &&
    vehicle_type !== vehicleTypes.motor_trade_non_garage
  ) {
    printData.init_premium = formatToCurrency(vehicle[0].initPremium);
  }

  let result;
  if (
    vehicle_type == vehicleTypes.trucks ||
    vehicle_type == vehicleTypes.pickup_and_vans ||
    vehicle_type == vehicleTypes.tipper_trucks ||
    vehicle_type == vehicleTypes.oil_tanker_truck ||
    vehicle_type == vehicleTypes.watter_tanker_truck ||
    vehicle_type == vehicleTypes.motorcycle ||
    vehicle_type == vehicleTypes.bajajs ||
    vehicle_type == vehicleTypes.motor_trade_garage ||
    vehicle_type == vehicleTypes.motor_trade_non_garage ||
    vehicle_type == vehicleTypes.special_vehicles ||
    vehicle_type == vehicleTypes.mini_buses
  ) {
    result = vehicle[0].initPremium + person_carrying_capacity * unitPrice;

    if (
      (vehicle_type == vehicleTypes.trucks ||
        vehicle_type == vehicleTypes.pickup_and_vans ||
        (vehicle_type == vehicleTypes.tipper_trucks) ||
        vehicle_type == vehicleTypes.oil_tanker_truck ||
        vehicle_type == vehicleTypes.watter_tanker_truck ||
        vehicle_type == vehicleTypes.motorcycle ||
        vehicle_type == vehicleTypes.bajajs ||
        vehicle_type == vehicleTypes.special_vehicles ||
        vehicle_type == vehicleTypes.mini_buses) &&
      vehicle_type !== vehicleTypes.motor_trade_garage &&
      vehicle_type !== vehicleTypes.motor_trade_non_garage
    )
      printData.addonCovers.push({
        name: "No of passanger",
        rate: person_carrying_capacity + " X " + unitPrice,
        premium: formatToCurrency(person_carrying_capacity * unitPrice),
      });
  } else {




    result = vehicle[0].initPremium + carrying_capacity * unitPrice;

    printData.addonCovers.push({
      name: "Per carying capacity",
      rate: carrying_capacity + " X " + unitPrice,
      premium: formatToCurrency(carrying_capacity * unitPrice),
    });
  }

  if (
    vehicle_type == vehicleTypes.motor_trade_garage ||
    vehicle_type == vehicleTypes.motor_trade_non_garage
  ) {
    let main_driver_price;
    let additional_driver_price;

    vehicle.forEach((el) => {
      let element = el.dataValues;

      if (element.driverType == motorFields.main_driver) {
        main_driver_price = element.initPremium;
        printData.addonCovers.push({
          name: element.driverType,
          rate: "1" + " X " + main_driver_price,
          premium: 1 * main_driver_price,
        });
      } else if (element.driverType == motorFields.additional_drivers) {
        additional_driver_price = element.initPremium;

        printData.addonCovers.push({
          name: element.driverType,
          rate: additional_drivers + " X " + additional_driver_price,
          premium: formatToCurrency(
            additional_drivers * additional_driver_price
          ),
        });
      }
    });

    result = main_driver_price + additional_drivers * additional_driver_price;
  } else if (
    vehicle_type == vehicleTypes.trucks ||
    vehicle_type == vehicleTypes.tipper_trucks ||
    vehicle_type == vehicleTypes.oil_tanker_truck ||
    vehicle_type == vehicleTypes.watter_tanker_truck
    //  && is_trailer
  ) {
    let truckUnitPrice = await TpUnitPrice.findOne({
      where: { vehicle_type: vehicleTypes.trucks },
      raw: true,
    });



    const capacityTotal = person_carrying_capacity * truckUnitPrice.unit_price;

    // 

    let forTrailer;


    if (is_trailer || has_trailer
      //  && vehicle_type !== vehicleTypes.tipper_trucks
    ) {


      if (vehicle_type == vehicleTypes.tipper_trucks) {

        forTrailer = await TipperMotorSpecialTp.findOne(
          { where: { isTrailer: true, vehicleType: vehicle_type } },
          { raw: true }
        );
      } else {


        forTrailer = await TruckTankerTp.findOne(
          { where: { is_trailer: true, vehicleType: vehicle_type } },
          { raw: true }
        );
      }




      printData.addonCovers.push({
        name: "Trailer",
        rate: 1 + " X " + forTrailer.initPremium,
        premium: formatToCurrency(forTrailer.initPremium),
      });
    } else if (is_semi_trailer) {
      forTrailer = await TruckTankerTp.findOne(
        { where: { is_semi_trailer: true, vehicleType: vehicle_type } },
        { raw: true }
      );

      printData.addonCovers.push({
        name: "Semi-Trailer",
        rate: 1 + " X " + forTrailer.initPremium,
        premium: formatToCurrency(forTrailer.initPremium),
      });
    }

    if (
      (is_trailer
        //  && vehicle_type !== vehicleTypes.tipper_trucks
      ) ||
      is_semi_trailer || has_trailer
    ) {
      result = result + forTrailer.initPremium;
      // + capacityTotal;


      // result = result + forTrailer.initPremium;
      // printData.addonCovers.push({
      //   name: vehicle_type,
      //   rate: forTrailer.initPremium,
      //   premium: formatToCurrency(forTrailer.initPremium),
      // });
    }
  }
  // initializing new array variable to store different rate muliplied
  let rateSum = [];
  // check if the setting is percentage then multiply and store in array to be finally added



  // if (isYellowCardChecked) {
  //   const yellowCardResult = await getYellowCard(body);

  //   
  //   if (yellowCardResult) {
  //     result = result + yellowCardResult.result;
  //     printData.addonCovers.push({
  //       name: "Yellow Card",
  //       rate: yellowCardResult.rate,
  //       premium: formatToCurrency(yellowCardResult.result),
  //     });
  //   }
  // }

  settings.forEach((setting) => {
    if (setting.isPercentage) {
      printData.loadingAndDiscounts.push({
        name: setting.name,
        rate: setting.rate + "%",
        premium: formatToCurrency(Number(result) * (setting.rate / 100)),
      });
      result = Number(result) + Number(result) * (setting.rate / 100);

      if (setting.name === "Fund Contribution") {
        financeObj.tp_fund_levy = Number(result) * (setting.rate / 100);
      }

      // rateSum.push(temp);
    }
  });
  // finally add all the multiplied rates
  // rateSum.forEach((element) => {
  //   if (rateSum.length !== 0) {
  //     result = Number(result) + Number(element);
  //   }
  // });
  // add all the settings that are to be added
  settings.forEach((setting) => {
    if (!setting.isPercentage) {
      result = Number(result) + Number(setting.rate);

      printData.loadingAndDiscounts.push({
        name: setting.name,
        rate: "",
        premium: formatToCurrency(setting.rate),
      });

      if (setting.name === "Revenue Stamp") {
        financeObj.revenue_stamp = Number(setting.rate);
      }
    }
  });

  if (isLimittedChecked) {
    const limittedResult = await getLimitedCovers(body);


    if (limittedResult) {
      result = result + limittedResult.result;
      printData.loadingAndDiscounts.push({
        name: limitted_cover_type,
        rate: limittedResult.rate,
        premium: formatToCurrency(limittedResult.result),
      });
    }
  }

  // return result.toFixed(2);
  printData.premium = formatToCurrency(result);

  financeObj.premium = Math.round(result * 100) / 100;


  return { result: result.toFixed(2), printData: printData, error: "", financeObj };
};
const getComprehensivePremium = async (body) => {
  const odRes = await getODPremium(body);
  const msg = odRes.msg;
  const odPremium = odRes.quotation;
  const tpRes = await getTPPremium(body);
  const tpPremium = tpRes.result;
  return { quotation: Number(odPremium) + Number(tpPremium), msg };
};

const saveComprehensivePremium = async (body) => {
  const {
    type,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
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
    used_for,
    vehicleId,
    is_special_truck,
    vehicleRateChartId,
    addonCoversList,
    dailyCashAllowanceduration,
    teritorialExtensionCountrysList,
    carrying_capacity,
    purpose,
    additional_drivers,
    is_trailer,
    requested_quotation_id,

    plate_no,
    engine_no,
    chasis_no
  } = body;
  const odRes = await getODPremium(body);

  if (odRes.msg !== "") {


    return ({ error: odRes.msg });
  }
  const msg = odRes.msg;
  const odFinanceObj = odRes.financeObj;
  const tpRes = await getTPPremium(body);
  if (tpRes.error !== "") {
    // res.status(400).json({ msg: "Vehicle is not found." });
    return ({ error: tpRes.error });
  }
  const tpPremium = tpRes.result;
  const tpFinanceObj = tpRes.financeObj;




  const comprehensivePremium = Number(odRes.quotation) + Number(tpRes.result);

  const name = type
    ? type == "Corporate"
      ? company_name
      : type == "Join Individual"
        ? join_individual_name
        : type == "Individual"
          ? `${owner_first_name} ${owner_middle_name} ${owner_last_name ?? ''}`
          : ""
    : ""

  let printData = {
    owner_name: name,
    cover_type: "Comprehensive",
    quotation_no: tpRes.printData.quotation_no,
    start_date: tpRes.printData.start_date,
    end_date: tpRes.printData.end_date,
    duration: tpRes.printData.duration,
    sum_insured: odRes.printData.sum_insured,
    year: odRes.printData.year,
    vehicle_type: odRes.printData.vehicle_type,
    rate: odRes.printData.rate,
    output: odRes.printData.output1,
    loadingAndDiscounts: odRes.printData.loadingAndDiscounts,
    addonCovers: odRes.printData.addonCovers,
    odPremium: formatToCurrency(odRes.quotation),
    vehicle_type2: tpRes.printData.vehicle_type,
    vehicle_purpose: tpRes.printData.vehicle_purpose,
    init_premium: tpRes.printData.init_premium,
    tpAddonCovers: tpRes.printData.addonCovers,
    tpLoadingAndDiscounts: tpRes.printData.loadingAndDiscounts,
    tpPremium: tpRes.printData.premium,
    totalPremium: formatToCurrency(comprehensivePremium),
  };
  var doc = {
    html: html2,
    data: printData,
    path: "./print_files/" + Date.now() + ".pdf",
    type: "",
  };

  const sheetPath = await printCalculationSheet(printData, doc);
  // 

  const contact = {
    type: type,
    firstName: owner_first_name,
    middleName: owner_middle_name,
    lastName: owner_last_name,
    companyName: company_name,
    joinIndividualName: join_individual_name,
    primaryEmail: "",
    primaryPhone: owner_phoneNo,
    business_source_type: "Direct",
    business_source: "",
    status: "leads",
    deleted: false,
    branchId: branchId,
    productId: vehicleId
  };

  const created_contact = await Contact.create(contact);
  let quotationObject = {
    ...body,
    premium: comprehensivePremium,
    firstName: owner_first_name,
    middleName: owner_middle_name,
    lastName: owner_last_name,
    phone_number: owner_phoneNo,
    has_trailer: is_trailer,
    special_truck: is_special_truck,
    calculation_sheet_path: sheetPath,
    requested_quotation_id,
    contactId: created_contact.id
  };
  let datas = await createQuotation(quotationObject);

  const addons = odRes.addons;
  const addonJSON = odRes.addonJSON;
  const financeObj = odRes.financeObj;

  let addonsResult = await saveAddon(addons, datas.id, addonJSON);
  console.log("comp addonresult value is ", addonsResult);

  const multipleProposalDataObj = {
    quotationId: datas.id,
    multipe_riskId: requested_quotation_id,
    plate_no,
    chasis_no,
    engine_no,
  }

  const multiple = MultipleProposalData.create(multipleProposalDataObj)
  const comprhensiveFinance = {
    sum_insured: odFinanceObj.sum_insured,
    premium: comprehensivePremium,
    tp_fund_levy: tpFinanceObj.tp_fund_levy,
    revenue_stamp: tpFinanceObj.revenue_stamp,
    excess_cont: 0,
    other: 0,
    sum: 0
  }
  return {
    premium: comprehensivePremium,
    calculation_sheet_path: sheetPath,
    contactId: created_contact.id,
    quotationId: datas.id,
    msg,
    comprhensiveFinance
  };
};

const saveODPremium = async (body, id) => {
  let {
    type,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
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
    used_for,
    vehicleId,
    vehicleRateChartId,
    addonCoversList,
    dailyCashAllowanceduration,
    teritorialExtensionCountrysList,
    carrying_capacity,
    purpose,
    additional_drivers,
    is_trailer,
    requested_quotation_id,
    comprehensive_cover_type,
    plate_no,
    chasis_no,
    engine_no,
    dailyCashAllowance,
    limitted_cover_type 
  } = body;


  const odPremium = await getODPremium(body);




  if (odPremium.msg !== "") {


    return ({ error: odPremium.msg });
  }
  const msg = odPremium.msg;
  const older = odPremium.older;
  const addons = odPremium.addons;
  const addonJSON = odPremium.addonJSON;
  const financeObj = odPremium.financeObj;




  const sheetPath = await printCalculationSheet(odPremium.printData);
  console.log("teshja", odPremium.printData)
  const contact = {
    type: type,
    companyName: company_name,
    joinIndividualName: join_individual_name,
    firstName: owner_first_name,
    middleName: owner_middle_name,
    lastName: owner_last_name,
    primaryEmail: "",
    primaryPhone: owner_phoneNo,
    business_source_type: "Direct",
    business_source: "",
    status: "leads",
    deleted: false,
    branchId: branchId,
    productId: vehicleId
  };


  const created_contact = await Contact.create(contact);
  console.log("dsnasdnvsdiopo", body)
  let quotationObject = {
    ...body,
    premium: odPremium.quotation,
    owner_first_name: owner_first_name,
    owner_middle_name: owner_middle_name,
    owner_last_name: owner_last_name,
    company_name: company_name,
    join_individual_name: join_individual_name,
    phone_number: owner_phoneNo,
    comprehensive_cover_type_vehicle: comprehensive_cover_type.vehicleType ,
    comprehensive_cover_type_id: comprehensive_cover_type.id ,
    made_of: made_of,
    older: older,
    calculation_sheet_path: sheetPath,
    requested_quotation_id,
    contactId: created_contact.id,
    limitted_cover_type: limitted_cover_type
  };
  let datas
  console.log("contactid", id)
  let quotationId
if(id){
  
  const update = await Quotation.update(quotationObject, { where: { id: id } })
  quotationId = id
  console.log("the updated dataass are", update)


// quotationId= id
//   const multipleProposalDataObj = {
//     quotationId: id,
//     multipe_riskId: requested_quotation_id,
//     plate_no,
//     chasis_no,
//     engine_no,
//   }

//   const multiple = MultipleProposalData.create(multipleProposalDataObj)


let addonsResult = await saveAddon(addons, id, addonJSON);

}else{
  
   datas = await createQuotation(quotationObject);
  console.log("the created dataass are", datas)
   quotationId= datas.id
  const multipleProposalDataObj = {
    quotationId: datas.id,
    multipe_riskId: requested_quotation_id,
    plate_no,
    chasis_no,
    engine_no,
  }

  const multiple = MultipleProposalData.create(multipleProposalDataObj)




  let addonsResult = await saveAddon(addons, datas.id, addonJSON);

}
  return {
    quotation: odPremium.quotation,
    calculation_sheet_path: sheetPath,
    contactId: created_contact.id,
    quotationId: quotationId,
    msg,
    older,
    financeObj
  };
};
// }
const saveTPPremium = async (body, id) => {
  console.log("saveTPPremiumbody", body)
  let quotationId
  const tpCalc = await getTPPremium(body);
  if (tpCalc.error !== "") {
    // res.status(400).json({ msg: "Vehicle is not found." });
    return ({ error: tpCalc.error });
  }
  const tpPremium = tpCalc.result;
  const sheetPath = await printCalculationSheet(tpCalc.printData);
  const financeObj = tpCalc.financeObj;
  let created_contact
  let datas
  let addons
  const {
    type,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
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
    used_for,
    vehicleId,
    vehicleRateChartId,
    addonCoversList,
    limitted_cover_type,
    purpose_limitted,
    dailyCashAllowance,
    teritorialExtensionCountrysList,
    carrying_capacity,
    purpose,
    additional_drivers,
    is_trailer,
    is_special_truck,
    requested_quotation_id,
    plate_no,
    chasis_no,
    engine_no
  } = body;

  const contact = {
    type: type,
    companyName: company_name,
    joinIndividualName: join_individual_name,
    firstName: owner_first_name,
    middleName: owner_middle_name,
    lastName: owner_last_name,
    primaryEmail: "",
    primaryPhone: owner_phoneNo,
    business_source_type: "Direct",
    business_source: "",
    status: "leads",
    deleted: false,
    branchId: branchId,
    productId: vehicleId,
    calculation_sheet_path: sheetPath,
    productId: vehicleId | 0,
  };
  if(id){
    created_contact = await Contact.update(contact, {where:{id: body.contactId}})
  }
  else{
   created_contact = await Contact.create(contact);
  }
  let quotationObject = {
    ...body,
    premium: tpPremium,
    full_name: owner_first_name + ' ' + owner_middle_name + ' ' + owner_last_name,
    phone_number: owner_phoneNo,
    has_trailer: is_trailer,
    special_truck: is_special_truck,

    calculation_sheet_path: sheetPath,
    requested_quotation_id,
    contactId: created_contact.id
  };

if(id){
  datas = await Quotation.update(quotationObject, {where:{id:id}});
}else{


   datas = await createQuotation(quotationObject);
}

console.log("limitted_cover_type1",limitted_cover_type, purpose_limitted)
if(limitted_cover_type != ""|null) {
  let coverRate = await LimitedCoverRate.findOne({
    where: { name: limitted_cover_type , purpose: purpose_limitted}
  });

  console.log("limitted_cover_type2", coverRate)

  let addon = {
    quotationId: datas.id,
    coverRateId: coverRate?.id,
    addonPremium: tpPremium,
  }
  if(id ){
    addons = await Addons.update(addon, {where:{quotationId:id}});
  }else{
   addons = await Addons.create(addon);
}
}
  const multipleProposalDataObj = {
    quotationId: datas.id,
    multipe_riskId: requested_quotation_id,
    plate_no,
    chasis_no,
    engine_no,
  }
if(id){
  const multiple = MultipleProposalData.update(multipleProposalDataObj,{where:{quotationId:id}})

}else{
  const multiple = MultipleProposalData.create(multipleProposalDataObj)
  // const response = await Quotation.findAll({
  //   where: { id: datas.id },
  // });
}
  return {
    quotation: tpPremium,
    calculation_sheet_path: sheetPath,
    contactId: created_contact.id,
    quotationId: datas.id,
    error: "",
    financeObj
  };
};

const generateQuotationNumber = async (quotation) => {
  try {
    let quotationNumber

    let lastQuotationNumber = await Quotation.findOne({ order: [["id", "DESC"]] });

    if (lastQuotationNumber == null || !lastQuotationNumber.quotation_number) {
      // if (lastQuotationNumber.quotation_number == null || lastQuotationNumber.quotation_number == '') {
      lastQuotationNumber = { id: 0 };
      const branchId = quotation?.branchId;
      const branch = await Branch.findByPk(branchId);
      const shortCode = branch.short_code

      quotationNumber = `ZI/${shortCode}/MTR/0000/${new Date().getMonth() + 1
        }/${new Date().getFullYear().toString().slice(2)}`;

      // }
    }
    else {
      quotationNumber = await generateNumber(lastQuotationNumber.quotation_number)

    }



    return quotationNumber;

  }
  catch (error) {

    return -1
  }
};



const createQuotation = async (body) => {
  // let printPath = "/print_files/" + Date.now() + ".pdf";
  // const numberOfRisks = req.body.length;
  try {


    let expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    expirationDate = expirationDate.toDateString();
    const { id, ...rest } = body
    let qid = await generateQuotationNumber(body);

    return await Quotation.create({ ...rest, made_in: 1, quotation_number: qid, requested_quotation_id: body.requested_quotation_id, comprehensive_cover_type_id: 0 });

    // const {id, ...rest } = body
    // 
    // return await Quotation.create({ ...rest, made_in: 1 });
  } catch (error) {


    return { id: 0 };
  }
};


const getPremium = async (body) => {
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
  } = body;
  if (coverType === MotorCoverType.ownDamage) {
    const odPremium = (await getODPremium(body)).quotation;
    return odPremium.quotation;
  }
  if (coverType === MotorCoverType.thirdParty) {
    return (await getTPPremium(body)).result;
  }
  if (coverType === MotorCoverType.comprehensive) {
    return (await getComprehensivePremium(body)).quotation;
  }
};

const savePremium = async (body) => {
  const { coverType } = body;

  if (coverType === MotorCoverType.ownDamage) {

    const quotation = await saveODPremium(body);
    if (quotation.msg) {
      return quotation.msg;
    } else {
      return quotation.quotation;
    }
  }

  if (coverType === MotorCoverType.thirdParty) {
    return (await saveTPPremium(body)).quotation;
  }
  if (coverType === MotorCoverType.comprehensive) {
    return (await saveComprehensivePremium(body)).premium;
  }
};

const getLimitedCovers = async (body) => {
  // const {coverType, purpose, sumInsured} = body;
  let {
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
    coverType,
    sumInsured,
    purpose,
    quotation_no,
    limitted_cover_type,
    purpose_limitted,
    isLimittedChecked,
    duration,
  } = body;

  var startDate = new Date();
  var endDate = new Date(startDate);
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
    : "MOTQ/" +
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

  const name = body.type
    ? body.type == "Corporate"
      ? company_name
      : body.type == "Join Individual"
        ? join_individual_name
        : body.type == "Individual"
          ? `${owner_first_name} ${owner_middle_name} ${owner_last_name ?? ''}`
          : ""
    : ""

  //print data
  var printData = {
    owner_name: name,
    cover_type: coverType,
    quotation_no: quotation_no,
    start_date: startDateUI,
    end_date: endDateUI,
    duration: duration,
    sum_insured: "",
    // vehicle_type: vehicle_type,
    rate: "",
    output1: "",
    // isTP: true,
    vehicle_purpose: purpose,
    // init_premium: "",
    loadingAndDiscounts: [],
    addonCovers: [],
    premium: "",
  };
  let premium = 0;
  let limitedCoverRate;

  let newType;
  let newPurpose;

  if (coverType == MotorCoverType.thirdParty) {
    newType = limitted_cover_type;
    newPurpose = purpose_limitted;
  } else {
    newType = coverType;
    newPurpose = purpose;
  }

  switch (newType) {
    case MotorCoverType.fireAndTheft:
      //do calculations
      limitedCoverRate = await LimitedCoverRate.findAll({
        where: {
          [Op.and]: [
            { name: MotorCoverType.fireAndTheft },
            { purpose: newPurpose },
          ],
        },
      });
      if (limitedCoverRate.length > 0) {
        if (limitedCoverRate[0].isAvailable)
          premium = Number(sumInsured) * (limitedCoverRate[0]?.rate / 100);
        
        premium = Number(premium.toFixed(2));

        printData.addonCovers.push({
          name: MotorCoverType.fireAndTheft,
          rate: Number(sumInsured) + " * " + Math.round(limitedCoverRate[0]?.rate * 100) / (100) + " % ",
          premium: formatToCurrency(premium.toFixed()),
        });
      }
      break;
    case MotorCoverType.fireOnly:
      //do some calculations
      limitedCoverRate = await LimitedCoverRate.findAll({
        where: {
          [Op.and]: [
            { name: MotorCoverType.fireOnly },
            { purpose: newPurpose },
          ],
        },
      });
      if (limitedCoverRate.length > 0) {
        if (limitedCoverRate[0].isAvailable)
          premium = Number(sumInsured) * (limitedCoverRate[0]?.rate / 100);
        
        premium = Number(premium.toFixed(2));

        printData.addonCovers.push({
          name: MotorCoverType.fireOnly,
          rate: Number(sumInsured) + " * " + Math.round(limitedCoverRate[0].rate * 100) / (100) + " % ",
          premium: formatToCurrency(premium.toFixed()),
        });
      }
      break;
    case MotorCoverType.theftOnly:
      limitedCoverRate = await LimitedCoverRate.findAll({
        where: {
          [Op.and]: [
            { name: MotorCoverType.theftOnly },
            { purpose: newPurpose },
          ],
        },
      });
      if (limitedCoverRate.length > 0) {
        if (limitedCoverRate[0].isAvailable)
          premium = Number(sumInsured) * (limitedCoverRate[0]?.rate / 100);
        
        premium = Number(premium.toFixed(2));

        printData.addonCovers.push({
          name: MotorCoverType.fireOnly,
          rate: Number(sumInsured) + " * " + Math.round(limitedCoverRate[0]?.rate * 100) / (100) + " % ",
          premium: formatToCurrency(premium.toFixed()),
        });
      }
      break;
  }

  printData.premium = formatToCurrency(premium);

  // return premium;
  if (isLimittedChecked) {
    return {
      result: premium,
      rate:
        Number(sumInsured) +
        " * " +
        Math.round(limitedCoverRate[0]?.rate * 100) / 100,
    };
  }

  return { result: premium.toFixed(2), printData: printData };
};

const getYellowCard = async (body) => {
  // const {coverType, purpose, sumInsured} = body;
  let {
    yellow_card_vehicle_type,
    period,
  } = body;




  let premium = 0;
  let yellowAmount = 0;
  let yellowRate = 0;
  //do calculations
  let yellowVehicleType = await YellowCard.findOne({
    where: { vehicle_type: yellow_card_vehicle_type },
  });

  let yellowCPeriod = await YellowCardShort.findOne({
    where: { period: period },
  });

  if (yellowVehicleType && yellowCPeriod) {
    yellowAmount = yellowVehicleType?.amount;
    yellowRate = yellowCPeriod?.rate;

    premium = Number(yellowAmount) * yellowRate;

    premium = Number(premium.toFixed(2));

    // printData.addonCovers.push({
    //   name: "Yellow Card",
    //   rate: Number(yellowAmount) + " * " + yellowRate,
    //   premium: formatToCurrency(premium.toFixed()),
    // });
  }


  // return premium;
  // if (isLimittedChecked) {
  //   return { result: premium,  rate: Number(sumInsured) + " * " + Math.round(limitedCoverRate[0].rate * 100)/(100) };
  // }

  return { result: premium, rate: Number(yellowAmount) + " * " + yellowRate };
};
const saveLimitedCovers = async (body) => {
  const LimitedCoversCalc = await getLimitedCovers(body);

  const LimitedCoversPremium = LimitedCoversCalc.result;
  const sheetPath = await printCalculationSheet(LimitedCoversCalc.printData);

  const {
    type,
    owner_first_name,
    owner_middle_name,
    owner_last_name,
    company_name,
    join_individual_name,
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
    used_for,
    vehicleId,
    vehicleRateChartId,
    addonCoversList,
    dailyCashAllowanceduration,
    teritorialExtensionCountrysList,
    carrying_capacity,
    purpose,
    additional_drivers,
    is_trailer,
  } = body;
  const contact = {
    type: type,
    firstName: owner_first_name,
    middleName: owner_middle_name,
    lastName: owner_last_name,
    companyName: company_name,
    joinIndividualName: join_individual_name,
    primaryEmail: "",
    primaryPhone: owner_phoneNo,
    business_source_type: "Direct",
    business_source: "",
    status: "leads",
    deleted: false,
    branchId: branchId,
    productId: vehicleId,
    calculation_sheet_path: sheetPath,
  };
  const created_contact = await Contact.create(contact);

  let quotationObject = {
    ...body,
    premium: LimitedCoversPremium,
    full_name: owner_first_name + ' ' + owner_middle_name + ' ' + owner_last_name,
    phone_number: owner_phoneNo,
    has_trailer: is_trailer,

    calculation_sheet_path: sheetPath,
    contactId: created_contact.id
  };

  let datas = await createQuotation(quotationObject);
  // const response = await Quotation.findAll({
  //   where: { id: datas.id },
  // });
  return {
    quotation: LimitedCoversPremium,
    calculation_sheet_path: sheetPath,
    contactId: created_contact.id,
    quotationId: datas.id,
  };
};

const saveAddon = async (addonList, quotationId, addonJSON) => {



  const { ignition_sum_insured, property_limit_extension_amount, bodt_limit_extension_amount, territorial_countryId, dailyCash_benefit, dailyCash_duration, bsg_vehicle,
    ignition_key_premium, TP_limit_extension_premium, bsg_premium, dailyCash_premium, flood_premium, territorialExtension__premium, yellowCard_premium,
    yellow_card_vehicle_type, period
  } = addonJSON

  let check = false;
  if (addonList != undefined) {
    check = true
  }

  if (check) {
    if (addonList.length !== 0) {
      const entry = addonList.map((addon) => {
        let eachData = null;
        let coverRateId = addon.id;
        if (addon.flag == MotorCoverType.comprehensive_tp) {
          eachData = {
            quotationId,
            coverRateId,
          }

        }
        else if (addon.flag == MotorCoverType.yellow_card) {
          eachData = {
            quotationId,
            coverRateId,
            yellow_card_vehicle_type,
            period,
            addonPremium: yellowCard_premium
          }


        }
        else if (addon.flag == MotorCoverType.ignition_key) {
          eachData = {
            quotationId,
            coverRateId,
            ignition_sum_insured,
            addonPremium: ignition_key_premium
          }

        }
        else if (addon.flag == MotorCoverType.TP_limit_extension) {
          eachData = {
            quotationId,
            coverRateId,
            property_limit_extension_amount,
            bodt_limit_extension_amount,
            addonPremium: TP_limit_extension_premium

          }

        }
        else if (addon.flag == MotorCoverType.bsg) {
          eachData = {
            quotationId,
            coverRateId,
            addonPremium: bsg_premium,
            bsg_vehicle: bsg_vehicle

          }


        }
        else if (addon.flag == MotorCoverType.dailyCash) {
          eachData = {
            quotationId,
            coverRateId,
            dailyCash_benefit,
            dailyCash_duration,
            addonPremium: dailyCash_premium

          }

        }
        else if (addon.flag == MotorCoverType.flood) {
          eachData = {
            quotationId,
            coverRateId,
            addonPremium: flood_premium

          }


        }
        else if (addon.flag == MotorCoverType.territorialExtension) {
          eachData = {
            quotationId,
            coverRateId,
            territorial_countryId,
            addonPremium: territorialExtension__premium

          }

        }
        return eachData;
      });
      await Addons.bulkCreate(entry);
    }
  }


}

module.exports = {
  getODPremium,
  getTPPremium,
  getComprehensivePremium,
  saveODPremium,
  saveTPPremium,
  saveComprehensivePremium,
  getPremium,
  printCalculationSheet,
  savePremium,
  getLimitedCovers,
  saveLimitedCovers,
  getYellowCard,
  printMotorSchedule,
  printMultipleMotorTruckSchedule,
  printMultipleMotorSchedule,
  printTpEndorsement
};