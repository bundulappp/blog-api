import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};
//todo authGuard
//https://www.youtube.com/watch?v=f-URVd2OKYc&t=388s
@Controller('photo')
export class PhotoController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('photo', storage))
  uploadSingle(@UploadedFile() file) {
    return of({ imagePath: file.filename });
  }

  // @Post('uploads')
  // @UseInterceptors(FilesInterceptor('photos[]', 10, { dest: './uploads' }))
  // uploadMultiple(@UploadedFiles() files) {
  //   console.log(files);
  // }
}
