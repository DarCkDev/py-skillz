import { FileType } from './upload.filetype';

export const FileMimeTypeMap: Record<FileType, string[]> = {
  //[FileType.IMAGE]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  [FileType.VIDEO]: ['video/mp4', 'video/webm'],
  [FileType.DOCUMENT]: ['application/pdf', 'application/msword'],
  [FileType.PRESENTATION]: ['application/vnd.ms-powerpoint'],
};
