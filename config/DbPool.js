import 'dotenv/config';
import { MongoClient } from 'mongodb';

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
        '\x1b[1mConnected to MongoDB with the following settings:\x1b[0m',
        this.settings
      );
      return this.client.db(this.settings.name);
    } catch (err) {
      throw new Error(err);
    }
  }

  async disconnect() {
    try {
      console.log('\x1b[1mSuccessfully disconnected from mongoDB.\x1b[0m');
      return this.client.close();
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new DbPool(MONGO_URL, MONGO_NAME);
