import { FileType } from './upload.filetype';

export const FileMimeTypeMap: Record<FileType, string[]> = {
  [FileType.IMAGE]: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/tiff',
  ],
  [FileType.VIDEO]: ['video/mp4', 'video/webm', 'video/quicktime'],
  [FileType.DOCUMENT]: ['application/pdf', 'application/msword'],
  [FileType.PRESENTATION]: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
};
