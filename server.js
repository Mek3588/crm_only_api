require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const secretKey = require("./utils/SecreteKeyGen");
const path = require("path");
// const session = require("express-session");
const csrf = require("csurf");
const { getCsrf } = require("./apis/handlers/Csrf");
const bodyParser = require("body-parser");
const formParser = bodyParser.urlencoded({ extended: false });
const cron = require('node-cron')

const policyExpirationDateNotifier = require('./utils/policy_expireddate_notifier');

//swagger additions
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger"); // Update the path if necessary
const { setupCSRFMiddleware } = require("./apis/handlers/Csrf");
var corsOptions = {
  origin: "http://localhost:5000",
  credentials: true,
  exposedHeaders: "XSRF-Token",
};
require("./database/connections").default;
const cookieParser = require("cookie-parser");
const protectedRoute = require("./apis/middlewares/protectedRoute");
const app = express();
const helmet = require("helmet");
const csp = require("helmet-csp");
app.use(express.json({ limit: "500mb" }));
app.use(
  cors({
    exposedHeaders: "X-CSRF-Token",
    credentials: true,
    accessControlAllowCredentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://portal.zemeninsurance.com",
      "https://196.188.235.248",
    ],
  })
);
// app.use(
//   session({
//     secret: secretKey.generateSecretKey(),
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );
// app.use(csrfProtection);
// app.use(cookieParser());
// const csrfProtect = csrf({ cookie: true });
// // app.use(csrf({ cookie: true }));

const csrfProtection = csrf({
  cookie: { httpOnly: true, secure: true, maxAge: "32400" },
});

app.use(cookieParser());
// app.use(csrfProtection);
// app.use(csrfProtection)
//  setupCSRFMiddleware(app)

// app.use(csrfProtection, require("./apis/csrf"));

// app.use((req, res, next) => {
//   if (req.path !== '/auth') {
//     // Apply your middleware logic here
//     
//   }
//   else {

//     csrfToken = getCsrf(req, res);
//     res.cookie('csrfToken', csrfToken, { httpOnly: true });
//     res.setHeader('X-CSRF-Token', csrfToken);
//     

//   }
//   next();
// })
app.use((err, req, res, next) => {
 
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Syntax error in request" });
  }

  if (err instanceof URIError) {
   
    return res.status(400).json({ error: "Invalid request" });
  }
  // if (err instanceof EBADCSRFTOKEN) {
  //   return res.status(403).send('Invalid CSRF token');
  // }
  return res.status(500).json({ error: "Internal server error" });
});

app.get("/csrfToken", protectedRoute, csrfProtection, function (req, res) {


  const token = req.csrfToken();
  
  res.cookie("X-CSRF-Token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // res.setHeader('X-CSRF-Token', token);

  return res.status(200).json({ csrfToken: token });
});

// app.use("/", function (req, res, next) {
//   try {
//     
//       "Token from Browser/form: ",
//       req.headers["x-csrf-token"] != "undefined"
//     );
//     if (
//       req.path.startsWith("/auth") ||
//       req.path.startsWith("/customerInputMotors") ||
//       req.method == "GET" ||
//       req.path.startsWith("/users/signup") ||
//       req.path == "/users/validate_token" ||
//       req.path == "/users/get_info"
//     ) {
//       

//       next();
//     } else if (
//       req.headers["x-csrf-token"] != "undefined" &&
//       req.headers["x-csrf-token"] != ""
//     ) {
//       
//       

//       if (req.headers["x-csrf-token"] == req.cookies["X-CSRF-Token"]) {
//         
//         next();
//       } else {
//         

//         return res.status(401).json({ msg: "Invalid request" });
//       }
//     } else {
//       
//       res.status(400).json({ msg: "Invalid request" });
//     }
//   } catch (error) {
//     
//     res.status(400).json({ msg: error.message });
//   }
// });

//middlewares
// app.use(cors({  }));

// app.use(express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", express.static("uploads"));
app.use("/templates", express.static("templates"));
app.use("/print_files", express.static("print_files"));
app.use("/MotorFiles", express.static("templates/MotorFiles"));

//call cron job here

// cron.schedule('*/10 * * * * *', () => {
// 	policyExpirationDateNotifier.sendEmailCron_JOB()
//   },{
// 	scheduled: true,
// 	timezone: 'Africa/Addis_Ababa'
//   })

// app.use(cors());
//routes
app.get("/", (req, res) => {
  res.json({ msg: "some message" });
});

// Helmet middleware
app.use(helmet());

// Content Security Policy
app.use(
  csp({
    // Specify your CSP directives here
    // Example directives:
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
    },
  })
);

