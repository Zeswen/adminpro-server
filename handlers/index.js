import express from 'express';
import { isAuthorized, isAdmin, isAdminOrOwnUser } from '../middlewares';

import { uploadImage } from './uploads';

import { getImage } from './images';

import { searchAll, searchCollection } from './search';

import {
  getUsers,
  register,
  googleLogin,
  login,
  insertUser,
  updateUser,
  deleteUser,
  renewToken
} from './users';

import {
  getHospitals,
  getHospital,
  insertHospital,
  updateHospital,
  deleteHospital
} from './hospitals';

import {
  getDoctors,
  getDoctor,
  insertDoctor,
  updateDoctor,
  deleteDoctor
} from './doctors';

const app = express();

const handlers = [
  // UPLOADS
  app.put('/upload/:collection/:_id', uploadImage),
  // IMAGES
  app.get('/img/:collection/:img', getImage),
  // SEARCH
  app.get('/search/all/:search', searchAll),
  app.get('/search/:collection/:search', searchCollection),
  // USERS
  app.get('/users', getUsers),
  app.post('/login', login),
  app.post('/login/google', googleLogin),
  app.get('/login/renewToken', isAuthorized, renewToken),
  app.post('/register', register),
  app.post('/user', isAuthorized, insertUser),
  app.put('/user/:_id', isAuthorized, isAdminOrOwnUser, updateUser),
  app.delete('/user/:_id', isAuthorized, isAdmin, deleteUser),
  // HOSPITALS
  app.get('/hospitals', getHospitals),
  app.post('/hospital', isAuthorized, insertHospital),
  app.get('/hospital/:_id', getHospital),
  app.put('/hospital/:_id', isAuthorized, isAdminOrOwnUser, updateHospital),
  app.delete('/hospital/:_id', isAuthorized, isAdmin, deleteHospital),
  // DOCTORS
  app.get('/doctors', getDoctors),
  app.post('/doctor', isAuthorized, insertDoctor),
  app.get('/doctor/:_id', getDoctor),
  app.put('/doctor/:_id', isAuthorized, isAdminOrOwnUser, updateDoctor),
  app.delete('/doctor/:_id', isAuthorized, isAdmin, deleteDoctor)
];

export default handlers;
