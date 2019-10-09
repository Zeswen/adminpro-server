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
    
    jsonRes(res, 200, doctorCreated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, img, user, hospital } = req.body;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const treated_id = dbPool.objectId(_id)
    const doctorUpdated = await doctorCollection.findOneAndUpdate(
      { _id: dbPool.objectId(_id) },
      {
        $set: {
          name,
          img,
          user: dbPool.objectId(user),
          hospital: dbPool.objectId(hospital)
        }
      },
      { returnOriginal: false }
    );
    
    jsonRes(res, 200, doctorUpdated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
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
    
    jsonRes(res, 200, doctorDeleted);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const getDoctor = async (req, res) => {
  try {
    const { _id } = req.params;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctors = await doctorCollection
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
      const doctor = doctors[0];
    
    jsonRes(res, 200, doctor);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err.message);
  }
};

export const getDoctors = async (req, res) => {
  try {
    const from = Number(req.query.from) || 0;
    const db = await dbPool.connect();
    const doctorCollection = db.collection(DOCTORS);
    const doctors = await doctorCollection
      .aggregate([
        {
          $skip: from
        },
        {
          $limit: 5
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
    const data = {
      doctors,
      totalDoctors: await doctorCollection.countDocuments()
    };
    
    jsonRes(res, 200, data);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err.message);
  }
};