app.use("/dashboard", require("./apis/dashboard/dashboard"));
app.use("/auth", require("./apis/auth"));
app.use("/contacts", require("./apis/contacts"));
app.use("/users", require("./apis/acl/users"));
app.use("/corporates", require("./apis/corporations"));
// app.use("/accounts", require("./apis/accounts"));
app.use("/salesPersons", require("./apis/salesPersons"));
app.use("/companyContacts", require("./apis/companyContacts"));
// app.use("/customers", require("./apis/customers"));
app.use("/products", require("./apis/products"));
app.use("/leads", require("./apis/leads"));
app.use("/opportunitys", require("./apis/opportunitys"));
app.use("/drivers", require("./apis/drivers"));
app.use("/branches", require("./apis/branches"));
app.use("/services", require("./apis/services"));
app.use("/productCategories", require("./apis/productCategories"));
app.use("/serviceCategories", require("./apis/serviceCategories"));
app.use("/outsourcedServices", require("./apis/outsourcedServices"));
app.use("/soldServices", require("./apis/soldServices"));
app.use("/notifications", require("./apis/notifications"));
app.use("/claimNotification", require("./apis/claimNotifications"));
app.use("/temporaryNotifications", require("./apis/temporaryNotice"));
app.use("/temporaryNotifications", require("./apis/temporaryNotice"));
app.use("/groups", require("./apis/acl/group"));
app.use("/riskTypes", require("./apis/riskType"));
app.use("/emails", require("./apis/emails"));
app.use("/companys", require("./apis/companies"));
app.use("/companyTypes", require("./apis/companyTypes"));
app.use("/ageLoads", require("./apis/ageLoads"));
app.use("/phones", require("./apis/phoneNos"));
app.use("/insuranceCategorys", require("./apis/insuranceCategory"));
app.use("/temporaryNotifications", require("./apis/temporaryNotice"));
app.use("/employees", require("./apis/employees"));
app.use("/smsServices", require("./apis/smsService"));
app.use("/vehicleCategories", require("./apis/motor/vehicle_categories"));
// app.use("/chargeRates", require("./apis/chargeRates"));
app.use(
  "/otherLoadingAndDiscounts",
  require("./apis/otherLoadingAndDiscounts")
);

