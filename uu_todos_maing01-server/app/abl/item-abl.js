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

UpdateUnsupportedKeys: {
  code: `${Errors.Update.UC_CODE}unsupportedKeys`
},
setFinalStateUnsupportedKeys: {
  code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`
},

deleteUnsupportedKeys: {
  code: `${Errors.Delete.UC_CODE}unsupportedKeys`
},

listUnsupportedKeys: {
  code: `${Errors.List.UC_CODE}unsupportedKeys`
},

itemDoesNotExist: {
  code: `${Errors.Delete.UC_CODE}itemDoesNotExist`,
  message: 'Item with given id does not exist.'
},
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item"); // todoItem
    this.mainDao = DaoFactory.getDao("todoInstance"); // all App
    this.listDao = DaoFactory.getDao("list"); //all todoItems
  }

  async list(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.listUnsupportedKeys.code,
        Errors.List.InvalidDtoIn
        )    
    // HDS 2

  const todoInstance = await this.mainDao.getByAwid(awid);

  if (!todoInstance) {
  throw new Errors.List.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
}

  if (todoInstance.state !== 'active') {
  throw new Errors.List.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
  { awid, currentState: todoInstance.state, expectedState: "active"})
}
    // HDS 3
  const { pageInfo, ...restDtoIn } = dtoIn;
  const filter = { awid, ...restDtoIn };
    const itemList = await this.dao.list(filter, pageInfo)
    // HDS 4
    return itemList
  }

  async delete(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.deleteUnsupportedKeys.code,
        Errors.Delete.InvalidDtoIn
        )
// HDS 2

const todoInstance = await this.mainDao.getByAwid(awid);
if (!todoInstance) {
  throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
}

if (todoInstance.state !== 'active') {
  throw new Errors.Delete.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
  { awid, currentState: todoInstance.state, expectedState: "active"})
}


     // HDS 3

     const getItem = await this.dao.get(awid, dtoIn.id);
     console.log("🚀 ~ file: item-abl.js ~ line 103 ~ ItemAbl ~ delete ~ getItem", getItem)
     if (!getItem) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.itemDoesNotExist.code,
        WARNINGS.itemDoesNotExist.message,
        { item: dtoIn.itemCode }
      );   }

   if (getItem && getItem.state !== 'completted') {
    throw new Errors.Delete.ItemIsNotInCorectState({ uuAppErrorMap }, 
    { awid, currentState: getItem.state, expectedState: ["active", "cancelled"]})
}


// HDS 4
if (getItem) await this.dao.delete(awid, dtoIn.id)
    
// HDS 5

return {
uuAppErrorMap
}
  }


  async setFinalState(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.setFinalStateUnsupportedKeys.code,
        Errors.SetFinalState.InvalidDtoIn
        ) 
      // HDS 2
      const todoInstance = await this.mainDao.getByAwid(awid);
       if (!todoInstance) {
         throw new Errors.SetFinalState.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
     }

     if (todoInstance.state !== 'active') {
         throw new Errors.SetFinalState.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
         { awid, currentState: todoInstance.state, expectedState: "active"})
     }

     // HDS 3

     const getItem = await this.dao.get(awid, dtoIn.id);
     if (!getItem) {
       throw new Errors.SetFinalState.ItemDoesNotExist({ uuAppErrorMap }, {item: dtoIn.id }, { awid });
   }

   if (getItem.state !== 'active') {
    throw new Errors.SetFinalState.ItemIsNotInProperState({ uuAppErrorMap }, 
    { awid, currentState: getItem.state, expectedState: "active"})
}
// HDS 4


 const setItemState = await this.dao.setFinalState(awid, dtoIn.id, dtoIn.state);

// HDS 5
return {
  ...setItemState,
  uuAppErrorMap
}

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
