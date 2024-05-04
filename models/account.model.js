const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    password: { type: String, required: true },
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
});

// Pre-save hook to hash the password before saving
accountSchema.pre('save', async function(next) {
    const account = this;
    if (!account.isModified('password')) {
        return next(); // If password is not modified, move on
    }

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(account.password, salt);
        account.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
