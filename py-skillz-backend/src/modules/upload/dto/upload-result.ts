import { Source } from '../entities/source.entity';

export interface UploadResult {
  id: string;
  url: string;
  source: Source;
  type: string;
  name: string;
}
