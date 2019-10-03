import dbPool from '../config/DbPool';
import { jsonRes } from '../config/utils';
import { COLLECTIONS } from '../config/constants';


const { HOSPITALS } = COLLECTIONS;


export const insertHospital = async (req, res) => {
  try {
    const { name, img, user } = req.body;
    if (!name || !user) {
      throw new Error('Name and user are required.');
    }
    const db = await dbPool.connect();
    const hospitalCollection = db.collection(HOSPITALS);
    const hospitalCreated = await hospitalCollection.insertOne({
      name,
      img,
      user: dbPool.objectId(user)
    });
    await dbPool.disconnect();
    jsonRes(res, 200, hospitalCreated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const updateHospital = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, img, user } = req.body;
    const db = await dbPool.connect();
    const hospitalCollection = db.collection(HOSPITALS);
    const hospitalUpdated = await hospitalCollection.updateOne(
      { _id: dbPool.objectId(_id) },
      {
        name,
        img,
        user: dbPool.objectId(user)
      }
    );
    await dbPool.disconnect();
    jsonRes(res, 200, hospitalUpdated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const { _id } = req.params;
    const db = await dbPool.connect();
    const hospitalCollection = db.collection(HOSPITALS);
    const hospitalDeleted = await hospitalCollection.deleteOne({
      _id: dbPool.objectId(_id)
    });
    await dbPool.disconnect();
    jsonRes(res, 200, hospitalDeleted);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

export const getHospital = async (req, res) => {
  try {
    const { _id } = req.params;
    const db = await dbPool.connect();
    const hospitalCollection = db.collection(HOSPITALS);
    const hospital = await hospitalCollection
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
          $project: {
            'user.password': 0
          }
        }
      ])
      .toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, hospital[0]);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};

export const getHospitals = async (_, res) => {
  try {
    const from = Number(req.query.from) || 0;
    const db = await dbPool.connect();
    const hospitalCollection = db.collection(HOSPITALS);
    const hospitals = await hospitalCollection.find({}).skip(from).limit(5).toArray();
    await dbPool.disconnect();
    jsonRes(res, 200, hospitals);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};
