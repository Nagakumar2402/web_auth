import { User, Challenge } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import crypto from "node:crypto";

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullName,
    email,
    username: username?.toLowerCase(),
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "User logged in successfully", loggedInUser));
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

const registerChallenge = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate registration options
  const challengePayload = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "My Localhost",
    attestationType: "none",
    userName: user.username,
    timeout: 30_000,
  });

  // Update or create a challenge record
  await Challenge.findOneAndUpdate(
    { userId },
    { challenge: challengePayload.challenge },
    { upsert: true, new: true }
  );

  // Return the challenge options
  res.json({ options: challengePayload });
});

const verifyRegistration = asyncHandler(async (req, res) => {
  const { userId, credential } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Retrieve the existing challenge for the user
  const existingChallenge = await Challenge.findOne({ userId });
  if (!existingChallenge) {
    throw new ApiError(404, "Challenge not found");
  }

  // Verify the registration response
  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: existingChallenge.challenge,
    expectedOrigin: "http://localhost:5173",
    expectedRPID: "localhost",
    response: credential,
  });

  // Check if the registration was verified successfully
  if (!verificationResult.verified) {
    throw new ApiError(400, "Failed to verify registration");
  }

  // Save the registration info to the user record
  user.passKey = verificationResult.registrationInfo;
  await user.save();

  // Respond with success
  res.status(200).json(
    new ApiResponse(200, "Registration verified successfully", {
      verified: true,
    })
  );
});

// const loginChallenge = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   const challengePayload = await generateAuthenticationOptions({
//     rpID: "localhost",
//   });
//   await Challenge.findOneAndUpdate(
//     { userId: user._id },
//     { challenge: challengePayload.challenge },
//     { upsert: true, new: true }
//   );
//   res.json({ options: challengePayload });
// });

// const verifyLogin = asyncHandler(async (req, res) => {
//   const { email, credential } = req.body;

//   // Retrieve user and challenge directly, logging for verification
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.error("User not found for email:", email);
//     throw new ApiError(404, "User not found");
//   }
//   const existingChallenge = await Challenge.findOne({ userId: user._id });
//   if (!existingChallenge) {
//     console.error("Challenge not found for userId:", user._id);
//     throw new ApiError(404, "Challenge not found");
//   }

//   try {
//     const verificationResult = await verifyAuthenticationResponse({
//       expectedChallenge: existingChallenge.challenge,
//       expectedOrigin: "http://localhost:5173",
//       expectedRPID: "localhost",
//       response: credential,
//       authenticator: user.passKey,
//     });

//     console.log("Verification Result:", verificationResult);

//     if (!verificationResult.verified) {
//       console.error("Verification failed for userId:", user._id);
//       throw new ApiError(400, "Failed to verify login");
//     }

//     const loggedInUser = await User.findById(user._id).select(
//       "-password -refreshToken"
//     );

//     return res
//       .status(200)
//       .json(new ApiResponse(200, "User logged in successfully", loggedInUser));
//   } catch (error) {
//     console.error("Verification error:", error);
//     throw new ApiError(400, "Failed to verify login");
//   }
// });

const loginChallenge = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate a new challenge for authentication
  const challengePayload = await generateAuthenticationOptions({
    rpID: "localhost",
  });

  //Update or insert the challenge in the database
  await Challenge.findOneAndUpdate(
    { userId: user._id },
    { challenge: challengePayload.challenge },
    { upsert: true, new: true }
  );

  // Respond with the challenge options
  res.json({ options: challengePayload });
});

const verifyLogin = asyncHandler(async (req, res) => {
  const { email, credential } = req.body;

  // Retrieve user and challenge from the database
  const user = await User.findOne({ email });
  if (!user) {
    console.error("User not found for email:", email);
    throw new ApiError(404, "User not found");
  }

  const existingChallenge = await Challenge.findOne({ userId: user._id });
  if (!existingChallenge) {
    console.error("Challenge not found for userId:", user._id);
    throw new ApiError(404, "Challenge not found");
  }

  try {
    // Verify the authentication response
    const verificationResult = await verifyAuthenticationResponse({
      expectedChallenge: existingChallenge.challenge,
      expectedOrigin: "http://localhost:5173", // Adjust for production
      expectedRPID: "localhost",
      response: credential,
      // authenticator: user.passKey,

      authenticator: {
        credentialID: user.passKey.credentialID,
        credentialPublicKey: user.passKey.credentialPublicKey.buffer,
        counter: user.passKey.counter,
        transports: user.passKey.transports,
        signCount: user.passKey.signCount,
        userHandle: user.passKey.userHandle,
        credentialData: user.passKey.credentialData,
      },
    });

    console.log("Verification Result:", verificationResult);

    // Check if verification was successful
    if (!verificationResult.verified) {
      console.error("Verification failed for userId:", user._id);
      throw new ApiError(400, "Failed to verify login");
    }

    // Retrieve user data without sensitive fields
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -passkey"
    );

    // Respond with success and user data
    return res
      .status(200)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          loggedInUser,
          verificationResult,
        })
      );
  } catch (error) {
    console.error("Verification error:", error);
    throw new ApiError(400, "Failed to verify login");
  }
});

export {
  registerUser,
  loginUser,
  registerChallenge,
  verifyRegistration,
  loginChallenge,
  verifyLogin,
};
