import otpGenerator from "../utlis/optGenerator.js";
import User from "../models/user.model.js";
import response from "../utlis/responseHandler.js";
import sendOtpToEmail from "../services/emailService.js";


// step 1: send Otp
export const sendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator();
    const expiry = new Date(Date.now() + 5 * 60 * 1000)
    let user;
    try {
        if (email) {
            user = await User.findOne({ email })

            if (!user) {
                user = new User({ email })
            }
            user.emailOtp = otp;
            user.emailOtpExpiry = expiry;
            await user.save();
            await sendOtpToEmail(email, otp);
            console.log("running after sentotptoemail")

            return response(res, 200, `otp sent successfully to your email: ${email}`)
        }

    } catch (error) {
        console.error("Server error", error);
        return response(res, 500, "Internally Server error, please try email verification.", error)
    }
}

// step 2: verify otp
export const verifyOtpp = async (req, res) => {
    const { userName, email, otp, password } = req.body;

    try {
        let user;
        // for email otp
        if (email) {
            user = await User.findOne({ email })
            if (!user) {
                return response(res, 404, "user not found");
            }

            const now = new Date();
            if (!user.emailOtp || String(user.emailOtp) !== String(otp) || now > new Date(user.emailOtpExpiry)) {
                return response(res, 400, "Invalid or expired Otp")
            }

            const hashedPassword = await User.hashPassword(password)

            user.username = userName
            user.password = hashedPassword
            user.emailOtp = null
            user.emailOtpExpiry = null
            await user.save();

        }

        const token = user.generateJwtToken(user?._id);
        res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        })

        console.log(token, user);
        return response(res, 200, "Otp verified Successfully.", { token, user })

    } catch (error) {
        console.error("Server error", error);
        return response(res, 500, "Internally Server error.", error)
    }

}

// step 3: login with email & password
export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        // 1️⃣ Validate input
        if (!email || !password) {
            return response(res, 400, "Email and password are required");
        }

        // 2️⃣ Find user and include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return response(res, 404, "User not found. Please signup first.");
        }

        // 3️⃣ Check if email is verified
        if (user.emailOtp) {
            return response(res, 403, "Please verify your email before logging in");
        }

        // 4️⃣ Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return response(res, 401, "Invalid credentials");
        }

        // 5️⃣ Generate JWT token
        const token = user.generateJwtToken();

        // 6️⃣ Set cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        });

        // 7️⃣ Remove sensitive data before sending
        const { password: pwd, emailOtp, emailOtpExpiry, ...userData } = user._doc;

        return response(res, 200, "Login successful", { token, user: userData });

    } catch (error) {
        console.error("Login Error:", error);
        return response(res, 500, "Internal server error", error);
    }
};

// step 4:  updateProfile
export const updateProfile = async (req, res) => {
    const { username } = req.body;
    const userId = req.user._id;
  
    try {
        const user = await User.findById(userId)
        if (username) user.username = username;
        await user.save();

        // console.log(res, 200, "Update Profile Sucessfully.", user)
        return response(res, 200, "Update Profile Sucessfully.", user)
    } catch (error) {
        console.error("Server error", error);
        return response(res, 500, "Internally Server error.", error)
    }
}

// step 5: userAuthentication
export const checkAuthenticated = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return response(res, 404, "user not found, please login before use.")
        }
        const user = await User.findById(userId)
        if (!user) {
            return response(res, 404, "user not found.");
        }
        return response(res, 200, "user retrieved and allow to use Smart Ads", user);
    } catch (error) {
        console.error("Server error", error);
        return response(res, 500, "Internally Server error.", error)
    }
}

// step 6: logout
export const logout = (req, res) => {
    try {
        res.cookie("auth_token", "", { expires: new Date(0) })
        return response(res, 200, "user Logged-Out",)
    } catch (error) {
        console.error("Server error", error);
        return response(res, 500, "Internally Server error.", error)
    }
}
