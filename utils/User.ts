import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: false },
  avatar: { type: String, required: false },
  account: { type: Number, default: 100 },
  connections: {
    orcid: { type: String, required: false },
    bluesky: { type: String, required: false },
    github: { type: String, required: false },
    hal: { type: String, required: false },
    huggingface: { type: String, required: false }
  }
});

interface IUser extends Document {
  username: string;
  password: string;
  fullname?: string;
  avatar?: string;
  account: number;
  connections: {
    orcid?: string;
    bluesky?: string;
    github?: string;
    hal?: string;
    huggingface?: string;
  };
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;