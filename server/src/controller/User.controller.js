import { User, Challenge } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
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
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const challengePayload = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "My Localhost ",
    attestationType: "none",
    userName: user.username,
    timeout: 30_000,
  });

  const existingChallenge = await Challenge.findOneAndUpdate(
    { userId },
    { challenge: challengePayload.challenge },
    { upsert: true, new: true }
  );

  if (!existingChallenge) {
    throw new ApiError(500, "Failed to create challenge");
  }
  return res.json({ options: challengePayload });
});

const verifyRegistration = asyncHandler(async (req, res) => {
  const { userId, credential } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const existingChallenge = await Challenge.findOne({
    userId: credential.userId,
  });
  if (!existingChallenge) {
    throw new ApiError(404, "Challenge not found");
  }
  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: existingChallenge.challenge,
    expectedOrigin: "http://localhost:9032",
    expectedRPID: "localhost",
    response: credential,
  });

  if (!verificationResult.verified) {
    throw new ApiError(400, "Failed to verify registration");
  }
  user.passKey = verificationResult.registrationInfo;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Registration verified successfully", {}));
});

export { registerUser, loginUser, registerChallenge, verifyRegistration };
