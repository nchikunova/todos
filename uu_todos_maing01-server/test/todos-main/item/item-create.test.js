const { TestHelper } = require("uu_appg01_server-test");
const CMD = "item/create";

afterEach(async () => {
    await TestHelper.dropDatabase();
    await TestHelper.teardown();
})

beforeAll(async () => {
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"1454545", "name":"created" }) 
});

describe("Test item/create", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const list = await TestHelper.executePostCommand("list/create", { name: "list name" }, session);
    let result = await TestHelper.executePostCommand("item/create", { listId: list.id, text: "todo text" }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  })
});

