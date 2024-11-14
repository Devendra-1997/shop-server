import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";
import reviewRouter from "./reviewRouter.js";

export const routes = [
  {
    path: "/api/users",
    middlewares: [userRouter],
  },
  {
    path: "/api/categories",
    middlewares: [categoryRouter],
  },
  {
    path: "/api/products",
    middlewares: [productRouter],
  },
  {
    path: "/api/reviews",
    middlewares: [reviewRouter],
  },
];
