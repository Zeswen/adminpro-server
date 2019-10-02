import dbPool from '../config/DbPool';
import { jsonRes } from '../config/constants';

export const insertCustomers = async (req, res) => {
  try {
    const { name = 'Company Inc', address = 'Highway 39' } = req.query;
    const db = await dbPool.connect();
    const customersCollection = db.collection('customers');
    const customerCreated = await customersCollection.insertOne({
      name,
      address
    });
    jsonRes(res, 200, customerCreated);
    await dbPool.disconnect();
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};

export const queryCustomers = async (_, res) => {
  try {
    const db = await dbPool.connect();
    const customersCollection = db.collection('customers');
    const customers = await customersCollection.find({}).toArray();
    jsonRes(res, 200, customers);
    await dbPool.disconnect();
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};
