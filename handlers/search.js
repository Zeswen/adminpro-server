import dbPool from '../config/DbPool';
import { jsonRes } from '../config/utils';

import { COLLECTIONS } from '../config/constants';

const { USERS, HOSPITALS, DOCTORS } = COLLECTIONS;

export const searchAll = async (req, res) => {
  try {
    const { search } = req.params;
    const regex = new RegExp(search, 'i');
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const hospitalCollection = db.collection(HOSPITALS);
    const doctorCollection = db.collection(DOCTORS);
    const users = await usersCollection.find({ name: regex }).toArray();
    const hospitals = await hospitalCollection.find({ name: regex }).toArray();
    const doctors = await doctorCollection.find({ name: regex }).toArray();

    const all = {
      users,
      hospitals,
      doctors
    };
    jsonRes(res, 200, all);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const searchCollection = async (req, res) => {
  try {
    const { collection, search } = req.params;
    const regex = new RegExp(search, 'i');
    const db = await dbPool.connect();
    const dbCollection = db.collection(collection);
    const documents = await dbCollection
      .find({ $or: [{ name: regex }, { email: regex }] })
      .project({ password: 0 })
      .toArray();
    const capitalizedCollection =
      collection.charAt(0).toUpperCase() + collection.slice(1);
    const data = {
      [collection]: documents,
      [`total${capitalizedCollection}`]: documents.length
    };

    jsonRes(res, 200, data);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};
