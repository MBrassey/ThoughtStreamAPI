const router = require("express").Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require("../../controllers/user-controller");

//get routes at api/users
router.route("/").get(getAllUsers).post(createUser);

//get routes at api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

//friend routes at api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").put(addFriend).delete(deleteFriend);

module.exports = router;
