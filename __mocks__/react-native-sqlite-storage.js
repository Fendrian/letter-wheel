const dbMock = { transaction: jest.fn() };
const sqliteStorage = {
  openDatabase: jest.fn().mockReturnValue(dbMock),
};

export default sqliteStorage;
