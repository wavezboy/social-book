import app from "./app";
import env from "./utill/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose
  .connect(env.MONGO_FILE_STRING)
  .then(() => {
    console.log("mongoose connected");

    app.listen(port, () => {
      console.log("server running:" + port);
    });
  })
  .catch(console.error);
