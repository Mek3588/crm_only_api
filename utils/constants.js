const Branch = require("../models/Branch");
const CompanyContact = require("../models/CompanyContact");
const Contact = require("../models/Contact");
const Country = require("../models/Country");
const Region = require("../models/Region");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Opportunity = require("../models/Opportunity");
const City = require("../models/City");
const Subcity = require("../models/Subcity");
const Competitor = require("../models/competitor/Competitors");
const Partner = require("../models/partner/Partner");
const Vendor = require("../models/vendor/Vendors");
const Shareholder = require("../models/shareholders/Shareholder");
const Campaign = require("../models/Campaign");
const AgentComment = require("../models/agent/AgentComment");
const Organization = require("../models/broker/Organization");
const Agent = require("../models/agent/Agent");
const Broker = require("../models/broker/Broker");
const Document = require("../models/Document");
const OrganizationComment = require("../models/broker/OrganizationComment");
const CompetitorComment = require("../models/competitor/CompetitorComment");
const PartnerComment = require("../models/partner/PartnerComment");
const VendorComment = require("../models/vendor/VendorComment");
const ShareholderComment = require("../models/shareholders/ShareholderComment");
const AgentEmails = require("../models/agent/AgentEmail");
const OrganizationEmails = require("../models/broker/OrganizationEmail");
const AgentSms = require("../models/agent/AgentSMS");
const OrganizationSms = require("../models/broker/OrganizationSMS");
const EmailModel = require("../models/EmailModel");
const CompetitorBudget = require("../models/competitor/CompetitorBudget");
const PartnerBudget = require("../models/partner/PartnerBudget");
const Call = require("../models/contactActivity/ContactCall");
const DailyCashAllowanceCoverRate = require("../models/motor/DailyCashAllowanceCoverRate");
const Note = require("../models/contactActivity/Note");
const ContactMeeting = require("../models/contactActivity/ContactMeeting");
const TerritorialExtension = require("../models/TerritorialExtension");
const VehicleRateChart = require("../models/motor/VehicleRateChart");
const Vehicle = require("../models/motor/Vehicle");
const BSG = require("../models/BSG");
const MotorTrade = require("../models/motor/MotorTrade");
const MotBajAmb = require("../models/motor/MotBajAmb");
const CustomerProductCategory = require("../models/CustomerProductCategory");
const CustomerProduct = require("../models/CustomerProduct");
const RideAndTaxi = require("../models/RideAndTaxi");
const BusTaxiTp = require("../models/BusTaxiTp");
const TruckTankerTp = require("../models/TruckTankerTp");
const TipperMotorSpecialTp = require("../models/TipperMotorSpecial");
const Bus = require("../models/quotation/Buses");
const CCTP = require("../models/quotation/cc_tp");
const Proposal = require("../models/proposals/Proposal");
const { Op } = require("sequelize");
const Setting = require("../models/Setting");
const Learner = require("../models/quotation/learner");
const FireQuotation = require("../models/fire/FireQuotation");
const LimitedCoverRate = require("../models/motor/LimitedCoverRate");
const YellowCard = require("../models/YellowCard");
const YellowCardShort = require("../models/YellowCardShort");
const ActionPrevilage = require("../models/ActionPrevilages");
const UserGroup = require("../models/acl/UserGroup");
const Policy = require("../models/Policy");
const ComprehensiveTp = require("../models/ComprehnsicveTp");
const Invoice = require("../models/Invoice");

const Role = {
  superAdmin: "SuperAdmin",
  staff: "Staff",
  customer: "Customer",
  agent: "Agent",
  broker: "Broker",
};

const CompanyType = {
  account: "Account",
  lead: "Lead",
  vendor: "Vendor",
  partner: "Partner",
  competitor: "Competitor",
  organization: "Organization",
  shareholder: "Shareholder",
  agent: "Agent",
};

const meetingStatus = {
  planned: "Planned",
  postponed: "Postponed",
  happened: "Happened",
  cancelled: "Cancelled",
  other: "Other",
};

const ContactType = {
  individual: "Individual",
  corporate: "Corporate",
  joinIndividual: "Join Individual",
};

const contact_stage = {
  pending: "Pending",
  processing: "Processing",
  contactInTheFuture: "Contact In TheFuture",
  incorrect: "Incorrect",
  unobtained: "Unobtained",
  forConversion: "For Conversion",
};

