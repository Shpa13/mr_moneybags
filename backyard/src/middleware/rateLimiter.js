import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // utilize userID or ipAddress for rate limiting key
    const { success } = await ratelimit.limit("rate-limiting-key");

    if (!success) {
      return res.status(429).json({
        message: "too many requests, chill",
      });
    }
    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
