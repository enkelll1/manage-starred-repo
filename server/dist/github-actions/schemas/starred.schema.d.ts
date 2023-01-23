import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
export type StarredDocument = Starred & Document;
export declare class Starred {
    user_id: User;
    repo_name: string;
    repo_owner: string;
    repo_url: string;
    repo_git_id: string;
    language: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StarredSchema: mongoose.Schema<Starred, mongoose.Model<Starred, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Starred>;