const account_stage = {
  promisingClient: "Promising client",
  activeClient: "Active client",
  specialClient: "Special client",
  lostClient: "Lost client",
  unobtainedClient: "Unobtained client",
  inactiveClient: "Inactive client",
  closedClient: "Closed client",
  blackListedClient: "Blacklisted client",
};

const ContactStatus = {
  lead: "Lead",
  prospect: "Prospect",
  opportunity: "Opportunity",
  customer: "Customer",
};

const Campaign_type = {
  tour: "Tour",
  socialMedia: "Social Media",
  event: "Event",
  email: "Group Email",
  sms: "SMS",
  other: "Other",
};

const QuotationCalculationType = {
  flat: "Flat",
  cascading: "Cascading",
};

const MotorCoverType = {
  ownDamage: "Own Damage",
  thirdParty: "Third Party",
  comprehensive: "Comprehensive",
  territorialExtension: "Territorial Extension",
  bsg: "BSG",
  dailyCash: "Daily Cash",
  flood: "Flood",
  fireAndTheft: "Fire and Theft",
  fireOnly: "Fire Only",
  theftOnly: "Theft Only",
  comprehensive_tp: "Comprehensive TP",
  ignition_key: "Ignition key",
  TP_limit_extension: "TP limit extension",
  yellow_card: "Yellow Card"
};

const purposes = {
  commercial: "Commercial",
  private: "Private",
  goods_carrying: "Goods Carrying",
  own_goods: "Own Goods",
  general_cartage: "General Cartages",
  passengers_carrying: "Passengers Carrying",
  own_service: "Own Services",
  public_service: "Public Services",
  hire_vehicles: "Hire Vehicles",
  purlic_hire: "Public Hires",
  private_hire: "Private Hires",
  public_transport: "Public Transport",
  learner: "Learner",
};

const comprehensivetypes = {
  private_vehicles : "Private Vehicles",
  learners : "Learners",
  car_hire_taxi : "Car Hire & Taxi",
  own_goods : "Own Goods",
  general_cartage : "General Cartage",
  tanker : "Tanker",
  bus : "Bus",
  minibus : "Minibus",
  motor_cycle :"Motor Cycle",
  motor_trade :"Motor_Trade",
  special_vehicles :"Special_Vehicles",
  agricultural_vehicles_machineries : "Agricultural Vehicles Machineries ",
};

const VehicleCategorys = {
  normal: "Normal",
  luxury: "Luxury",
  special: "Special",
  unsupported: "Unsupported",
};


const vehicleTypes = {
  private_automobiles: "Automobiles",
  taxi: "Taxis",
  pickup_and_vans: "Pickup and vans",
  trucks: "Trucks",
  trailer: "Trailer",

  // normal_trucks: "Normal trucks",
  // isuzu_trucks: "Isuzu trucks",
  tipper_trucks: "Tipper trucks",
  oil_tanker_truck: "Oil tanker trucks",
  watter_tanker_truck: "Water tanker trucks",
  buses: "Buses",
  mini_buses: "Mini Buses",
  ride_service: "Ride services",
  car_hires: "Car hires",
  motorcycle: "Motorcycles",
  bajajs: "Bajajs",
  ambulances: "Ambulances",
  motor_trade_garage: "Motor trade(garage)",
  motor_trade_non_garage: "Motor trade(non garage)",
  special_vehicles: "special vehicles",
  agricaltural_vehicles: "Agricultural vehicles",
  leaners: "Learners",
  semi_trailer: "Trailer",
  other_truck: "Other Truck",
};

const goods_carrying = [
  vehicleTypes.pickup_and_vans,
  vehicleTypes.trucks,
  vehicleTypes.tipper_trucks,
  vehicleTypes.watter_tanker_truck
]
const SettingsEnum = {
  TpServiceChage: "TP service charge",
  ODServiceCharge: "OD service charge",
  PaperSticker: "Paper Sticker",
};

const vehicleTypesModelsMap = {
  [vehicleTypes.private_automobiles]: VehicleRateChart,
  [vehicleTypes.taxi]: RideAndTaxi,
  [vehicleTypes.pickup_and_vans]: VehicleRateChart,
  [vehicleTypes.normal_trucks]: VehicleRateChart,
  [vehicleTypes.trucks]: VehicleRateChart,
  [vehicleTypes.tipper_trucks]: VehicleRateChart,
  [vehicleTypes.oil_tanker_truck]: VehicleRateChart,
  [vehicleTypes.watter_tanker_truck]: VehicleRateChart,
  [vehicleTypes.buses]: Bus,
  [vehicleTypes.ride_service]: RideAndTaxi,
  [vehicleTypes.car_hires]: VehicleRateChart,
  [vehicleTypes.motorcycle]: MotBajAmb,
  [vehicleTypes.bajajs]: MotBajAmb,
  [vehicleTypes.ambulances]: MotBajAmb,
  [vehicleTypes.motor_trade_garage]: MotorTrade,
  [vehicleTypes.motor_trade_non_garage]: MotorTrade,
  [vehicleTypes.special_vehicles]: VehicleRateChart,
  [vehicleTypes.agricaltural_vehicles]: VehicleRateChart,
};

