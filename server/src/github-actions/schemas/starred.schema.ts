import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

export type StarredDocument = Starred & Document;

@Schema({ strict: false })
export class Starred {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop()
  repo_name: string;

  @Prop()
  repo_owner: string;

  @Prop()
  repo_url: string;

  @Prop()
  repo_git_id: string;

  @Prop()
  language: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const StarredSchema = SchemaFactory.createForClass(Starred);
