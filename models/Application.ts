import mongoose, { Schema, Document } from "mongoose";

function isValidUrl(v: string) {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
}

const applicationSchema = new Schema({
  client_id: { type: String, required: true, unique: true },
  client_secret: { type: String, required: false },
  title: { type: String, required: true },
  creation: { type: Date, default: Date.now },
  permissions: { type: [String], default: [], required: true },
  stargazers: [{ type: String }],
  description: { type: String, required: true },
  type: { type: String, enum: [
    "outil", "jeu", "forum", "données", "plateforme"
  ], required: true },
  tags: { type: [String], enum: [
    "participatif", "open-source", "accessible", "éducatif",
    "francophone", "anglophone",
    "indépendant", "académique", "start-up", "entreprise",
    "partenaire"
  ], default: [] },
  authors: { type: [String], default: [] },
  uris: { type: [String], default: [], required: true },
  link: {
    type: String,
    required: false,
    validate: {
      validator: isValidUrl,
      message: (props:{ value: string }) => `${props.value} is not a valid URL!`,
    },
  },
  verified: { type: Boolean, default: false }
});

applicationSchema.methods.publicFields = function() {
  return this.model('Client').findOne({ _id: this._id }).select('-client_secret');
};

interface IApplication extends Document {
  client_id: string;
  client_secret: string;
  title: string;
  creation: Date;
  permissions: string[];
  stargazers: string[];
  description: string;
  type: string;
  tags: string[];
  authors: string[];
  uris: string[];
  link: string;
}

const Application = mongoose.model<IApplication>("Client", applicationSchema);

export default Application;