const tpVehicleTypesModelsMap = {
  [vehicleTypes.private_automobiles]: CCTP,
  [vehicleTypes.taxi]: BusTaxiTp,
  [vehicleTypes.pickup_and_vans]: TruckTankerTp,

  [vehicleTypes.trucks]: TruckTankerTp,

  // [vehicleTypes.normal_trucks]: TruckTankerTp,
  // [vehicleTypes.isuzu_trucks]: TruckTankerTp,
  [vehicleTypes.tipper_trucks]: TipperMotorSpecialTp,
  [vehicleTypes.oil_tanker_truck]: TruckTankerTp,
  [vehicleTypes.watter_tanker_truck]: TruckTankerTp,
  [vehicleTypes.buses]: BusTaxiTp,
  [vehicleTypes.mini_buses]: BusTaxiTp,
  [vehicleTypes.ride_service]: BusTaxiTp,
  [vehicleTypes.car_hires]: BusTaxiTp,
  [vehicleTypes.motorcycle]: CCTP,
  [vehicleTypes.bajajs]: CCTP,
  [vehicleTypes.ambulances]: CCTP,
  [vehicleTypes.motor_trade_garage]: TipperMotorSpecialTp,
  [vehicleTypes.motor_trade_non_garage]: TipperMotorSpecialTp,
  [vehicleTypes.special_vehicles]: TipperMotorSpecialTp,
  [vehicleTypes.agricaltural_vehicles]: TipperMotorSpecialTp,
  [vehicleTypes.leaners]: Learner,
};

const motorFields = {
  vehicleId: "vehicleId",
  is_named_driver: "is_named_driver",
  purpose: "purpose",
  carrying_capacity: "carrying_capacity",
  has_locally_modified_body: "has_locally_modified_body",
  is_garage: "is_garage",
  risk_type: "risk_type",
  cc: "cc",
  is_trailer: "isTrailer",
  driverType: "driverType",
  main_driver: "main_driver",
  additional_drivers: "additional_drivers",
  vehicleType: "vehicleType",
  vehicle_type: "vehicle_type",
  taxi_type: "taxi_type",
};

const getSearchModelAndConditions = (vehicleType, req) => {
  switch (vehicleType) {
    case vehicleTypes.private_automobiles:
      

      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.is_named_driver]: req.is_named_driver,
        [motorFields.purpose]: req.purpose,
      };
    case vehicleTypes.taxi:
      return {};

    case vehicleTypes.pickup_and_vans:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
        [motorFields.is_named_driver]: req.is_named_driver,
      };

    case vehicleTypes.trucks:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
      };

    // case vehicleTypes.normal_trucks:
    //   return {
    //     [motorFields.vehicleId]: Number(req.vehicleId),
    //     [motorFields.purpose]: req.purpose,
    //   };

    // case vehicleTypes.isuzu_trucks:
    //   return {
    //     [motorFields.vehicleId]: Number(req.vehicleId),
    //     [motorFields.purpose]: req.purpose,
    //   };

    case vehicleTypes.tipper_trucks:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.is_trailer]: req.is_trailer,
      };

    case vehicleTypes.oil_tanker_truck:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.driverType]: req.driverType,
      };

    case vehicleTypes.watter_tanker_truck:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.driverType]: req.driverType,
      };

    case vehicleTypes.buses:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
        [motorFields.carrying_capacity]: req.carrying_capacity,
        [motorFields.has_locally_modified_body]: req.has_locally_modified_body,
      };

    case vehicleTypes.ride_service:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
      };

    case vehicleTypes.car_hires:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
        [motorFields.is_named_driver]: req.is_named_driver,
      };
    case vehicleTypes.motorcycle:
      return {
        [motorFields.purpose]: req.purpose,
      };
    case vehicleTypes.bajajs:
      return {
        [motorFields.purpose]: req.purpose,
      };
    case vehicleTypes.ambulances:
      return {
        [motorFields.purpose]: req.purpose,
      };
    case vehicleTypes.motor_trade_garage:
      return {
        [motorFields.is_garage]: req.is_garage,
        [motorFields.risk_type]: req.risk_type,
        [motorFields.driverType]: req.driverType,
      };
    case vehicleTypes.motor_trade_non_garage:
      return {
        [motorFields.is_garage]: req.is_garage,
        [motorFields.risk_type]: req.risk_type,
        [motorFields.driverType]: req.driverType,
      };
    case vehicleTypes.special_vehicles:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
      };
    case vehicleTypes.agricaltural_vehicles:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
      };
  }
};

