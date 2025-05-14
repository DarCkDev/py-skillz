import { PayloadDto } from 'src/modules/auth/dto/payload.dto';

declare global {
  namespace Express {
    export interface Request {
      user?: PayloadDto;
    }
  }
}
