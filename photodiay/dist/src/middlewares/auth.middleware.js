import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token)
        return res.status(401).json({ message: "Token manquant" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Token invalide" });
    }
};
//# sourceMappingURL=auth.middleware.js.map