const { User, Thought } = require("../models");

const userController = {
  // get all users
  async getAllUsers(req, res) {
    try {
      const results = await User.find({}).select("-__v").sort({ _id: -1 }); // display most recent first

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status.json(err);
    }
  },

  // get user by id
  async getUserById({ params }, res) {
    try {
      const results = await User.findById({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });

      if (!results) {
        res.status(404).json({ message: "No user with that id" });
        return;
      }

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // create user
  async createUser({ body }, res) {
    try {
      const results = await User.create(body);
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status.json(err);
    }
  },

  // update user by id
  async updateUser({ params, body }, res) {
    try {
      const results = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
      });

      if (!results) {
        res.status(404).json({ message: "No user found with that id" });
        return;
      }

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete user by id
  async deleteUser({ params }, res) {
    try {
      const results = await User.findOneAndDelete({ _id: params.id });

      if (!results) {
        res.status(404).json({ message: "No user found with that id" });
        return;
      } else {
        const _ = await Thought.deleteMany({ userId: params.id });
        res.json(results);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // add friend to user /api/users/:userId/friends/:friendId
  async addFriend({ params }, res) {
    try {
      let results = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
      );

      if (!results) {
        res.status(404).json({ message: "No user found with that id" });
        return;
      }

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // remove friend from user
  async deleteFriend({ params }, res) {
    try {
      let results = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );

      if (!results) {
        res.status(404).json({ message: "No user found with that id" });
        return;
      }

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
};

module.exports = userController;
