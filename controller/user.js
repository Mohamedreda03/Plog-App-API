const User = require("../model/user.schema");
const bcrypt = require("bcrypt");
const genJWT = require("../utils/genJWT");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Post = require("../model/post.schema");
const verifyToken = require("../utils/verifyToken");

const Register = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName: userName,
            password: hashedPassword,
        });

        const token = await genJWT({
            userName: newUser.userName,
            id: newUser._id,
        });

        await newUser.save();

        res.status(201).json({ status: "success", data: { newUser, token } });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const Login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ userName: userName });

        const passwordConfirm = await bcrypt.compare(password, user.password);
        if (passwordConfirm) {
            const token = await genJWT({
                userName: user.userName,
                id: user._id,
            });
            res.status(200).json({ status: "success", data: { user, token } });
        } else {
            res.status(400).json({
                status: "feld",
                data: { msg: "password or userName not correct" },
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            data: { msg: "password or userName not correct" },
        });
    }
};

const getUser = async (req, res) => {
    try {
        const { token } = req.body;
        const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);
        res.json({ user: verifyUser.userName });
    } catch (error) {
        res.status(400).json({
            status: "error",
            data: { msg: "some thing wronge" },
        });
    }
};

const createPost = async (req, res) => {
    try {
        const token = await verifyToken(req.headers["authorization"]);
        const { title, summary, content } = req.body;
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newpath = path + "." + ext;

        fs.renameSync(path, newpath);

        const newPost = await new Post({
            title,
            summary,
            image: newpath,
            content,
            auther: token.id,
        });

        newPost.token = token.id;

        await newPost.save();

        res.status(201).json({
            status: "success",
            data: { newPost },
        });
    } catch (error) {
        res.status(400).json({ status: "error", data: { msg: error.message } });
    }
};

const gitAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate("auther", ["userName"]);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const getSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId }).populate(
            "auther"
        );
        res.status(200).json({ data: post });
    } catch (error) {
        res.json(error);
    }
};

const uploadPost = async (req, res, next) => {
    const { title, summary, content } = req.body;
    const oldPost = await Post.findOne({ _id: req.params.postId });

    let newpath;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        newpath = path + "." + ext;

        fs.renameSync(path, newpath);
    }

    await oldPost.updateOne({
        title,
        summary,
        content,
        image: newpath ? newpath : oldPost.image,
    });

    // console.log(post);
    res.status(200).json("done");
};

const deletePost = async (req, res, next) => {
    await Post.findOneAndDelete({ _id: req.params.postId });
    res.status(200).json("done");
};

module.exports = {
    Register,
    Login,
    createPost,
    gitAllPosts,
    getSinglePost,
    getUser,
    uploadPost,
    deletePost,
};
