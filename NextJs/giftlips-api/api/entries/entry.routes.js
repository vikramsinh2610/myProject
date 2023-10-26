var express = require("express");
const { validate } = require("express-validation");
const {
  cardMemberCheck,
  cardAdminCheck,
  checkJwt,
} = require("../../middleware");
const EntryController = require("./entry.controller");
var router = express.Router();

router.get("/", EntryController.getEntries);
router.post("/cardentry", EntryController.createEntryforUnauth);
router.get("/:entryId", EntryController.get);
router.post("/",  checkJwt,  EntryController.createEntry);
router.delete("/:entryId", checkJwt, EntryController.deleteEntry);
router.get('/:entryId/getLikes', checkJwt, EntryController.getLikes);
router.get('/:entryId/getComments', checkJwt, EntryController.getComments);
module.exports = router;