const getTpSearchModelAndConditions = (vehicleType, req) => {
  switch (vehicleType) {
    case vehicleTypes.private_automobiles:
      return {
        [Op.and]: [
          { min_cc: { [Op.lte]: req.cc } },
          { max_cc: { [Op.gte]: req.cc } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicle_type]: req.vehicle_type },
        ],
      };

    case vehicleTypes.pickup_and_vans:
      return {
        [Op.and]: [
          // { minCapacity: { [Op.lte]: req.carrying_capacity } },
          // { maxCapacity: { [Op.gte]: req.carrying_capacity } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicleType]: req.vehicle_type },
        ],
        // [motorFields.carrying_capacity]: Number(req.carrying_capacity),
        // [motorFields.purpose]: req.purpose,
      };

      case vehicleTypes.trucks:
        if (req.is_special_truck) {


          return {
            [Op.and]: [
              { [motorFields.vehicleType]: req.vehicle_type },
              { [motorFields.vehicleId]: req.vehicleId },
              { isFixed: true },
            ],
          };
        } else if (req.is_trailer || req.is_semi_trailer) {

          return {
            [Op.and]: [
              { [motorFields.purpose]: req.purpose },
              { [motorFields.vehicleType]: req.vehicle_type },
              { is_trailer: true },
            ],
          };
        } else {

          return {
            [Op.and]: [
              { [motorFields.purpose]: req.purpose },
              { [motorFields.vehicleType]: req.vehicle_type },
              { carryCapacity: { [Op.gte]: req.min_carrying_capacity } },
              { carryCapacity: { [Op.lte]: req.max_carrying_capacity } },
              { [motorFields.vehicleId]: req.vehicleId },
            ],
          };
        }

      

    case vehicleTypes.other_truck:
      return {
        [Op.and]: [
          { minCapacity: { [Op.lte]: req.carrying_capacity } },
          { maxCapacity: { [Op.gte]: req.carrying_capacity } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicleType]: req.vehicle_type },
          { is_trailer: false },
          { is_semi_trailer: false },

        ],
      };

    // case vehicleTypes.normal_trucks:
    //   return {
    //     [Op.and]: [
    //       { minCapacity: { [Op.lte]: (req.carrying_capacity) } },
    //       { maxCapacity: { [Op.gte]: (req.carrying_capacity) } },
    //       { [motorFields.purpose]: req.purpose },
    //       { [motorFields.vehicleType]: req.vehicle_type },
    //     ]
    //   };

    // case vehicleTypes.isuzu_trucks:
    //   return {
    //     [Op.and]: [
    //       { minCapacity: { [Op.lte]: (req.carrying_capacity) } },
    //       { maxCapacity: { [Op.gte]: (req.carrying_capacity) } },
    //       { [motorFields.purpose]: req.purpose },
    //       { [motorFields.vehicleType]: req.vehicle_type },
    //     ]
    //   };

    case vehicleTypes.tipper_trucks:
      return {
        [motorFields.vehicleType]: req.vehicle_type,
        [motorFields.is_trailer]: false,
      };

    case vehicleTypes.oil_tanker_truck:
      return {
        [Op.and]: [
          { minCapacity: { [Op.lte]: req.carrying_capacity } },
          { maxCapacity: { [Op.gte]: req.carrying_capacity } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicleType]: req.vehicle_type },
        ],
      };

    case vehicleTypes.watter_tanker_truck:
      return {
        [Op.and]: [
          { minCapacity: { [Op.lte]: req.carrying_capacity } },
          { maxCapacity: { [Op.gte]: req.carrying_capacity } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicleType]: req.vehicle_type },
        ],
      };

    case vehicleTypes.buses:
      return {
        [Op.and]: [
          { minSeat: { [Op.lte]: req.carrying_capacity } },
          { maxSeat: { [Op.gte]: req.carrying_capacity } },
          { [motorFields.purpose]: req.purpose },
        ],
      };

    case vehicleTypes.mini_buses:
      return {
        [Op.and]: [
          { [motorFields.purpose]: req.purpose },
          { vehicleType: req.vehicle_type },
        ],
      };

    case vehicleTypes.taxi:
      return {
        [Op.and]: [
          { minSeat: { [Op.lte]: req.carrying_capacity } },
          { maxSeat: { [Op.gte]: req.carrying_capacity } },
          { [motorFields.taxi_type]: req.taxi_type },
        ],
      };
    case vehicleTypes.ride_service:
      return {
        [motorFields.carrying_capacity]: Number(req.carrying_capacity),
      };

    case vehicleTypes.car_hires:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
        [motorFields.is_named_driver]: req.is_named_driver,
      };
    case vehicleTypes.motorcycle:
      return {
        [Op.and]: [
          { min_cc: { [Op.lte]: req.cc } },
          { max_cc: { [Op.gte]: req.cc } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicle_type]: req.vehicle_type },
          { [motorFields.is_named_driver]: req.is_named_driver },
        ],
      };
    case vehicleTypes.bajajs:
      return {
        [Op.and]: [
          { min_cc: { [Op.lte]: req.cc } },
          { max_cc: { [Op.gte]: req.cc } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicle_type]: req.vehicle_type },
        ],
      };
    case vehicleTypes.ambulances:
      return {
        [Op.and]: [
          { min_cc: { [Op.lte]: req.cc } },
          { max_cc: { [Op.gte]: req.cc } },
          { [motorFields.purpose]: req.purpose },
          { [motorFields.vehicle_type]: req.vehicle_type },
        ],
      };
    case vehicleTypes.motor_trade_garage:
      return {
        [motorFields.vehicleType]: req.vehicle_type,
        // [motorFields.driverType]: req.driverType,
        // [Op.and]: [
        //   // { [motorFields.vehicle_type]: req.vehicle_type },
        //   { [motorFields.vehicleType]: (req.vehicle_type) },
        //   // { [motorFields.additional_drivers]: (req.additional_drivers) },
        // ]
        // [motorFields.vehicleType]: req.vehicle_type,
        // [motorFields.driverType]: req.driverType,
      };
    case vehicleTypes.motor_trade_non_garage:
      return {
        [motorFields.vehicleType]: req.vehicle_type,
        // [motorFields.driverType]: req.driverType,
      };
    case vehicleTypes.special_vehicles:
      return { [motorFields.vehicleType]: req.vehicle_type };

    case vehicleTypes.agricaltural_vehicles:
      return {
        [motorFields.vehicleId]: Number(req.vehicleId),
        [motorFields.purpose]: req.purpose,
      };
  }
};

