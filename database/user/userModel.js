import userSchema from "./userSchema.js";

// create new user
export const createUser = (obj) => {
  return userSchema(obj).save();
};

// Update User
export const updateUser = (filter, updatedUser) => {
  return userSchema.findOneAndUpdate(filter, updatedUser, { new: true });
};
// Find user by email
export const findUserByEmail = (email) => {
  return userSchema.findOne({ email });
};

// delete user
export const deleteUserById = (_id) => {
  return userSchema.findByIdAndDelete(_id);
};

// // for testing purpose
// // Create a new user
// export const createClientUser = (userObj) => {
//   return userSchema(userObj).save();
// };

// // Update client user information
// export const updateClientUser = (filter, updatedUser) => {
//   return userSchema.findOneAndUpdate(filter, updatedUser, { new: true });
// };

// // Find client user by email
// export const findClientUserByEmail = (email) => {
//   return userSchema.findOne({ email });
// };
