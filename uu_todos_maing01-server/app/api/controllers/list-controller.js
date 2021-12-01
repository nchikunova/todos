"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new ListController();