const eventResourceTypes = {
  comprehensiveTp: "comprehensiveTp",
  policy: "policy",
  actionPrevilage: "actionPrevilage",
  yellowCardShort: "yellowCardShort",
  lead: "lead",
  account: "account",
  contact: "contact",
  opportunity: "opportunity",
  employee: "employee",
  branch: "branch",
  department: "department",
  country: "country",
  region: "region",
  city: "city",
  subcity: "subcity",
  campaign: "campaign",
  competitor: "competitor",
  partner: "partner",
  vendor: "vendor",
  shareHolder: "shareHolder",
  broker: "broker",
  agent: "agent",
  broker_member: "broker member",
  document: "document",
  vendorDocument: "vendor document",
  competitorDocument: "competitor document",
  shareholderDocument: "shareholder document",
  partnerDocument: "partner document",
  agentDocument: "agent document",
  brokerDocument: "broker document",
  employeeDocument: "employee document",
  leadDocument: "lead document",
  accountDocument: "account document",
  contactDocument: "contact document",
  customerDocument: "customer document",
  agentComment: "agent comment",
  brokerComment: "broker comment",
  competitorComment: "competitor comment",
  partnerComment: "partner comment",
  vendorComment: "vendor comment",
  shareholderComment: "shareholder comment",
  agentEmail: "agent email",
  organizationEmail: "organization email",
  agentSms: "agent sms",
  organizationSms: "organization sms",
  competitorBudget: "competitor budget",
  partnerBudget: "partner budget",
  note: "note",
  meeting: "meeting",
  call: "call",
  contactNote: "contact note",
  contactMeeting: "contact meeting",
  dailyCashAllowanceCoverRate: "Daily Cash Allowance Cover Rate",
  vehicle: "Vehicle",
  vehicleRateChart: "vehicleRateChart",
  territorialExtension: "territorialExtension",
  bsg: "BSG",
  setting: "settings",
  bus: "Bus",
  fireQuotations: "Fire Quotations",
  motorTrade: "Motor Trade",
  motBajAmb: "Motor Bajaj Ambulance",
  customerProductCategory: "Product Category",
  customerProduct: "Product",
  rideAndTaxi: "Ride and Taxi",
  cctp: "CCTP",
  learner: "Learner",
  busTaxiTp: "busTaxiTp",
  truckTankerTp: "truckTankerTp",
  tipperMotorSpecialTp: "tipperMotorSpecialTp",
  proposal: "proposal",
  tpUnitPrice: "TP Unit Price",
  limitedCoverRate: "Limited Cover Rate",
  reInsurance: "Re-Insurance",

  yellowCard: "yellowCard",
  endorsement: "Endorsement",
  receipt_order: "Receipt Order",
  invoice: "Invoice"
};
const eventActions = {
  view: "view",
  create: "create",
  edit: "edit",
  delete: "delete",
};

