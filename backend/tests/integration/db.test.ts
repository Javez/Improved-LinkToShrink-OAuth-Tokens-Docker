import Link from '../../src/db/models/model';
import db from '../../src/db/models/sequelizeDb';



describe('Database Connection and Operations', () => {
  afterAll(async () => {
    try {
      await db.closeConnection();
    } catch (error) {
      console.error('Error closing the test database connection:', error);
    }
  });

  it('should establish a database connection', async () => {
    let result = false;
    try {
      await db.openConnection();
      result = true;
    } catch {
      console.log('authenticate err');
    }
    expect(result).toBeTruthy();
  });

  it('should create the Links table', async () => {
    const result = await db.createTable();
    expect(result).toBeTruthy();
    expect(Link).toEqual(db.getInstance.models.Link);
  });
});
