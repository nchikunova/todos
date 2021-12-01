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
  }
};

class ListAbl {

  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao("todoInstance");
    this.dao = DaoFactory.getDao("list");
  
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

    const uuTodo = await this.dao.get(awid, dtoIn.id);
        if (!uuTodo) {
            throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap }, {todo: dtoIn.id }, { awid });
        }
    // HDS 4
        return {...uuTodo, uuAppErrorMap };
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
            throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, err);
        }

        // HDS-5
        return {
            uuAppErrorMap,
            ...uuList
        }
  }

}

module.exports = new ListAbl();