app.use("/serviceCharges", require("./apis/serviceCharges"));
app.use("/quotations", require("./apis/quotations"));
app.use("/coverRates", require("./apis/coverRate"));
app.use("/periodRates", require("./apis/periodRate"));
app.use("/vendors", require("./apis/vendorRouter/vendors"));
app.use("/motorProposals", require("./apis/proposalRoute/motorProposal"));
app.use("/documents", require("./apis/document"));
app.use("/tasks", require("./apis/contactActivity/task"));
app.use("/notes", require("./apis/contactActivity/note"));
app.use("/meetings", require("./apis/contactActivity/metting"));
app.use("/calls", require("./apis/contactActivity/call"));
app.use("/update_histories", require("./apis/updateHistory"));
app.use("/communication_histories", require("./apis/communicationHistory"));
app.use(
  "/contactActivitieUpdateHistories",
  require("./apis/contactActivityUpdateHistory")
);
app.use("/emailServices", require("./apis/emailServices"));
app.use("/accountTasks", require("./apis/accountActivity/task"));
app.use("/accountNotes", require("./apis/accountActivity/note"));
app.use("/accountMeetings", require("./apis/accountActivity/metting"));
app.use("/accountCalls", require("./apis/accountActivity/call"));
app.use("/shareHolders", require("./apis/shareholderRoute/shareHolder"));
app.use("/acls", require("./apis/acls"));
app.use("/regions", require("./apis/regions"));
app.use("/subcitys", require("./apis/subcitys"));
app.use("/citys", require("./apis/citys"));
app.use("/countrys", require("./apis/countrys"));
app.use("/industrys", require("./apis/industrys"));
app.use("/certificates", require("./apis/certificates"));
app.use("/agreements", require("./apis/agreements"));
app.use("/clauses", require("./apis/clauses"));
app.use("/declarations", require("./apis/declarations"));
app.use("/warrantys", require("./apis/warrantys"));
app.use("/salutations", require("./apis/salutations"));
app.use("/gradeLevels", require("./apis/gradeLevels"));
app.use("/sharedSales", require("./apis/sharedSales"));
app.use("/quotationSettings", require("./apis/quotationSettings"));
app.use("/campaigns", require("./apis/campaign"));
app.use("/campaignSales", require("./apis/campaignSales"));
app.use("/campaignTours", require("./apis/campaignTour"));
app.use("/campaignHistory", require("./apis/campaignHistory"));
app.use("/departments", require("./apis/departments"));
app.use("/territorialExtensions", require("./apis/territorialExtensions"));
app.use("/bsgs", require("./apis/Bsgs"));
app.use("/policys", require("./apis/Policies"));
app.use("/comprehensiveTps", require("./apis/ComprehensiveTps"));
app.use("/actionPrevilages", require("./apis/ActionPrevilages"));
app.use("/yellowCards", require("./apis/YellowCards"));
app.use("/yellowCardShorts", require("./apis/YellowCardShorts"));
app.use("/multipleRisks", require("./apis/MultipleRisks"));
app.use("/multipleProposal", require("./apis/MultipleProposal"));
app.use("/multipleFireRisks", require("./apis/FireMultipleRisks"));
app.use("/settings", require("./apis/settings"));
app.use("/busTaxiTps", require("./apis/BusTaxiTps"));
app.use("/truckTankerTps", require("./apis/TruckTankerTps"));
app.use("/tipperMotorSpecialTps", require("./apis/TipperMotorSpecialTps"));
app.use("/rideAndTaxis", require("./apis/RideAndTaxis"));
app.use("/userGroup", require("./apis/acl/userGroup"));

app.use("/vendorsComments", require("./apis/vendorRouter/VendorsComment"));
app.use("/vendorContacts", require("./apis/vendorRouter/vendorContact"));
app.use(
  "/shareholderComments",
  require("./apis/shareholderRoute/shareholderComment")
);
app.use(
  "/shareholderContacts",
  require("./apis/shareholderRoute/shareholderContact")
);
app.use("/campaignTeam", require("./apis/campaignTeam"));
app.use("/campaignIndividual", require("./apis/campaignIndividual"));
app.use("/campaignBranch", require("./apis/campaignBranch"));
app.use("/campaignAgent", require("./apis/campaignAgent"));
app.use("/campaignBroker", require("./apis/campaignBroker"));

app.use("/campaignSms", require("./apis/SmsCampaign"));

app.use("/competitors", require("./apis/competitorRoute/competitor"));
app.use(
  "/competitorComments",
  require("./apis/competitorRoute/competitorComment")
);
app.use(
  "/competitorContacts",
  require("./apis/competitorRoute/competitorContact")
);
app.use(
  "/competitorBudgets",
  require("./apis/competitorRoute/competitorBudget")
);
app.use("/customers", require("./apis/customerRoute/customer"));
app.use("/customerContacts", require("./apis/customerRoute/customerContact"));
app.use("/customerProposals", require("./apis/customerRoute/customerProposal"));

app.use("/partners", require("./apis/partnerRoute/partner"));
app.use("/partnerComments", require("./apis/partnerRoute/partnerComment"));
app.use("/partnerContacts", require("./apis/partnerRoute/partnerContact"));
app.use("/partnerBudgets", require("./apis/partnerRoute/partnerBudget"));
app.use("/agents", require("./apis/agentRoute/agent"));
app.use("/agentComments", require("./apis/agentRoute/agentComment"));
app.use("/agentContacts", require("./apis/agentRoute/agentContact"));
app.use("/brokers", require("./apis/brokerRoute/broker"));
app.use("/organizations", require("./apis/brokerRoute/organization"));
app.use(
  "/organizationComments",
  require("./apis/brokerRoute/organizationComment")
);
app.use(
  "/organizationContacts",
  require("./apis/brokerRoute/organizationContact")
);
app.use("/contactCompanyContact", require("./apis/ContactCompanyContact"));
app.use("/documentCategories", require("./apis/documentCategory"));

