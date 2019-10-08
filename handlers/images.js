import fs from 'fs';
import path from 'path';

export const getImage = (req, res) => {
  const { collection, img } = req.params;
  const imagePath = path.resolve(__dirname, `../uploads/${collection}/${img}`);
  const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.sendFile(noImagePath);
  }
}