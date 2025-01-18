import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: false },
  description: { type: String, default: "This user has no description" },
  email: { type: String, required: true, unique: true },
  pronouns: { type: String, enum: ["il", "elle", "iel"], required: true },
  avatar: { type: String, default: "" },
  account: { type: Number, default: 0 },
  following: [{ type: String }],
  followers: [{ type: String }],
  badges: [{ type: String }],
  connections: {
    orcid: { type: String, required: false },
    bluesky: { type: String, required: false },
    github: { type: String, required: false },
    gitlab: { type: String, required: false },
    hal: { type: String, required: false },
    huggingface: { type: String, required: false },
    x: { type: String, required: false },
    instagram: { type: String, required: false },
    linkedin: { type: String, required: false },
    reddit: { type: String, required: false },
    discord: { type: String, required: false },
    wechat: { type: String, required: false },
    threads: { type: String, required: false },
    mastodon: { type: String, required: false },
    goodreads: { type: String, required: false },
  },
  creation: { type: Date, default: Date.now },
  starred: [{ type: String }],
  applications: { type: [String], default: [] }
});

userSchema.methods.publicFields = function() {
  return this.model('User').findOne({ _id: this._id }).select('-password -account -email');
};

interface IUser extends Document {
  username: string;
  password: string;
  fullname?: string;
  avatar?: string;
  description: string;
  pronouns: "il" | "elle" | "iel";
  account: number;
  following: string[];
  followers: string[];
  badges: string[];
  creation: Date;
  starred: string[];
  connections: {
    orcid?: string;
    bluesky?: string;
    github?: string;
    hal?: string;
    huggingface?: string;
    x?: string;
    instagram?: string;
    linkedin?: string;
    reddit?: string;
    discord?: string;
    wechat?: string;
    threads?: string;
    mastodon?: string;
    goodreads?: string;
  };
  applications: string[];
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;