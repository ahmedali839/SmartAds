import response from "../utlis/responseHandler.js";
import jwt from "jsonwebtoken"


export const authMiddleware = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies["auth_token"];

    let token;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(' ')[1]
    } else if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return response(res, 400, "Unaauthorized token missing, please provide valid token.")
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key)
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return response(res, 400, "Unaauthorized Access.");
    }
}

