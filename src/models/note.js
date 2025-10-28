import { Schema, model } from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: false, trim: true, default: '' },
    tag: {
      type: String,
      required: false,
      enum: TAGS,
      default: 'Todo',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

noteSchema.index({ title: 'text', content: 'text' });
noteSchema.index({ userId: 1, tag: 1 });

const Note = model("Note", noteSchema);

export default Note;
