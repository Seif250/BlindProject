const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String }, // رابط الصورة
    specialization: { type: String },
    year: { type: Number },
    whatsapp: { type: String },
    gender: { type: String, enum: ["male", "female"] }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// تشفير الباسورد قبل الحفظ
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to return user data without sensitive information
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;