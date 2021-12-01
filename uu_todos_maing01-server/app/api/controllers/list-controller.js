"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new ListController();