const eventLogResourceMap = {
  comprehensiveTp: ComprehensiveTp,
  policy: Policy,
  actionPrevilage: ActionPrevilage,
  yellowCardShort: YellowCardShort,
  yellowCard: YellowCard,
  account: Contact,
  lead: Contact,
  opportunity: Opportunity,
  contact: CompanyContact,
  employee: Employee,
  branch: Branch,
  department: Department,
  country: Country,
  region: Region,
  city: City,
  subcity: Subcity,
  competitor: Competitor,
  partner: Partner,
  vendor: Vendor,
  shareHolder: Shareholder,
  campaign: Campaign,
  agentComment: AgentComment,
  broker: Organization,
  agent: Agent,
  broker_member: Broker,
  document: Document,
  vendorDocument: Document,
  competitorDocument: Document,
  shareholderDocument: Document,
  partnerDocument: Document,
  agentDocument: Document,
  brokerDocument: Document,
  employeeDocument: Document,
  leadDocument: Document,
  accountDocument: Document,
  contactDocument: Document,
  customerDocument: Document,
  agentComment: AgentComment,
  brokerComment: OrganizationComment,
  competitorComment: CompetitorComment,
  partnerComment: PartnerComment,
  vendorComment: VendorComment,
  shareholderComment: ShareholderComment,
  dailyCashAllowanceCoverRate: DailyCashAllowanceCoverRate,
  agentEmail: EmailModel,
  organizationEmail: EmailModel,
  agentSms: EmailModel,
  organizationSms: EmailModel,
  competitorBudget: CompetitorBudget,
  partnerBudget: PartnerBudget,
  shareholderComment: ShareholderComment,
  vendorComment: VendorComment,
  call: Call,
  note: Note,
  meeting: ContactMeeting,
  vehicleRateChart: VehicleRateChart,
  vehicle: Vehicle,
  territorialExtension: TerritorialExtension,
  bsg: BSG,
  setting: Setting,
  motorTrade: MotorTrade,
  motBajAmb: MotBajAmb,
  customerProducts: CustomerProduct,
  rideAndTaxi: RideAndTaxi,
  busTaxiTp: BusTaxiTp,
  truckTankerTp: TruckTankerTp,
  tipperMotorSpecialTp: TipperMotorSpecialTp,
  fireQuotations: FireQuotation,
  limitedCoverRate: LimitedCoverRate,
  invoice: Invoice,

  private_automobiles: "Automobiles",
  pickup_and_vans: "Pickup and vans",
  normal_trucks: "normal trucks",
  isuzu_trucks: "Isuzu trucks",
  tipper_trucks: "Tipper trucks",
  oil_tanker_truck: "Oil tanker trucks",
  watter_tanker_truck: "Water tanker trucks",
  buses: "Buses",
  ride_service: "Ride services",
  taxi: "Taxis",
  car_hires: "Car hires",
  motorcycle: "Motircycles",
  bajajs: "Bajajs",
  ambulances: "Ambulances",
  motor_trade_garage: "Motor trade(garage)",
  motor_trade_non_garage: "Motor trade(non garage)",
  special_vehicles: "special vehicles",
  agricaltural_vehicles: "Agricaltural vehicles",
  limitedCoverRate: "Limited Cover Rate",
};

