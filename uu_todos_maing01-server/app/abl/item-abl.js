"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
},
getUnsupportedKeys: {
  code: `${Errors.Get.UC_CODE}unsupportedKeys`
},
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todoInstance");
    this.listDao = DaoFactory.getDao("list");
  }

  async update(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.getUnsupportedKeys.code,
        Errors.Update.InvalidDtoIn
        ) 


    // HDS 2

    const todoInstance = await this.mainDao.getByAwid(awid);
       if (!todoInstance) {
         throw new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
     }

     if (todoInstance.state !== 'active') {
         throw new Errors.Update.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
         { awid, currentState: todoInstance.state, expectedState: "active"})
     }


     // HDS 3

     const getItem = await this.dao.get(awid, dtoIn.id);
     if (!getItem) {
       throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap }, {item: dtoIn.id }, { awid });
   }

   if (todoInstance.state !== 'active') {
    throw new Errors.Update.ItemIsNotInCorrectState({ uuAppErrorMap }, 
    { awid, currentState: todoInstance.state, expectedState: "active"})
}

  // HDS 4

  const getList = await this.listDao.get(awid, dtoIn.listId);
  if (!getList) {
    throw new Errors.Update.ListDoesNotExist({ uuAppErrorMap }, {list: dtoIn.listId }, { awid });
}

// HDS 5

let updateItem = null;
const uuObject = {
  ...dtoIn,
      awid
}

try {
updateItem = await this.dao.update(uuObject);
} catch (err) {
  throw new Errors.Update.ItemDaoUpdateFailed({ uuAppErrorMap }, err);
}

// HDS-6
return {
  ...updateItem,
  uuAppErrorMap
}
  }

  async get(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.getUnsupportedKeys.code,
        Errors.Get.InvalidDtoIn
        )  

    // HDS 2
    const todoInstance = await this.mainDao.getByAwid(awid);
       if (!todoInstance) {
         throw new Errors.Get.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
     }

     if (todoInstance.state !== 'active') {
         throw new Errors.Get.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
         { awid, currentState: todoInstance.state, expectedState: "active"})
     }

     // HDS 3

     const getItem = await this.dao.get(awid, dtoIn.id);
     if (!getItem) {
       throw new Errors.Get.ItemDoesNotExist({ uuAppErrorMap }, {item: dtoIn.id }, { awid });
   }

       if (todoInstance.state !== 'active') {
         throw new Errors.Get.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
         { awid, currentState: todoInstance.state, expectedState: "active"})
     }

   // HDS 4

   return {...getItem, uuAppErrorMap };
  
  }

  async create(awid, dtoIn, uuAppErrorMap) {
       // HDS 1
       const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
       uuAppErrorMap = ValidationHelper.processValidationResult(
           dtoIn,
           validationResult,
           WARNINGS.createUnsupportedKeys.code,
           Errors.Create.InvalidDtoIn
       );

       // HDS 2
       const todoInstance = await this.mainDao.getByAwid(awid);
       if (!todoInstance) {
         throw new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
     }

     if (todoInstance.state !== 'active') {
         throw new Errors.Create.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
         { awid, currentState: todoInstance.state, expectedState: "active"})
     }
  
    // HDS 3
  const uuObject = {
  ...dtoIn,
      awid,
      state: "active"
}
if(!uuObject.highPriority){
  uuObject.highPriority = false
}


// HDS 4

  const getList = await this.listDao.get(awid, dtoIn.listId);
  if (!getList) {
    throw new Errors.Create.ListDoesNotExist({ uuAppErrorMap }, {list: dtoIn.listId }, { awid });
}

// HDS 5
  let createItem = null;
  try {
  createItem = await this.dao.create(uuObject);
  } catch (err) {
    throw new Errors.Create.ItemDaoCreateFailed({ uuAppErrorMap }, err);
  }

// HDS-6
  return {
    uuAppErrorMap,
    ...createItem
  }
}
  }


module.exports = new ItemAbl();
