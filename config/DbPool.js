import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

import { CONSOLE_COLORS } from './constants';

const { MONGO_URL, MONGO_NAME } = process.env;

class DbPool {
  constructor(url, name) {
    this.settings = {
      url,
      name
    };
    this.client;
  }

  objectId(str) {
    return ObjectId(str);
  }

  async connect() {
    try {
      this.client = await MongoClient.connect(this.settings.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`${CONSOLE_COLORS.bright}Connected to MongoDB`);
      return this.client.db(this.settings.name);
    } catch (err) {
      console.error(err);
    }
  }

  async disconnect() {
    try {
      console.log(
        `${CONSOLE_COLORS.bright}Disconnected from mongoDB.${CONSOLE_COLORS.reset}`
      );
      return this.client.close();
    } catch (err) {
      console.error(err);
    }
  }
}

export default new DbPool(MONGO_URL, MONGO_NAME);
