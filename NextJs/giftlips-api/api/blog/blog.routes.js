let express = require("express");
const BlogController = require("../blog/blog.controller");
let router = express.Router();

router.get("/posts", BlogController.list);

module.exports = router;
