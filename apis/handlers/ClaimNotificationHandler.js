const { Op, json } = require("sequelize");
const ClaimNotification = require("../../models/motor/claim/ClaimNotification");
const Contact = require("../../models/Contact");
const {
  convertFlattenedToNested,
  printPdf
} = require("../../utils/GeneralUtils");
var path = require("path");
var fs = require("fs");

var notificationHtml = fs.readFileSync(
  path.join(
    __dirname,
    "./../../templates/ClaimNotification.html"
    ),
    "utf8"
);

const getSearch = (st) => {
  

  return {
    [Op.or]: [
      { policyNumber: { [Op.like]: `%${st}%` } },
      { firstPlateNumber: { [Op.like]: `%${st}%` } },
      { driverFirstName: { [Op.like]: `%${st}%` } },
      { driverMiddleName: { [Op.like]: `%${st}%` } },
      { driverLastName: { [Op.like]: `%${st}%` } },
      { driverCity: { [Op.like]: `%${st}%` } },
      { driverSubcity: { [Op.like]: `%${st}%` } },
      { driverKebele: { [Op.like]: `%${st}%` } },
      { driverPhoneNo: { [Op.like]: `%${st}%` } },
      { driverLicense: { [Op.like]: `%${st}%` } },
      { accidentDate: { [Op.like]: `%${st}%` } },
      { accidentPlace: { [Op.like]: `%${st}%` } },
      { accidentType: { [Op.like]: `%${st}%` } },
      { secondPersonName: { [Op.like]: `%${st}%` } },
      { secondPlateNumber: { [Op.like]: `%${st}%` } },
      { policeStationName: { [Op.like]: `%${st}%` } },
      { policeName: { [Op.like]: `%${st}%` } },
      { claimNotificationDate: { [Op.like]: `%${st}%` } }


      // { name: { [Op.like]: `%${st}%` } },
      // { "$contact.firstName$": { [Op.like]: `%${st}%` } },
      // { "$contact.middleName$": { [Op.like]: `%${st}%` } },
      // { "$contact.lastName$": { [Op.like]: `%${st}%` } },
      // { "$contact.gender$": { [Op.like]: `%${st}%` } },
      // { "$contact.industry$": { [Op.like]: `%${st}%` } },
      // { "$contact.branch.name$": { [Op.like]: `%${st}%` } },
      // { "$contact.type$": { [Op.like]: `%${st}%` } },
      // { "$contact.primaryEmail$": { [Op.like]: `%${st}%` } },
      // { "$contact.secondaryEmail$": { [Op.like]: `%${st}%` } },
      // { "$contact.primaryPhone$": { [Op.like]: `%${st}%` } },
      // { "$contact.secondaryPhone$": { [Op.like]: `%${st}%` } },
      // { "$contact.joinIndividualName$": { [Op.like]: `%${st}%` } },
      // { "$contact.companyName$": { [Op.like]: `%${st}%` } },
      // { "$contact.tinNumber$": { [Op.like]: `%${st}%` } },
      // { "$contact.business_source$": { [Op.like]: `%${st}%` } },
      // { "$contact.business_source_type$": { [Op.like]: `%${st}%` } },
      // { "$motor_proposal.quotation.requested_quotation_id$": { [Op.like]: `%${st}%` } },

      // { "$contact.country": { [Op.like]: `%${st}%` } },
      // { "$contact.region": { [Op.like]: `%${st}%` } },
      // { "$contact.city": { [Op.like]: `%${st}%` } },
      // { "$contact.subcity": { [Op.like]: `%${st}%` } },
      // { "$contact.woreda": { [Op.like]: `%${st}%` } },
      // { "$contact.kebele": { [Op.like]: `%${st}%` } },

      
    ],
  };
};

const getClaimNotifications = async (req, res) => {
  
  const { f, r, st, sc, sd } = req.query;

  try {
    //const data = await ClaimNotification.findAndCountAll({});
    
    const data = await ClaimNotification.findAndCountAll({
      offset: Number(f),
      limit: Number(r),
      order: [[sc || 'createdAt', sd == 1 ? 'DESC' : 'ASC']],
      where: getSearch(st)
    });
    res.status(200).json(data);
  } catch (error) {
    
  }
};

