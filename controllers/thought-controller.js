const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const results = await Thought.find().select("-__v").sort({ _id: -1 });

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // get thought by id: api/thoughts/:id
  async getThoughtById({ params }, res) {
    try {
      const results = await Thought.findOne({ _id: params.id })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .sort({ _id: -1 })
        .select("-__v");

      if (!results) {
        res.status(404).json({ message: "No thought found with that id" });
        return;
      }
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // create thought within a user
  async createThought({ body }, res) {
    try {
      // create new thought
      const newComment = await Thought.create(body);
      // push thought ID to user thought array
      const results = await User.findByIdAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: newComment._id } },
        { new: true }
      );

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // update thought by id: api/thoughts/:id
  async updateThought({ params, body }, res) {
    try {
      const results = await Thought.findByIdAndUpdate(
        { _id: params.id },
        body,
        { new: true }
      );

      if (!results) {
        res.status(404).json({ message: "No thought found with that id" });
        return;
      }
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete thought: api/thoughts/:id
  async deleteThought({ params }, res) {
    try {
      // remove thought from user
      const userInfo = await Thought.findOne({ _id: params.id });
      // delete thought
      if (!userInfo) {
        res.status(404).json({ message: "No thought found with that id" });
        return;
      }

      const results = await Thought.findOneAndDelete({ _id: params.id });

      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // add reaction to a thought: api/thoughts/:thoughtId/reactions
  async createReaction({ params, body }, res) {
    try {
      const results = await Thought.findByIdAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true }
      );

      if (!results) {
        res.status(404).json({ message: "No thought found with that id" });
        return;
      }
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete reaction to thought: api/thoughts/:thoughtId/reactions/:reactionId
  async deleteReaction({ params }, res) {
    try {
      const results = await Thought.findByIdAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );

      if (!results) {
        res.status(404).json({ message: "No thought found with that id" });
        return;
      }
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
