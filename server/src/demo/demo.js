// db.js
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  passkey: { type: Object }, // Store passkey details
});

const User = mongoose.model("User", userSchema);

// Define Challenge schema
const challengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challenge: { type: String, required: true },
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = { User, Challenge };

// Update Your Express Application Here

const express = require("express");
const bodyParser = require("body-parser");
const { User, Challenge } = require("./db"); // Import models
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require("@simplewebauthn/server");

const app = express();
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({
    username,
    password,
  });

  await user.save();

  console.log("Register successful", user);

  return res.json({ id: user._id });
});

app.post("/register-challenge", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "user not found!" });

  const challengePayload = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "My Localhost Machine",
    attestationType: "none",
    userName: user.username,
    timeout: 30_000,
  });

  const challenge = new Challenge({
    userId: user._id,
    challenge: challengePayload.challenge,
  });

  await challenge.save();

  return res.json({ options: challengePayload });
});

app.post("/register-verify", async (req, res) => {
  const { userId, cred } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "user not found!" });

  const challenge = await Challenge.findOne({ userId: user._id });
  if (!challenge)
    return res.status(404).json({ error: "challenge not found!" });

  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: challenge.challenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    response: cred,
  });

  if (!verificationResult.verified)
    return res.json({ error: "could not verify" });

  user.passkey = verificationResult.registrationInfo;
  await user.save();

  return res.json({ verified: true });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

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
  console.log(existingChallenge);

  if (!existingChallenge) {
    throw new ApiError(500, "Failed to create challenge");
  }
  return res.json({ options: challengePayload });
});
