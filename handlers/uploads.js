import fs from 'fs';
import dbPool from '../config/DbPool';
import { jsonRes } from '../config/utils';
import { UPLOAD_PATH, FILE_EXTENSIONS } from '../config/constants';

export const uploadImage = async (req, res) => {
  try {
    const { collection, _id } = req.params;
    const { img } = req.files;
    if (img) {
      const extension = img.name.split('.').slice(-1)[0];
      if (FILE_EXTENSIONS.indexOf(extension) > -1) {
        const fileName = `${_id}-${new Date().getMilliseconds()}.${extension}`;
        const filePath = `${UPLOAD_PATH}/${collection}/${fileName}`;
        await img.mv(filePath);
        return uploadImageByCollection(collection, _id, fileName, res);
      } else {
        throw new Error('Image extension is not valid.');
      }
    }
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};

const uploadImageByCollection = async (collection, _id, fileName, res) => {
  try {
    const db = await dbPool.connect();
    const documentsCollection = db.collection(collection);
    const document = await documentsCollection.findOne({
      _id: dbPool.objectId(_id)
    });
    const oldPath = `${UPLOAD_PATH}/${collection}/${document.img}`;
    if (fs.existsSync(oldPath)) {
      await new Promise((resolve, reject) => {
        fs.unlink(oldPath, err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    }
    const updatedDocument = await documentsCollection.findOneAndUpdate(
      { _id: dbPool.objectId(_id) },
      { $set: { img: fileName } },
      { returnOriginal: false }
    );
    await dbPool.disconnect();
    jsonRes(res, 200, updatedDocument);
  } catch (err) {
    console.error(err);
    jsonRes(res, 400, null, err);
  }
};
