import express from 'express';
import { isAuthorized } from '../config/utils';

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
  deleteUser
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
  app.post('/register', register),
  app.post('/user', isAuthorized, insertUser),
  app.put('/user/:_id', isAuthorized, updateUser),
  app.delete('/user/:_id', isAuthorized, deleteUser),
  // HOSPITALS
  app.get('/hospitals', getHospitals),
  app.post('/hospital', isAuthorized, insertHospital),
  app.get('/hospital/:_id', getHospital),
  app.put('/hospital/:_id', isAuthorized, updateHospital),
  app.delete('/hospital/:_id', isAuthorized, deleteHospital),
  // DOCTORS
  app.get('/doctors', getDoctors),
  app.post('/doctor', isAuthorized, insertDoctor),
  app.get('/doctor/:_id', getDoctor),
  app.put('/doctor/:_id', isAuthorized, updateDoctor),
  app.delete('/doctor/:_id', isAuthorized, deleteDoctor)
];

export default handlers;
