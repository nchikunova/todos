"use strict";
const ListAbl = require("../../abl/list-abl.js");

class ListController {

  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  delete(ucEnv) {
    return ListAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return ListAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new ListController();
