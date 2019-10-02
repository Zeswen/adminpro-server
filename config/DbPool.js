import 'dotenv/config';
import { MongoClient } from 'mongodb';

import { consoleColors } from './constants';

const { MONGO_URL, MONGO_NAME } = process.env;

class DbPool {
  constructor(url, name) {
    this.settings = {
      url,
      name
    };
    this.client;
  }

  async connect() {
    try {
      this.client = await MongoClient.connect(this.settings.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(
        `${consoleColors.bright}Connected to MongoDB with the following settings:${consoleColors.reset}`,
        this.settings
      );
      return this.client.db(this.settings.name);
    } catch (err) {
      throw new Error(err);
    }
  }

  async disconnect() {
    try {
      console.log(
        `${consoleColors.bright}Disconnected from mongoDB.${consoleColors.reset}`
      );
      return this.client.close();
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new DbPool(MONGO_URL, MONGO_NAME);
