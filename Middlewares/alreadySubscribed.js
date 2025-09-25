// middlewares/blockIfSubscribed.js
export const alreadySubscribed = (req, res, next) => {
  if (req.user.subscription?.status === "active") {
    return res
      .status(403)
      .json({ message: "You are already subscribed" });
  }
  next();
};
