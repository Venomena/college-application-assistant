import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'testScores', maxCount: 1 }
]);

export default uploadMiddleware;
