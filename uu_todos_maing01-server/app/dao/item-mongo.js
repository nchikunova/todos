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

  async setFinalState(awid, id, state) {
    let filter = {
      awid,
      id
    };
    return await super.findOneAndUpdate(filter, {state}, "NONE");
  }

  async delete(awid, id) {
    let filter = {
      awid,
      id,
    };
    return await super.deleteOne(filter);
  }

  async deleteManyByListId(awid, id) {
    let filter = {
      awid,
      listId : id
    };
    return await super.deleteMany(filter);
  }

  
  async list (filter, pageInfo){
    return await super.find(filter, pageInfo);
}
}

module.exports = ItemMongo;
