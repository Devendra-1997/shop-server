import categoryRouter from "./categoryRouter.js";
import userRouter from "./userRouter.js";

export const routes = [
  {
    path: "/v1/users",
    middlewares: [userRouter],
  },
  {
    path: "/v1/categories",
    middlewares: [categoryRouter],
  },
  {
    path: "/v1/products",
    middlewares: [productRouter],
  },
  {
    path: "/v1/reviews",
    middlewares: [reviewRouter],
  },
];
