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
    const users = await usersCollection
      .find({ $or: [{ name: regex }, { email: regex }] })
      .toArray();
    const hospitals = await hospitalCollection.find({ name: regex }).toArray();
    const doctors = await doctorCollection.find({ name: regex }).toArray();
    await dbPool.disconnect();
    const all = {
      users,
      hospitals,
      doctors
    };
    jsonRes(res, 200, all);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { search } = req.params;
    const regex = new RegExp(search, 'i');
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const users = await usersCollection
      .find({ $or: [{ name: regex }, { email: regex }] })
      .toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, users);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const searchHospitals = async (req, res) => {
  try {
    const { search } = req.params;
    const regex = new RegExp(search, 'i');
    const db = await dbPool.connect();
    const hospitalCollection = db.collection(HOSPITALS);
    const hospitals = await hospitalCollection.find({ name: regex }).toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, hospitals);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const searchDoctors = async (req, res) => {
  try {
    const { search } = req.params;
    const regex = new RegExp(search, 'i');
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctors = await doctorCollection.find({ name: regex }).toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, doctors);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};
