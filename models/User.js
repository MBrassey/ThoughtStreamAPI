const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: "Username is required",
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Must use a valid email address"],
  },
  thoughts: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Thought",
    },
  ],
});

// create the User model using the UserSchema
const User = model("User", UserSchema);

// export the User model
module.exports = User;
