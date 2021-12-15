const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getUserByIdUser,
  editUser,
  deleteUser,
} = require("../controllers/user");
const {
  postLiterature,
  getLiterature,
  getLiteraturebyId,
  getLiteraturebyCreated,
  getLiteraturebyIdUser,
  deleteLiterature,
  getLiteratureThatApprove,
  editLiterature,
} = require("../controllers/literature");
const {
  addBookmark,
  getBookmark,
  getBookmarks,
} = require("../controllers/bookmark");
const { checkAuth } = require("../controllers/auth");
const { auth } = require("../middleware/auth");
const { uploadFile, uploadImage } = require("../middleware/uploadFile");

router.get("/authorization", auth, checkAuth);

router.post("/register", register);
router.post("/login", login);
router.get("/user", auth, getUserByIdUser);
router.patch("/user", auth, uploadImage("image"), editUser);
router.delete("/user/:id", auth, deleteUser);

router.post("/literature", auth, uploadFile("documentFile"), postLiterature);
router.get("/literature", auth, getLiterature);
router.get("/literature-approved", auth, getLiteratureThatApprove);
router.get("/literature/:id", auth, getLiteraturebyId);
router.get("/literature-created", auth, getLiteraturebyCreated);
router.get("/userLiterature/:id", auth, getLiteraturebyIdUser);
router.patch("/literature/:id", auth, editLiterature);
router.delete("/literature/:id", auth, deleteLiterature);

router.post("/bookmark", auth, addBookmark);
router.get("/bookmark/:id", auth, getBookmark);
router.get("/bookmark", auth, getBookmarks);

module.exports = router;
