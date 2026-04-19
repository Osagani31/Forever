import jwt from "jsonwebtoken";

const pickToken = (req) => {
  let t =
    req.get("token") ||
    req.headers.token ||
    req.get("x-access-token") ||
    req.headers["x-access-token"] ||
    req.body?.token ||
    req.query?.token;

  const auth = req.get("authorization") || req.headers.authorization;
  if ((!t || t === "undefined" || t === "null") && auth && typeof auth === "string") {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    t = m ? m[1].trim() : auth.trim();
  }

  if (typeof t === "string") {
    t = t.trim().replace(/^["']|["']$/g, "");
    if (t.toLowerCase() === "undefined" || t.toLowerCase() === "null") {
      t = "";
    }
  }

  return t || null;
};

const authUser = async (req, res, next) => {
  try {
    const token = pickToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Please login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid user token" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
