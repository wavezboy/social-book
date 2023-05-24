import { Schema, InferSchemaType, model } from "mongoose";

const myUserSchema = new Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, select: false, unique: true },
  password: { type: String, require: true, select: false, unique: true },
});

type User2 = InferSchemaType<typeof myUserSchema>;

export default model<User2>("User2", myUserSchema);
