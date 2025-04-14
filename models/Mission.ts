import mongoose, { Schema, Document } from "mongoose";

function isValidUrl(v: string) {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
}

const missionSchema = new Schema({
  mission_id: String,
  reward: { type: Number, required: true },
  title: { type: String, required: true },
  creation: { type: Date, default: Date.now },
  description: { type: String, required: true },
  link: {
    type: String,
    required: false,
    validate: {
      validator: isValidUrl,
      message: (props:{ value: string }) => `${props.value} is not a valid URL!`,
    },
  },
  application: { type: String, required: true },
  claimed: { type: [String], default: [] }
});

interface IMission extends Document {
  mission_id: string;
  reward: number;
  title: string;
  creation: Date;
  description: string;
  link: string;
  application: string;
  claimed: string[];
}

const Mission = mongoose.model<IMission>("Mission", missionSchema);

export default Mission;