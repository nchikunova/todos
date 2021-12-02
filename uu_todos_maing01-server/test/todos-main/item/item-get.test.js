const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/get";

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"1454545", "name":"Nika" }) 
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test item/get", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
  

    const list = await TestHelper.executePostCommand("list/create", { name:"list name" }, session);
    const item = await TestHelper.executePostCommand("item/create", {listId: list.id, text: "todo text"}, session);
    const result = await TestHelper.executeGetCommand("item/get", {id: item.id}, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

});