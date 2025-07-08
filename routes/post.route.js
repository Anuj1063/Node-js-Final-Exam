const router = require("express").Router();
const postController = require("../controllers/post.controller");

const auth = require("../middleware/auth.middleware")();


router.post("/create", auth.authenticateAPI, postController.addPosts);


router.get("/getposts",postController.listPosts);

router.put("/editpost/:id", auth.authenticateAPI, postController.updatePost);

router.delete(
  "/deletepost/:id",
  auth.authenticateAPI,
  postController.deletePost
);



module.exports = router;
