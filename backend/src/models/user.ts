import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,

    select: false,

  },
  socketId: {
    type: String,
  }
});

export default mongoose.model("User", userSchema);