const additionalVehicleTypes = {
  learner: "Learner",
  ride: "Ride services",
  carHire: "Car hires",
  ambulance: "Ambulances",
  nonOfTheAbove: "None of the above",
};

const privilegeObjects = {
  Proposal: "Proposal",
  ReInsurance: "ReInsurance",
  Finance: "Finance",
};

const privilegeActions = {
  approve: "Approve",
};

const privilegeObjectsArray = Object.values(privilegeObjects);
const privilegeActionsArray = Object.values(privilegeActions);

const getGroupIdFromUserId = async (userId) => {
  const group = await UserGroup.findOne({ where: { userId } });
  
  return group.groupId || 0;
};

const isActionPrivileged = async (userId, object, action) => {
  try {
    const group = await getGroupIdFromUserId(userId);
    const privileged = await ActionPrevilage.findOne({
      where: { group: group ? group.id : 0, object, action },
    });

    return privileged ? true : false;
  }
  catch (error) {
    
    return error;
  }
};

const getGrantedPrivileges = async (userId) => {
  try {
    const groupId = await getGroupIdFromUserId(userId);
    let resp = await checkAllPrivileges(groupId, privilegeActions.approve);
    
  }
  catch (error) {
    
    return error
  }
}

const checkAllPrivileges = async (groupId, action) => {
  let privileges = {};
  const promises = await privilegeObjectsArray.map(async (object) => {
    const privileged = await ActionPrevilage.findOne({
      where: { group: groupId ? groupId : 0, object, action: action },
    });
    privileges = { ...privileges, object: privileged ? true : false }
    
    
  });
  Promise.all(promises).then(function (results) {
    if (results)
      return privileges
  });
}

const isAdditionalVehicleType = (vehicleType) => {
  if (
    vehicleType == additionalVehicleTypes.ride ||
    vehicleType == additionalVehicleTypes.carHire ||
    vehicleType == additionalVehicleTypes.ambulance
  ) {
    return true;
  }
  return false;
};


const EndorsementFiles = {
  //ALL
  extensionOfPolicyPeriodEndorsement: "/templates/endorsement/Extension-of-Policy-Period-Endorsement.html",
  // MOTOR_TRADE ENDORSEMENT
  cancellationEndorsement: "/templates/endorsement/motor_trade/All-21-Cancellation-End.html",
  additionOfPremiumEndorsement: "/templates/endorsement/motor_trade/ALL-Addition-of-Premium-Endorsement.html",
  changeOfNameOfInsuredEndorsement: "/templates/endorsement/motor_trade/ALL-Change-of-Name-of-insured-Endorsement.html",
  decreaseInSumInsuredEndorsement: "/templates/endorsement/motor_trade/ALL-Decrease-in-Sum-Insured-End.html",
  increaseInSumInsuredEndEndorsement: "/templates/endorsement/motor_trade/ALL-Increase-in-Sum-Insured-End.html",
  mortgageEndorsement: "/templates/endorsement/motor_trade/ALL-Mortgage-Endorsement.html",
  reductionOFPolicyPeriodEndorsement: "/templates/endorsement/motor_trade/ALL-reduction-of-Policy-Period-Endorsement.html",
  refundOfPremiumENdorsement: "/templates/endorsement/motor_trade/ALL-refund-of-Premium-Endorsement.html",
  excessEndorsement: "/templates/endorsement/motor_trade/Excess-Endorsement.html",
  exclusionOfCoverEndorsement: "/templates/endorsement/motor_trade/Exclusion-of-cover-Endorsement.html",
  inclusionOfCoverEndorsement: "/templates/endorsement/motor_trade/Inclusion-of-cover-Endorsement.html",
  renewalEndorsement: "/templates/endorsement/motor_trade/Renewal-endorsement.html",

  //OWN_DAMAGE
  ownDamageChangeOfUseOfVehicle: "/templates/endorsement/own_damage/Change-of -Use-of-Motor-Vehicle-Endorsement.html",
  ownDamageDecreaseInSumInsures: "/templates/endorsement/own_damage/Decrease-in-Sum-Insured-Endorsement.html",
  ownDamageIncreaseInSumInsures: "/templates/endorsement/own_damage/Increase-in-Sum-Insured-Endorsement.html",
  ownDamageMortgage: "/templates/endorsement/own_damage/Mortgage-Endorsement.html",
  ownDamageMotorVehicleExclusion: "/templates/endorsement/own_damage/Motor-Vehicle-Exclusion-Endorsement.html",
  ownDamageNamedPersonOnlyDrivingAmendment: "/templates/endorsement/own_damage/Named-Person -Only-Driving-Amendment.html",
  ownDamageReductionOfPolicyPeriod: "/templates/endorsement/own_damage/Reduction-of-Policy-Period-Endorsement.html",
  ownDamageTerritorialExtension: "/templates/endorsement/own_damage/Territorial-Extension-Endorsement.html",
  ownDamageTotalSuspension: "/templates/endorsement/own_damage/total-suspension.html",

  //OWN_DAMAGE COMMERCIAL ONLY 
  ownDamageEndorsementCommercialAdditionOfPremium: "/templates/endorsement/own_damage/commercial/ALL- Addition-of-Premium-Endorsement.html",
  ownDamageEndorsementCommercialCancellation: "/templates/endorsement/own_damage/commercial/Cancellation-Endorsement.html",
  ownDamageEndorsementCommercialMotorVehicleInclusion: "/templates/endorsement/own_damage/commercial/Motor-Vehicle-Inclusion-Endorsement.html",
  ownDamageEndorsementCommercialRefundOfPremium: "/templates/endorsement/own_damage/commercial/Refund-of-Premium-Endorsement.html",
  ownDamageEndorsementCommercialReinstatementOFSuspendedCover: "/templates/endorsement/own_damage/commercial/Reinstatement-of-Suspended-Cover -Endorsement.html",
  ownDamageEndorsementCommercialRenewal: "/templates/endorsement/own_damage/commercial/Renewal-Endorsement.html",

  //OWN_DAMAGE PRIVATE ONLY
  ownDamageEndorsementPrivateAdditionOfPremium: "/templates/endorsement/own_damage/private/Change_of_Plate_Number_Endorsement.html",
  ownDamageEndorsementPrivateMotorVehicleInclusion: "/templates/endorsement/own_damage/private/Motor_Vehicle_Inclusion_Endorsement.html",
  ownDamageEndorsementPrivateRenewal: "/templates/endorsement/own_damage/private/renewal-endorsement.html",

  //BSG

  bsg: "/templates/endorsement/bsg/bsg-Endorsement.html",


}

