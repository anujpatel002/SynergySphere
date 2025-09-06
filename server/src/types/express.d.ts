import { Types } from 'mongoose';

// Merge our custom definition with the original Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: Types.ObjectId;
      };
    }
  }
}

// Make this file a module
export {};