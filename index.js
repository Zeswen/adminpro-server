import 'dotenv/config';
import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import handlers from './handlers';

import { CONSOLE_COLORS } from './config/constants';

const app = express();

app.use(cors());
app.use(express.static(`${__dirname}/`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(handlers);

app.listen(process.env.PORT, () =>
  console.log(
    `${CONSOLE_COLORS.bright}HospitalDB app listening on port ${CONSOLE_COLORS.cyan}${process.env.PORT}${CONSOLE_COLORS.reset}`
  )
);
