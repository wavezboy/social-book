import { Schema, model, InferSchemaType } from "mongoose";

const bookSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  author: {
    type: String,
  },
  publisher: {
    type: String,
  },
  publish_year: {
    type: Number,
  },
  genre: {
    type: String,
  },
});

type Book = InferSchemaType<typeof bookSchema>;

export default model<Book>("Book", bookSchema);
