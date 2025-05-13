const jwt = require("jsonwebtoken");
const accountRepository = require("../repositories/accountRepository");
const baseResponse = require("../utils/baseResponse");
const hasher = require("../utils/hasher");
const { jwtKey } = require("../configs/env");
const { sendVerificationEmail } = require("../services/accountServices");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "Missing email, name, or password", null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
        return baseResponse(res, false, 400, "Email or password isn't valid", null);
    }

    try {
        if (await accountRepository.getAccountbyEmail(email)) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        const hashedPassword = hasher.hashPassword(password);

        let accountObject = {
            name: name,
            email: email,
            password: hashedPassword
        };

        const account = await accountRepository.register(accountObject);
        const isVerificationEmailSent = await sendVerificationEmail(account.email, account.id, account.name);

        if (!!account && isVerificationEmailSent) {
            baseResponse(res, true, 201, "Account created", null);
        } else {
            baseResponse(res, false, 400, "Account not created", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkAcc = await accountRepository.getAccountbyEmail(email);

        if (!checkAcc.is_verified) {
            return baseResponse(res, false, 401, "Account isn't verified", null);
        }

        const hashedPassword = hasher.hashPassword(password);
        const account = await accountRepository.login(email, hashedPassword);

        if (!!account) {
            const token = jwt.sign(
                { id: account.id, email: account.email, name: account.name },
                jwtKey,
                { expiresIn: "1h" }
            );
            baseResponse(res, true, 200, "Login success", { account, token });
        } else {
            baseResponse(res, false, 404, "Invalid email or password", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.updateAccount = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "Missing email, name, or password", null);
    }

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
        return baseResponse(res, false, 400, "Email or password isn't valid", null);
    }

    try {
        const hashedPassword = hasher.hashPassword(password);

        let accountObject = {
            name: name,
            email: email,
            password: hashedPassword
        };

        const account = await accountRepository.updateAccount(accountObject, id);
        if (account) {
            baseResponse(res, true, 200, "Account updated", account);
        } else {
            baseResponse(res, false, 404, "Account not found", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        if (!await accountRepository.getAccountbyId(id)) {
            return baseResponse(res, false, 404, "Account not found", null);
        }
        const account = await accountRepository.deleteAccount(id);
        baseResponse(res, true, 200, "Account deleted", account);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.verifyAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await accountRepository.getAccountbyId(id);
        if (!account) {
            return baseResponse(res, false, 404, "Account not found", null);
        }
        if (account.is_verified) {
            return baseResponse(res, false, 400, "Account already verified", null);
        }
        await accountRepository.verifyAccount(id);
        baseResponse(res, true, 200, "Account verified", null);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};