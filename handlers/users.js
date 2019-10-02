import bcrypt from 'bcrypt';
import dbPool from '../config/DbPool';
import { jsonRes } from '../config/constants';

const USERS = 'users';
const saltRounds = 10;

export const insertUser = async (req, res) => {
  try {
    const { name, email, password, img, role } = req.body;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const customerCreated = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      img,
      role
    });
    jsonRes(res, 200, customerCreated);
    await dbPool.disconnect();
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};

export const queryUsers = async (_, res) => {
  try {
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const users = await usersCollection.find({}).toArray();
    jsonRes(res, 200, users);
    await dbPool.disconnect();
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};
