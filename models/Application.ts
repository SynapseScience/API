import mongoose, { Schema, Document } from "mongoose";

const applicationSchema = new Schema({
  client_id: { type: String, required: true, unique: true },
  client_secret: { type: String, required: false },
  title: { type: String, required: true },
  creation: { type: Date, default: Date.now },
  permissions: [{ type: String }],
  stargazers: [{ type: String }],
  description: { type: String, default: "This app has no description" },
  link: {
    type: String,
    required: false,
    validate: {
      validator: function (v: string) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  }
});

interface IApplication extends Document {
  client_id: string;
  client_secret: string;
  title: string;
  creation: Date;
  permissions: string[];
  stargazers: string[];
  description: string;
  link: string;
}

const Application = mongoose.model<IApplication>("Client", applicationSchema);

export default Application;