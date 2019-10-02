import bcrypt from 'bcrypt';
import dbPool from '../config/DbPool';
import { jsonRes } from '../config/constants';

const USERS = 'users';
const saltRounds = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, img } = req.body;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userCreated = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      img,
      role: 'user'
    });
    await dbPool.disconnect();
    jsonRes(res, 200, userCreated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const userFound = await usersCollection.findOne({ email });
    const matchPassword = await bcrypt.compare(password, userFound.password);
    await dbPool.disconnect();
    if (matchPassword) {
      jsonRes(res, 200, userFound);
    } else {
      jsonRes(res, 401, null, "Password doesn't match.");
    }
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};

export const insertUser = async (req, res) => {
  try {
    const { name, email, password, img, role } = req.body;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userCreated = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      img,
      role
    });
    await dbPool.disconnect();
    jsonRes(res, 200, userCreated);
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
    await dbPool.disconnect();
    jsonRes(res, 200, users);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err);
  }
};
