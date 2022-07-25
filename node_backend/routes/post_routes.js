const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/jiff": "jiff",
};
const checkAutho = require("../auth-check/check-auth.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "node_backend/img_up");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.put(
  "/:id",
  checkAutho,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body._id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "Update Successful!",
          imagePath: imagePath,
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
          imagePath: imagePath,
        });
      }
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Not found" });
    }
  });
});

router.post(
  "",
  checkAutho,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });

    post.save().then((result) => {
      res.status(201).json({
        message: "Post added Successfully.",
        post: {
          _id: res._id,
          title: res.title,
          content: res.content,
          imagePath: res.imagePath,
        },
      });
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const curPage = +req.query.curpage;
  const temp = Post.find();
  let fetchedDocs;
  if (pageSize && curPage) {
    temp.skip(pageSize * (curPage - 1)).limit(pageSize);
  }
  temp
    .then((docs) => {
      fetchedDocs = docs;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Fetched Succesfully..",
        posts: fetchedDocs,
        numPosts: count,
      });
    });
});

router.delete("/:pid", checkAutho, (req, res, next) => {
  // console.log(req.params);
  Post.deleteOne({ _id: req.params.pid, creator: req.userData.userId }).then(
    (result) => {
      // console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Update Successful!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    }
  );
});

module.exports = router;
