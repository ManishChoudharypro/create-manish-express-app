import multer from 'multer';
import path from 'path';
import { exists, mkdir } from 'fs';
const { MAX_FILE_SIZE_IN_MB } = process.env,
  maxSize = Number(MAX_FILE_SIZE_IN_MB) * 1024 * 1024,
  multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      var imageDir = `${req.baseUrl.split('/')[2]}_${file.fieldname}`;
      const dir = path.join(__dirname, `../../public/uploads/${imageDir}`);
      exists(dir, exist => {
        if (!exist) {
          return mkdir(dir, { recursive: true }, error => callback(error, dir));
        }
        callback(null, dir);
      });
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${file.fieldname}_${Date.now()}.${ext}`);
    },
  }),
  FileUpload = multer({
    storage: multerStorage,
    limits: { fileSize: maxSize },
    fileFilter(req: Express.Request, file: { originalname: string }, cb: any) {
      if (!file.originalname.match(/\.(png|jpg|jpeg|svg|pdf)$/)) {
        return cb('Invalid format');
      }
      cb(undefined, true);
    },
  });
export default FileUpload;
