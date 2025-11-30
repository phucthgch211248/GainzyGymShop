const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300, 
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, 
    },
    tags: [
      {
        type: String, 
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishAt: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Blog', BlogSchema);