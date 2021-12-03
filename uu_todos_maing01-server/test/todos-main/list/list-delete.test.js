const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/delete";
const CMD = "list/delete";

// beforeAll(async () => {
//   await TestHelper.setup();
//   await TestHelper.initUuSubAppInstance();
//   await TestHelper.createUuAppWorkspace();
//   await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"1454545", "name":"Nika" }) 
// });

// afterAll(async () => {
//   await TestHelper.teardown();
// });

afterEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"1454545", "name":"Nika" }) 
});

describe("Test list/delete", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      name: "11111"  // requirement data for list/create
    };
    
    const list = await TestHelper.executePostCommand("list/create", dtoIn, session);
    const result = await TestHelper.executePostCommand("list/delete", {id: list.id}, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
  test("Test - TodoInstanceIsNotInProperState", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ state: `vfr` })}}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `${CMD}/TodoInstanceIsNotInProperState`,
      message: "The application is not in proper state.",
      paramMap: { awid: TestHelper.awid, expectedState: "active", currentState: "vfr" },
    };

    expect.assertions(3);

    try {
      const list = await TestHelper.executePostCommand("list/create", 
      { name: "name"}, session);
      await TestHelper.executePostCommand("list/delete", {
        id: list.id
      }, session);
    }catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);

      if (error.paramMap && expectedError.paramMap) {
        expect(error.paramMap).toEqual(expectedError.paramMap);
      }
    }
  });

  test("Test - TodoInstanceDoesNotExist", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ awid: `ddddd` })}}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `${CMD}/todoInstanceDoesNotExist`,
      message: "TodoInstance does not exist.",
      paramMap: { awid: TestHelper.awid},
    };

    expect.assertions(3);

    try {
      const list = await TestHelper.executePostCommand("list/create", 
      { name: "name"}, session);
      await TestHelper.executePostCommand("list/delete", {
        id: list.id
      }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);

      if (error.paramMap && expectedError.paramMap) {
        expect(error.paramMap).toEqual(expectedError.paramMap);
      }
    }
  });


});