//posting
const createClaimNotification = async (req, res) => {

  const notificationBody = req.body;
  console.log("req.body",req.body)


  try{
    const notification = await ClaimNotification.create(notificationBody)

    res.status(200).json(notification);
   //console.log("Notification",notification)
    // if(notification){
    //   generateNotification(notification);
    // }
  //const notificationBody = req.body

  //let { contact } = notificationBody;

  // 
  // try {
  //   const nwContact = notificationBody.customer.contact;
  //   const contacts = notificationBody.customer.contact.id
  //     ? await Contact.findOne({ where: { id: notificationBody.customer.contact.id } })
  //     : null;
  //   if (contacts == null) {
  //     const notification = await ClaimNotification.create(notificationBody, 
  //       { include: [{
  //         model: Contact,
  //         as: 'customerContact',
  //         include: [
  //           {
  //             model: Customer,
  //             as: 'customer',
  //           },
  //         ],
  //       },] });
     // res.status(200).json(notification);

  //const notificationBody = req.body


    // const contacts = notificationBody.customer.contact.id
    //   ? await Contact.findOne({ where: { id: notificationBody.customer.contact.id } })
    //   : null;
    // if (contacts == null) {
    //   const notification = await ClaimNotification.create(notificationBody, 
    //     { include: [{
    //       model: Contact,
    //       as: 'customerContact',
    //       include: [
    //         {
    //           model: Customer,
    //           as: 'customer',
    //         },
    //       ],
    //     },] });
    //   res.status(200).json(notification);


    // }else {
    //   
    //   const updatedContact = await Contact.update(nwContact, {
    //     where: { id: contact.id },
    //   });
    //   res.status(200).json(updatedContact);

    // }
    
  } catch (error) {
    res.status(400).json({ msg: error.message });
}
};

const getClaimNotificationByPk = async (req, res) => {
  
  try {
    const claimNotification = await ClaimNotification.findByPk(req.params.id).then(function (
      ClaimNotification
    ) {
      if (ClaimNotification) {
        res.status(200).json(ClaimNotification);
      }
    });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editClaimNotification = async (req , res) => {
   const notificationBody = req.body
   const id = req.params.id

  try {
    
    ClaimNotification.update(
     notificationBody,

      { where: { id: notificationBody.id } }
    );
    
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteClaimNotification = async (req, res) => {
  const  id  = req.params.id;

  try {
    ClaimNotification.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
const generateNotification = async (notification) => {

  let printData = {
    policyNo: notification.policyNumber,
    plateNo: notification.firstPlateNumber,
    driverFullName:notification.driverFullName,//driverFirstName + notification.driverMiddleName + notification.driverLastName,
    driverCity: notification.driverCity,
    driverRegion:notification.driverRegion,
    driverSubcity: notification.driverSubcity,
    driverKebele: notification.driverKebele,
    driverHouseNo: notification.driverHouseNo,
    driverPhoneNo: notification.driverPhoneNo,
    drivingLicense: notification.driverLicenseNo,
    type: notification.driverLicenseGrade,
    driverLicenseGrade:notification.driverLicenseGrade,
    expiryDate: notification.driverLicenseExpiryDate.toString(),
    dateOfAccident: notification.accidentDate,
    accidentTime: notification.accidentDate,
    accidentPlace: notification.accidentPlace,
    typeOfAccident: notification.accidentType,
    typeOfCargo: notification.cargoType,
    quantityOfCargo: notification.cargoQuantity,
    crainType: notification.crainType,
    accidentRegistration: notification.isPoliceTakeParticular ? 
        `Yes. The police Station is ${notification.policeStationName}. And the police name is ${notification.policeStationName}.` 
        : 'No.',
    accidentDescription: notification.accidentDescription,
    extentOfDamage: notification.cargoDamageExtent || null,
    notificationDate: new Date(notification.claimNotificationDate).getDate(),
    notificationMonth: new Date(notification.claimNotificationDate).getMonth(),
    notificationYear: new Date(notification.claimNotificationDate).getFullYear(),
  }
  console.log("printData",printData)

  const notificationPath = await printNotification(printData);
  const newNotification = {
    notificationPath: notificationPath
  }

  await ClaimNotification.update(newNotification, 
    { where: {id: notification.id} })

}

const printNotification = async (printData) => {
  // 
  // let doc = motorScheduleHtml;
  var document = {
    html: notificationHtml,
    data: printData,
    path: "./print_files/" + Date.now() + ".pdf",
    type: "",
  };
  if (printData) {
    let resp = await printPdf(document);
    let notification_path = document.path.substring(1);
    if (resp) return notification_path;
  }
};

module.exports = {
  getSearch,
  getClaimNotifications,
  createClaimNotification,
  getClaimNotificationByPk,
  editClaimNotification,
  deleteClaimNotification,
  generateNotification,
  printNotification
};

