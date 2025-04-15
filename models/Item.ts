import mongoose, { Schema, Document } from "mongoose";

function isValidUrl(v: string) {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
}

const itemSchema = new Schema({
  item_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  creation: { type: Date, default: Date.now },
  description: { type: String, required: true },
  value: { type: Number, required: true },
  badge: { type: String, required: false },
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

interface IItem extends Document {
  item_id: string;
  title: string;
  creation: Date;
  description: string;
  value: number;
  badge?: string;
  link?: string;
  application: string;
  claimed: string[];
}

const Item = mongoose.model<IItem>("Item", itemSchema);

export default Item;