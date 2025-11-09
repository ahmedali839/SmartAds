import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: [3, "name should at least 3 characters long"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: {
            validator: function (value) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            },
            message: "Email format not valid."
        }
    },
    password: {
        type: String,
        select: false,
        minLength: [4, "password should at least 4 characters long"],
    },
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },

})



UserSchema.methods.generateJwtToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.jwt_secret_key, { expiresIn: "1d" })
    return token
}

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

const user = mongoose.model("User", UserSchema)
export default user

