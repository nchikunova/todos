"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TodosMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, listId: 1,  state: 1 });
    await super.createIndex({ awid: 1, state: 1 });

  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByAwid(awid) {
    let filter = {
      awid
    };
    return await super.findOne(filter);
  }

  async updateByAwid(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  // async remove(uuObject) {
  //   let filter = {
  //     awid: uuObject.awid,
  //     id: uuObject.id,
  //   };
  //   return await super.deleteOne(filter);
  // }
}

module.exports = TodosMainMongo;
