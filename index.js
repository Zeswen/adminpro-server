import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import handlers from './handlers';

import { consoleColors } from './config/constants';

const app = express();

app.use(cors());
app.use(handlers);

app.listen(process.env.PORT, () =>
  console.log(
    `${consoleColors.bright}HospitalDB app listening on port ${consoleColors.cyan}${process.env.PORT}${consoleColors.reset}`
  )
);
