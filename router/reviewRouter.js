import express from "express";
import { getReviews, insertReview } from "../database/review/reviewModel.js";
import { auth } from "../middlewares/auth.js";
import { newReviewValidator } from "../middlewares/joi.js";
import { getOrderByFilter } from "../database/order/orderModel.js";

const reviewRouter = express.Router();

//post review
reviewRouter.post("/", auth, newReviewValidator, async (req, res, next) => {
  try {
    const { _id, firstName, lastName, profileImage } = req.userInfo;
    const { orderId, ...rest } = req.body;

    const productPurchased = await getOrderByFilter({
      orderId,
      userId: _id,
      paymentStatus: "Succeeded",
    });

    if (productPurchased?._id) {
      const review = await insertReview({
        ...rest,
        userId: _id,
        userName: `${firstName} ${lastName}`,
        profileImage,
      });

      return review?._id
        ? res.json({
            status: "success",
            message: "Thank you for your review",
          })
        : res.json({
            status: "error",
            message: "Couldn't add review, add again",
          });
    }
    res.json({
      status: "error",
      message: "Please purchase before leaving review",
    });
  } catch (error) {
    next(error);
  }
});

// fetch reviews
reviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews({ status: "active" });
    reviews.length
      ? res.json({
          status: "success",
          message: "",
          reviews,
        })
      : res.json({
          status: "error",
          message: "No reviews available currently.",
        });
  } catch (error) {
    next(error);
  }
});
export default reviewRouter;