//fire
app.use("/fireRates", require("./apis/fire/fireRates"));
app.use("/fireRateCategorys", require("./apis/fire/fireRateCategories"));
app.use("/fireChargeRates", require("./apis/fire/fireChargeRates"));
app.use("/fireProposals", require("./apis/fireProposal"));
app.use("/fireQuotations", require("./apis/fire/fireQuotations"));
app.use("/fireShortPeriodRates", require("./apis/fire/fireShortPeriodRates"));
app.use(
  "/fireSumInsuredDiscounts",
  require("./apis/fire/fireSumInsuredDiscounts")
);
app.use("/fireAlliedPerilsRates", require("./apis/fire/fireAlliedPerilsRates"));
app.use("/fireAlliedPerilsRates", require("./apis/fire/fireAlliedPerilsRates"));
app.use(
  "/fireApplicableWarrantys",
  require("./apis/fire/fireApplicableWarrantys")
);
app.use("/fireWarrantys", require("./apis/fire/fireWarrantys"))
app.use("/fireLoadingRates", require("./apis/fire/fireLoadingRates"));
app.use("/fireConstantFees", require("./apis/fire/fireConstantFees"));
//claim
app.use("/fireClaimNotifications", require("./apis/fire/claim/fireClaimNotification"));
app.use("/fireClaimVerifications", require("./apis/fire/claim/fireClaimVerification"));
app.use("/fireUnderwritingVerifications", require("./apis/fire/claim/fireClaimUnderwritingVerification"));

//email receiver
app.use("/recievedEmails", require("./apis/recievedEmails"));
app.use("/eventLogs", require("./apis/EventLogs"));

//motor quotations
app.use("/customerInputMotors", require("./apis/motor/customerInputMotor"));
app.use("/minimumPremiums", require("./apis/motor/minimum_premium"));
app.use("/vehicleCategories", require("./apis/motor/vehicle_categories"));
app.use("/vehicles", require("./apis/motor/vehicles"));
app.use("/vehicleRateCharts", require("./apis/motor/vehicleRateCharts"));
app.use(
  "/dailyCashAllowanceCoverRates",
  require("./apis/motor/dailyCashAllowanceCoverRates")
);
app.use("/motBajAmbs", require("./apis/motor/motBajAmbs"));
app.use("/motorTrades", require("./apis/motor/motorTrades"));
app.use("/limitedCoverRates", require("./apis/motor/limitedCoverRates"));

//product
app.use(
  "/customerProductCategorys",
  require("./apis/customerProductCategorys")
);
app.use("/customerProducts", require("./apis/customerProducts"));

app.use("/buses", require("./apis/quotation/Buses"));
app.use("/minibuses", require("./apis/quotation/MiniBuses"));
app.use("/cctps", require("./apis/quotation/Cc_tps"));
app.use("/learners", require("./apis/quotation/Learners"));
app.use("/proposals", require("./apis/proposalRoute/proposal"));
app.use("/reInsurance", require("./apis/proposalRoute/reInsurance"));
app.use("/tpUnitPrice", require("./apis/quotation/TpUnitPrice"));
app.use("/endorsements", require("./apis/endorsement"));
app.use("/commentProposal", require("./apis/proposalRoute/proposalComment"));
app.use("/receiptOrders", require("./apis/receiptOrders"));
app.use("/multipleProposalDatas", require("./apis/proposalRoute/MultipleProposalData"));
app.use("/claimNotifications", require("./apis/motor/claim/claimNotification"));
app.use("/claimVerifications", require("./apis/motor/claim/claimVerification"));
app.use("/underWritingClaimVerifications", require("./apis/motor/claim/underwritingClaimVerification"));
app.use("/engineeringRecommendationSurveyRequests", require("./apis/motor/claim/engineeringRecommendationSurveyRequest"));
app.use("/policeReports", require("./apis/motor/claim/policeReport"));
//invoices
app.use("/invoices", require("./apis/invoices"));

app.use("/todoLists", require("./apis/todoLists"));
app.use("/bidders", require("./apis/motor/claim/bidder"));
app.use("/tenderAnalysis", require("./apis/motor/claim/tenderAnalysis"));

//swagger endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>{ 
  console.log(`Server running on port ${PORT}`)

});

