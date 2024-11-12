import express from "express";
import { hashPassword } from "../utility/bcryptHelper.js";
import { createUser } from "../database/user/userModel.js";
import { newUserValidator } from "../middlewares/joi.js";
import { v4 as uuidv4 } from "uuid";
import { emailVerificationMail } from "../services/nodemailer.js";
import { createSession } from "../database/session/sessionModel.js";
// import { signAccessJWT, signTokens } from "../utility/jwtHelper.js";
// import { clientAuth, jwtclientAuth } from "../middlewares/auth.js";
// import { upload } from "../services/multer.js";
// import { otpGenerator } from "../utility/random.js";
// import { cloudinary } from "../config/cloudinaryConfig.js";

const userRouter = express.Router();

// CREATE CLIENT USER | POST | SIGNUP

userRouter.post("/", newUserValidator, async (req, res) => {
  try {
    // Hash the password
    const { password } = req.body;
    const encryptedPassword = hashPassword(password);

    // Create client user in the database
    const user = await createUser({
      ...req.body,
      password: encryptedPassword,
    });

    // If the user is created, send a verification email
    if (user?._id) {
      const secureId = uuidv4();

      // Store this ID in session storage for the user's email
      const session = await createSession({
        token: secureId,
        userEmail: user.email,
      });

      if (session?._id) {
        // Create verification link and send a verification email
        const verificationUrl = `${process.env.CLIENT_ROOT_URL}/verify-email?e=${user.email}&id=${secureId}`;

        // Send verification email
        emailVerificationMail(user, verificationUrl);
      }
    }

    // Send a response indicating the result of the operation
    user?._id
      ? buildSuccessResponse(
          res,
          {},
          "Check your inbox/spam to verify your email"
        )
      : buildErrorResponse(res, "Could not register the user");
  } catch (error) {
    if (error.code === 11000) {
      error.message = "User with this email already exists!";
    }

    buildErrorResponse(res, error.message);
  }
});

// // verify-account
// userRouter.post("/verify-account", async (req, res, next) => {
//   try {
//     const { uniqueKey, email } = req.body;

//     // find token
//     const tokenObj = await findSession({
//       token: uniqueKey,
//       associate: email,
//       type: "verification",
//     });

//     if (tokenObj?._id) {
//       // 1. update user
//       const updatedUser = await updateUser(
//         {
//           email,
//         },
//         {
//           isEmailVerified: true,
//           status: "active",
//         }
//       );

//       if (updatedUser?._id) {
//         // 2. delete token
//         await deleteSession({
//           token: uniqueKey,
//           associate: email,
//           type: "verification",
//         });

//         // account verification notification mail
//         await emailVerifiedNotification({
//           email,
//           firstName: updatedUser?.firstName,
//         });

//         return res.json({
//           status: "success",
//           message: "Account Verified, Login Now.",
//         });
//       }
//     }

//     res.json({
//       status: "error",
//       message: "Link Expired, Please request new OTP",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // login
// userRouter.post("/login", loginUserValidator, async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await getUser({ email });

//     if (user?._id) {
//       const isPassword = comparePassword(password, user.password);

//       if (isPassword) {
//         const tokens = await signTokens(email);
//         return res.json({
//           status: "success",
//           tokens,
//         });
//       } else {
//         res.json({
//           status: "error",
//           message: "Incorrect Password",
//         });
//       }
//     }

//     res.json({
//       status: "error",
//       message: "Incorrect Email or Password",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // user profile
// userRouter.get("/profile", clientAuth, async (req, res, next) => {
//   try {
//     req.userInfo.password = undefined;

//     res.json({
//       status: "success",
//       message: "",
//       user: req.userInfo,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // renew access
// userRouter.get("/renew-access", jwtclientAuth, async (req, res, next) => {
//   try {
//     const { email } = req.userInfo;
//     const accessJWT = await signAccessJWT(email);

//     res.json({
//       status: "success",
//       message: "Access Renewed",
//       accessJWT,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // update profile detail
// userRouter.put(
//   "/update-profile",
//   clientAuth,
//   updateUserValidator,
//   async (req, res, next) => {
//     try {
//       const email = req.userInfo.email;

//       const updatedUser = await updateUser({ email }, { ...req.body });
//       return updatedUser?._id
//         ? res.json({
//             status: "success",
//             message: "User profile updated",
//           })
//         : res.json({
//             status: "error",
//             message: "Couldn't update profile, try again",
//           });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // request OTP
// userRouter.post("/otp", async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const user = await getUser({ email });

//     if (user?._id) {
//       const token = otpGenerator();

//       const session = await insertSession({
//         token,
//         associate: email,
//         type: "otp",
//       });

//       if (session?._id) {
//         sendOTPMail({ email, token, firstName: user.firstName });
//       }
//     }

//     res.json({
//       status: "success",
//       message:
//         "If your email is found in the system, we will send you OTP to reset in your email",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // resetPassword
// userRouter.post("/password/reset", async (req, res, next) => {
//   try {
//     const { otp, email, password } = req.body;

//     if ((otp, email, password)) {
//       const user = await getUser({ email });

//       if (user?._id) {
//         const session = await findSession({
//           token: otp,
//           type: "otp",
//           associate: email,
//         });

//         if (session) {
//           const updatedUser = await updateUser(
//             { email },
//             { password: hashPassword(password) }
//           );

//           if (updatedUser?._id) {
//             accountUpdateNotification({
//               email,
//               firstName: updatedUser.firstName,
//             });

//             // delete session
//             await deleteSession({
//               token: otp,
//               type: "otp",
//               associate: email,
//             });

//             return res.json({
//               status: "success",
//               message: "Password Reset Success",
//             });
//           }
//         }
//       }
//     }
//     res.json({
//       status: "error",
//       message: "Invalid data",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // update-password
// userRouter.put(
//   "/update-password",
//   clientAuth,
//   updatePasswordValidator,
//   async (req, res, next) => {
//     try {
//       const { currentPassword, newPassword } = req.body;

//       // get user password after clientAuthenticating
//       const { email, password } = req.userInfo;

//       // verify password first
//       const verifyPassword = comparePassword(currentPassword, password);

//       // update password
//       if (verifyPassword) {
//         const updatedPassword = password && hashPassword(newPassword);
//         const updatedUser = await updateUser(
//           { email },
//           { password: updatedPassword }
//         );

//         if (updatedUser?._id) {
//           return res.json({
//             status: "success",
//             message: "Password Updated",
//           });
//         }
//       }

//       res.json({
//         status: "error",
//         message: "Incorrect Password",
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // update-profile image
// userRouter.put(
//   "/update-image",
//   clientAuth,
//   upload.single("profileImage"),
//   async (req, res, next) => {
//     try {
//       const { email } = req.userInfo;
//       const filePath = req.file?.path;

//       // upload to cloudinary
//       const cloudImageLink = await cloudinary(filePath);

//       // update the profileImage link with cloudinary link
//       const user = await updateUser(
//         { email },
//         { profileImage: cloudImageLink }
//       );
//       user?._id
//         ? res.json({ status: "success", message: "Profile Image Updated" })
//         : res.json({
//             status: "error",
//             message: "Couldn't update profile Image. Try again",
//           });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // delete-account
// userRouter.delete(
//   "/delete-account/:_id?",
//   clientAuth,
//   async (req, res, next) => {
//     try {
//       const { _id } = req.params;

//       const user = await deleteUserById(_id);

//       user?._id
//         ? res.json({
//             status: "success",
//             message: "Account Deleted",
//           })
//         : res.json({
//             status: "error",
//             message: "Couldn't Delete Account, Try Again",
//           });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default userRouter;
