const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/delete";

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"1454545", "name":"Nika" }) 
});

afterAll(async () => {
  await TestHelper.teardown();
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

});