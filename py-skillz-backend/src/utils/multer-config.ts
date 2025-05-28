import { extname } from 'node:path';
import { diskStorage } from 'multer';
import * as fs from 'node:fs';
import { FileType } from 'src/modules/upload/upload.filetype';

export const multerStorage = diskStorage({
  destination: (req, file, cb) => {
    const type = (req.body as { type?: FileType }).type;
    const folder =
      type === FileType.VIDEO
        ? 'videos'
        : type === FileType.DOCUMENT
          ? 'documents'
          : type === FileType.PRESENTATION
            ? 'presentations'
            : 'others';

    const uploadPath = `./uploads/${folder}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, `./uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
