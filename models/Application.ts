import mongoose, { Schema, Document } from "mongoose";

const applicationSchema = new Schema({
  client_id: { type: String, required: true, unique: true },
  permissions: [{ type: String, required: true }]
});

interface IApplication extends Document {
  client_id: string;
  permissions: string[];
}

const Application = mongoose.model<IApplication>("Client", applicationSchema);

export default Application;