"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
        code: `${Errors.Create.UC_CODE}unsupportedKeys`
    },
  getUnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
},
  deleteUnsupportedKeys: {
  code: `${Errors.Delete.UC_CODE}unsupportedKeys`
},

  listUnsupportedKeys: {
  code: `${Errors.List.UC_CODE}listDoesNotExist`
},
};

class ListAbl {

  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao("todoInstance");
    this.dao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item"); // todoItem

  
  }

  async list(awid, dtoIn, uuAppErrorMap) {
        // HDS 1
        const validationResult = this.validator.validate("listListDtoInType", dtoIn);
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
      // HDS 4
      const list = await this.dao.list(filter, pageInfo)
      return {
        uuAppErrorMap,
        list
      }
    
  }

  async delete(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
      uuAppErrorMap = ValidationHelper.processValidationResult(
          dtoIn,
          validationResult,
          WARNINGS.deleteUnsupportedKeys.code,
          Errors.Delete.InvalidDtoIn
          )   

    // default value

        if(!dtoIn.forceDelete){
          dtoIn.forceDelete = false
        }
    // HDS 2
        
    const uuTodos = await this.mainDao.getByAwid(awid);
    if (!uuTodos) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
  }

  if (uuTodos.state !== 'active') {
      throw new Errors.Delete.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
      { awid, currentState: uuTodos.state, expectedState: "active"})
  }
    // HDS 3
    const getList = await this.dao.get(awid, dtoIn.id);
    console.log(getList);
    if (!getList) {
    throw new Errors.Delete.ListDoesNotExist({ uuAppErrorMap }, {list: dtoIn.listId }, { awid })
    };
    // HDS 4
    if (dtoIn.forceDelete === false) {
      dtoIn.state = "active"; 
      const activeTodo = await this.itemDao.list({ listId: dtoIn.id } );
  
      if (activeTodo.itemList.length) {
        throw new Errors.Delete.ListContainsActiveItems({ uuAppErrorMap }, {
          id: dtoIn.id,
          itemList: activeTodo
        })
      }
      }

    // HDS 5
      await this.itemDao.deleteManyByListId(awid, dtoIn.id);

    // HDS 6
      await this.dao.delete(awid, dtoIn.id);

    // HDS 7

     return {
       uuAppErrorMap
      };
  }

  async update(awid, dtoIn, uuAppErrorMap) {
      // HDS 1 
      const validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
      uuAppErrorMap = ValidationHelper.processValidationResult(
          dtoIn,
          validationResult,
          WARNINGS.updateUnsupportedKeys.code,
          Errors.Update.InvalidDtoIn
          )   

      // HDS 2 
      const uuTodos = await this.mainDao.getByAwid(awid);
      if (!uuTodos) {
        throw new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
    }
  
    if (uuTodos.state !== 'active') {
        throw new Errors.Update.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
        { awid, currentState: uuTodos.state, expectedState: "active"})
    }
      // HDS 3 

      if(dtoIn.deadline){
        const inputDate = new Date(dtoIn.deadline);
        const currentDate = new Date();
        if(inputDate.getTime() < currentDate.getTime()){
          throw new Errors.Update.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline });
        }
      }

      // HDS 4
      const uuObject = { 
        ...dtoIn,
        awid,
      };

      let updatedList = null;
      try {
        updatedList = await this.dao.update(uuObject);
      } catch (err) {
          throw new Errors.Update.daoUpdateFailed({ uuAppErrorMap }, err);
      }

      // HDS 5 
      return {
          ...updatedList,
          uuAppErrorMap
      };
  }


  async get(awid, dtoIn, uuAppErrorMap) {
    // HDS 1

    const validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.getUnsupportedKeys.code,
        Errors.Get.InvalidDtoIn
        )     

    // HDS 2

    const uuTodos = await this.mainDao.getByAwid(awid);
    if (!uuTodos) {
      throw new Errors.Get.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
  }

  if (uuTodos.state !== 'active') {
      throw new Errors.Get.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
      { awid, currentState: uuTodos.state, expectedState: "active"})
  }
    // HDS 3

    const getList = await this.dao.get(awid, dtoIn.id);
        if (!getList) {
            throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap }, {todo: dtoIn.id }, { awid });
        }
    // HDS 4
        return {...getList, uuAppErrorMap };
    }


  async create(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.createUnsupportedKeys.code,
        Errors.Create.InvalidDtoIn
    );
    // HDS 2
    const uuTodos = await this.mainDao.getByAwid(awid);
    if (!uuTodos) {
      throw new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
  }

  if (uuTodos.state !== 'active') {
      throw new Errors.Create.TodoInstanceIsNotInProperState({ uuAppErrorMap }, 
      { awid, currentState: uuTodos.state, expectedState: "active"})
  }

    // HDS 3
    if(dtoIn.deadline){
      const inputDate = new Date(dtoIn.deadline);
      const currentDate = new Date();
      if(inputDate.getTime() < currentDate.getTime()){
        throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline });
      }
    }

    // HDS 4
    const uuObject = { 
      ...dtoIn,
      awid,
    };

    let uuList = null;
        try {
            uuList = await this.dao.create(uuObject);
        } catch (err) {
            throw new Errors.Create.daoCreateFailed({ uuAppErrorMap }, err);
        }

        // HDS-5
        return {
            uuAppErrorMap,
            ...uuList
        }
  }

}

module.exports = new ListAbl();
