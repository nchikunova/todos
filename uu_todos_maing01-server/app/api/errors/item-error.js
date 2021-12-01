"use strict";

const TodosMainUseCaseError = require("./todos-main-use-case-error.js");
const ITEM_ERROR_PREFIX = `${TodosMainUseCaseError.ERROR_PREFIX}item/`;

const Create = {
  UC_CODE: `${ITEM_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = 	'DtoIn is not valid.';
    }
  },

  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = 	'TodoInstance does not exist.';
    }
  },
  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = 	'The application is not in proper state.';
    }
  },

  ListDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = 	'List with given id does not exist.';
    }
  },
  ItemDaoCreateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = 	'Creating item by item DAO create failed..';
    }
  },
};

const Get = {
  UC_CODE: `${ITEM_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = 	'DtoIn is not valid.';
    }
},
TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${Get.UC_CODE}todoInstanceDoesNotExist`;
    this.message = 	'TodoInstance does not exist.';
  }
},

TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${Get.UC_CODE}todoInstanceIsNotInProperState`;
    this.message = 	'The application is not in proper state.';
  }
},
ItemDoesNotExist: class extends TodosMainUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${Get.UC_CODE}itemDoesNotExist`;
    this.message = 	'Item with given id does not exist.';
  }
},
};

const Update = {
  UC_CODE: `${ITEM_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = 	'DtoIn is not valid.';
    }
  },
  TodoInstanceDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoInstanceDoesNotExist`;
      this.message = 	'TodoInstance does not exist.';
    }
  },
  
  TodoInstanceIsNotInProperState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = 	'The application is not in proper state.';
    }
  },
  ItemDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDoesNotExist`;
      this.message = 	'Item with given id does not exist.';
    }
  },

  ItemIsNotInCorrectState: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemIsNotInCorrectState`;
      this.message = 	'Item is not in correct state.';
    }
  },
  ListDoesNotExist: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDoesNotExist`;
      this.message = 	'List with given id does not exist.';
    }
  },
  ItemDaoUpdateFailed: class extends TodosMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDaoUpdateFailed`;
      this.message = 	'Update item by item DAO update failed.';
    }
  },
};

module.exports = {
  Update,
  Get,
  Create
};
