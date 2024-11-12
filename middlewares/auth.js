// import { getSession } from "../database/session/sessionModel.js";
// import { getUser } from "../database/user/userModel.js";
// import { verifyAccessJWT, verifyRefreshJWT } from "../utility/jwtHelper.js";

// // authenticate user using access jwt
// export const auth = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       return next({
//         status: 401,
//         message: "Authorization header is missing",
//       });
//     }
//     // verfy access jwt
//     const decoded = verifyAccessJWT(authorization);

//     // Check if the token verification failed and returned an error message
//     if (typeof decoded === "string" || !decoded?.email) {
//       return next({
//         status: 401,
//         message: decoded, // "jwt expired" or "Invalid Token"
//       });
//     }

//     if (decoded?.email) {
//       // get token
//       const tokenObj = await getSession({ token: authorization });

//       if (tokenObj?._id) {
//         // get user
//         const user = await getUser({ email: decoded.email });
//         if (user?._id) {
//           if (!user.isEmailVerified) {
//             return res.json({
//               status: "error",
//               message: " Account Not Verified. Check email to Verify Now.",
//             });
//           }

//           user.__v = undefined;
//           user.refreshJWT = undefined;

//           req.userInfo = user;
//           return next();
//         }
//       }
//     }

//     // if error
//     res.status(401).json({
//       status: "error",
//       message: "Unauthorized access.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // authenticate user using refresh jwt
// export const jwtAuth = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     let errorMessage = "";

//     // verfy access jwt
//     const decoded = verifyRefreshJWT(authorization);

//     if (typeof decoded === "string") {
//       return next({
//         status: 401,
//         message: decoded, // "jwt expired" or "Invalid Token"
//       });
//     }

//     if (decoded?.email) {
//       // get user
//       const user = await getUser({ email: decoded.email });

//       if (user?._id) {
//         if (!user.isEmailVerified) {
//           return (errorMessage = "Account Not Verified.");
//         }

//         user.__v = undefined;
//         user.refreshJWT = undefined;

//         req.userInfo = user;
//         return next();
//       }
//     }

//     // if error
//     res.json({
//       status: 401,
//       message: errorMessage
//         ? errorMessage
//         : "Invalid Token or unauthorized access.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import { getSession } from "../database/session/sessionModel.js";
import { findUserByEmail } from "../database/user/userModel.js";
import {
  generateAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utility/jwtHelper.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";

// Client authentication
export const clientAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Validate if accessJWT is valid
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      const sessionToken = await getSession({
        token: authorization,
        userEmail: decoded.email,
      });

      if (sessionToken?._id) {
        const user = await findUserByEmail(decoded.email); // Client-specific user lookup

        if (user?._id && user?.isVerified) {
          user.password = undefined; // Remove sensitive information
          req.userInfo = user;

          return next();
        }
      }
    }

    throw new Error("Invalid token, unauthorized");
  } catch (error) {
    return buildErrorResponse(res, error.message || "Invalid token!");
  }
};

// Refresh access token for client
export const refreshAuth = async (req, res) => {
  try {
    const { authorization } = req.headers;

    // Validate and decode refresh token
    const decoded = verifyRefreshJWT(authorization);

    // Get the user based on email and generate a new access token
    if (decoded?.email) {
      const user = await findUserByEmail(decoded.email);

      if (user?._id) {
        // Generate a new access token and return it to the client
        const accessJWT = await generateAccessJWT(user.email);

        return buildSuccessResponse(res, accessJWT, "New Access Token");
      }
    }

    throw new Error("Invalid token!");
  } catch (error) {
    return buildErrorResponse(res, error.message);
  }
};
