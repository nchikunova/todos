const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/get";
const CMD = "list/get";

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"1454545", "name":"Nika" }) 
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("Test list/get", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      name: "name"
    };
    
    const list = await TestHelper.executePostCommand("list/create", dtoIn, session);
    const result = await TestHelper.executeGetCommand("list/get", {id: list.id}, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});