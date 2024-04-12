const {
  getNumberOfContacts,
  getThisYearCount,
  getByBussinessSource,
  getByBussinessSourceById,
  getThisYearCountById,
  getNumberOfContactsById,
  getByBussinessPercent,
  getByBussinessPercentById,
  getOpportunityByMonth,
} = require("../handlers/dashboard/ContactReport");
const { getNumberOfUsers } = require("../handlers/dashboard/UserReport");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");
const router = require("express").Router();
router
  .route("/getByBussinessInpercent")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getByBussinessPercent
  );
router
  .route("/getByBussinessInpercent/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getByBussinessPercentById
  );

router
  .route("/number_of_contacts")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getNumberOfContacts
  );
router
  .route("/numberOfContactThisYear")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getThisYearCount
  );
router
  .route("/opportunityByMonth")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getOpportunityByMonth
  );
router
  .route("/getByBussinessSource")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getByBussinessSource
  );
router
  .route("/getNumberOfUsers")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getNumberOfUsers
  );
router
  .route("/getByBussinessSource/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getByBussinessSourceById
  );
router
  .route("/numberOfContactThisYear/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getThisYearCountById
  );
router
  .route("/number_of_contacts/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["dashboard"]),
    getNumberOfContactsById
  );
module.exports = router;
