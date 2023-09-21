const {
    Register,
    Login,
    createPost,
    gitAllPosts,
    getSinglePost,
    getUser,
    uploadPost,
    deletePost,
} = require("../controller/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = require("express").Router();

router.route("/").post(getUser);
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/post").post(upload.single("image"), createPost).get(gitAllPosts);
router
    .route("/post/:postId")
    .get(getSinglePost)
    .patch(upload.single("image"), uploadPost)
    .delete(deletePost);

module.exports = router;
