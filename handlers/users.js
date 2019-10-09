import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbPool from '../config/DbPool';
import { jsonRes } from '../config/utils';
import { COLLECTIONS } from '../config/constants';

const { SECRET_KEY, CLIENT_ID } = process.env;
const { USERS } = COLLECTIONS;

const client = new OAuth2Client(CLIENT_ID);

const verify = async token => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.img,
    google: true
  };
};

const saltRounds = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const _id = dbPool.objectId();
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userCreated = await usersCollection.insertOne({
      _id,
      name,
      email,
      password: hashedPassword,
      google: false,
      img: null,
      role: 'user'
    });

    jsonRes(res, 200, userCreated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const userFound = await usersCollection.findOne({ email });
    if (!userFound) throw new Error('User was not found.');
    if (userFound.google) throw new Error('Use google authentication instead.');
    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (matchPassword) {
      const token = jwt.sign({ user: userFound }, SECRET_KEY, {
        expiresIn: 14400
      });
      delete userFound['password'];
      userFound['token'] = token;
      userFound['menu'] = getMenu(userFound.role);
      jsonRes(res, 200, userFound);
    } else {
      jsonRes(res, 401, null, "Password doesn't match.");
    }
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const googleUser = await verify(token);
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const userFound = await usersCollection.findOne({
      email: googleUser.email
    });
    if (!userFound) {
      const newUser = {
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        role: 'user',
        password: '123'
      };
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      await usersCollection.insertOne(newUser);
    } else {
      if (!userFound.google)
        throw new Error('Use normal authentication instead.');
      const token = jwt.sign({ user: userFound }, SECRET_KEY, {
        expiresIn: 14400
      });
      userFound['token'] = token;
      userFound['menu'] = getMenu(userFound.role);
      jsonRes(res, 200, userFound);
    }
  } catch (err) {
    console.error(err);
    jsonRes(res, 403, null, err.message);
  }
};

export const insertUser = async (req, res) => {
  try {
    const { name, email, password, img, role = 'user' } = req.body;
    if (!name || !email || !password || !role) {
      throw new Error('Name, email, password and role are required.');
    }
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userCreated = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      google: false,
      img,
      role
    });

    jsonRes(res, 200, userCreated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, email, img, role } = req.body;
    let { password } = req.body;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    if (password) {
      password = await bcrypt.hash(password, saltRounds);
    }
    const userUpdated = await usersCollection.findOneAndUpdate(
      { _id: dbPool.objectId(_id) },
      {
        $set: {
          name,
          email,
          password,
          img,
          role
        }
      },
      { returnOriginal: false }
    );

    jsonRes(res, 200, userUpdated);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const userDeleted = await usersCollection.deleteOne({
      _id: dbPool.objectId(_id)
    });

    jsonRes(res, 200, userDeleted);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const from = Number(req.query.from) || 0;
    const db = await dbPool.connect();
    const usersCollection = db.collection(USERS);
    const users = await usersCollection
      .find({})
      .project({ password: 0 })
      .skip(from)
      .limit(5)
      .toArray();
    const data = {
      users,
      totalUsers: await usersCollection.countDocuments()
    };

    jsonRes(res, 200, data);
  } catch (err) {
    console.error(err);
    jsonRes(res, 500, null, err.message);
  }
};

const getMenu = role => {
  const menu = [
    {
      title: 'Main',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Progress Bar', url: '/progress' },
        { title: 'Charts', url: '/charts1' },
        { title: 'Promises', url: '/promises' },
        { title: 'RxJs', url: '/rxjs' }
      ]
    },
    {
      title: 'Admin',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        { title: 'Hospitals', url: '/hospitals' },
        { title: 'Doctors', url: '/doctors' }
      ]
    }
  ];

  if (role === 'admin') {
    menu[1].submenu.unshift({ title: 'Users', url: '/users' });
  }
  return menu;
};