const classOfBusinesses = [
  { name: "Property Insurance", code: "PropertyIns" },
  { name: "Personal Insurance", code: "PersonalIns" },
  { name: "Marine Insurance", code: "MarineIns" },
  { name: "Engineering Insurance", code: "EngineeringIns" },
  { name: "Pecuniary Insurance", code: "PecuniaryIns" },
];

const propertyInsurances = {
  motorIns: "Motor Insurance with Additional Covers",
  fireIns: "Fire Insurance with allied covers",
}

const personalInsurances = [
  { name: "Personal Accidents", code: "PersonalAccidentIns" },
  { name: "Workmen's compensation", code: "WorkmenIns" },
];



const policyStatus = {
  draftPolicy: "draft",
  final: "final"
};
const financeStatus = {
  receiptOrder: "Receipt order",
  final: "Final"
}

const branchManagerApprovalStatus = {
  approved: "Accept",
  pending: "Pending",
  rejected: "Reject"
};

const claimVerificationStatus = {
  new: "New",
  seen: "Seen"
};

const fireClaimUnderwritingVerificationStatus = {
  approved: "Verify",
  pending: "Pending",
  rejected: "Reject"
};
const expectedStatus = {
  onrpogress: "onProgress",
  final: "Final",
};

module.exports = {
  Role,
  ContactStatus,
  Campaign_type,
  ContactType,
  contact_stage,
  account_stage,
  CompanyType,
  QuotationCalculationType,
  MotorCoverType,
  meetingStatus,
  eventResourceTypes,
  eventActions,
  eventLogResourceMap,
  vehicleTypes,
  VehicleCategorys,
  vehicleTypesModelsMap,
  getSearchModelAndConditions,
  tpVehicleTypesModelsMap,
  getTpSearchModelAndConditions,
  additionalVehicleTypes,
  isAdditionalVehicleType,
  SettingsEnum,
  motorFields,
  purposes,
  comprehensivetypes,
  isActionPrivileged,
  privilegeObjectsArray,
  privilegeActionsArray,
  privilegeObjects,
  privilegeActions,
  EndorsementFiles,
  getGrantedPrivileges,
  goods_carrying,
  classOfBusinesses,
  propertyInsurances,
  personalInsurances,
  policyStatus,
  financeStatus,
  branchManagerApprovalStatus,
  claimVerificationStatus,
  fireClaimUnderwritingVerificationStatus,
};

