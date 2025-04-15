import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    match: [
      /^[a-z0-9._-]+$/,
      "Username can only contain letters, numbers and any of .-_"], 
    minlength: [3, "Username must be at least 3 characters long"], 
    maxlength: [25, "Username must not exceed 25 characters"]
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [8, "Password must be at least 8 characters long"] 
  },
  fullname: { 
    type: String,
    required: true,
    maxlength: [40, "Fullname must be less than 40 characters long"] 
  },
  description: { 
    type: String, 
    default: "", 
    maxlength: [200, "Description must be less than 200 characters long"] 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] 
  },
  pronouns: { type: String, enum: ["il", "elle", "iel"], required: true },
  avatar: {
    type: String, 
    default: "", 
    match: [
      /^(?:|https?:\/\/(?:[\w\-]+\.)+[a-z]{2,6}(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)*\.(?:png|jpe?g))$/i, 
      "Avatar must be empty or a valid URL pointing to a .png or .jpeg image"
    ]
  },
  balance: { type: Number, default: 0 },
  following: [{ type: String }],
  followers: [{ type: String }],
  badges: [{ type: String }],
  connections: [
    {
      platform: {
        type: String,
        enum: [
          "orcid", 
          "bluesky", 
          "github", 
          "gitlab", 
          "hal", 
          "huggingface", 
          "x", 
          "instagram", 
          "linkedin", 
          "reddit", 
          "discord", 
          "wechat", 
          "threads", 
          "mastodon", 
          "goodreads"
        ],
        required: true,
      },
      username: { 
        type: String, 
        required: true 
      }
    }
  ],
  creation: { type: Date, default: Date.now },
  starred: [{ type: String }],
  applications: { type: [String], default: [] }
});

userSchema.methods.publicFields = function() {
  return this.model('User').findOne({ _id: this._id }).select('-password -balance -email');
};

interface IUser extends Document {
  username: string;
  password: string;
  fullname: string;
  avatar: string;
  description: string;
  pronouns: "il" | "elle" | "iel";
  balance: number;
  following: string[];
  followers: string[];
  badges: string[];
  creation: Date;
  starred: string[];
  connections: Array<{
    platform: string;
    username: string;
  }>;
  applications: string[];
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;