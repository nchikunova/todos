"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {

  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  // setFinalState(awid, id, state)->uuObject

  async delete(awid, id) {
    let filter = {
      awid,
      id,
    };
    return await super.deleteOne(filter);
  }

  // deleteManyByListId(awid, listId) -> void

  // list(awid,pageInfo)->{itemList:[uuObject],pageInfo:{}}

  // listByListIdAndState(awid, listId, state, pageInfo)->{itemList:[uuObject],pageInfo:{}}

  // listByState (awid, state, pageInfo) ->{itemList:[uuObject],pageInfo:{}}
}

module.exports = ItemMongo;
