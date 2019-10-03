import dbPool from '../config/DbPool';
import { jsonRes } from '../config/utils';
import { COLLECTIONS } from '../config/constants';

const { DOCTORS } = COLLECTIONS;


export const insertDoctor = async (req, res) => {
  try {
    const { name, img, user, hospital } = req.body;
    if (!name || !user || !hospital) {
      throw new Error('Name, user and hospital are required.');
    }
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctorCreated = await doctorCollection.insertOne({
      name,
      img,
      user: dbPool.objectId(user),
      hospital: dbPool.objectId(hospital)
    });
    await dbPool.disconnect();
    jsonRes(res, 200, doctorCreated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, img, user, hospital } = req.body;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctorUpdated = await doctorCollection.updateOne(
      { _id: dbPool.objectId(_id) },
      {
        name,
        img,
        user: dbPool.objectId(user),
        hospital: dbPool.objectId(hospital)
      }
    );
    await dbPool.disconnect();
    jsonRes(res, 200, doctorUpdated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { _id } = req.params;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctorDeleted = await doctorCollection.deleteOne({
      _id: dbPool.objectId(_id)
    });
    await dbPool.disconnect();
    jsonRes(res, 200, doctorDeleted);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const getDoctor = async (req, res) => {
  try {
    const { _id } = req.params;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctor = await doctorCollection
      .aggregate([
        {
          $match: {
            _id: dbPool.objectId(_id)
          }
        },
        {
          $limit: 1
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $lookup: {
            from: 'hospitals',
            localField: 'hospital',
            foreignField: '_id',
            as: 'hospital'
          }
        },
        {
          $unwind: '$hospital'
        },
        {
          $project: {
            'user.password': 0,
            'hospital.user': 0
          }
        }
      ])
      .toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, doctor[0]);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};

export const getDoctors = async (_, res) => {
  try {
    const from = Number(req.query.from) || 0;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctors = await doctorCollection.find({}).skip(from).limit(5).toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, doctors);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};