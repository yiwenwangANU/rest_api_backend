import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    key: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
