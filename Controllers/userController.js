const bcrypt = require('bcrypt');
const users = require('../Models/userSchema');

// 1. Register Function (Hash the password)
exports.register = async (req, res) => {
    console.log("==inside userController : register function");
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await users.findOne({ email: email });
        console.log(existingUser);

        // Function to generate unique ID
        const generateUnqId = () => {
            return Math.floor(100000 + Math.random() * 900000); 
        };

        if (existingUser) {
            return res.status(406).json('Account already exists, please login');
        } else {
            // Hash the password before saving the user
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Generate a random 6-digit unique ID
            const unqId = generateUnqId();

            const newUser = new users({
                username: username,
                email: email,
                password: hashedPassword,  // Save the hashed password
                role: role,
                unqId: `USR${unqId}`,
            });

            // Save the new user
            await newUser.save();
            res.status(200).json("Registration request received successfully");
        }

    } catch (err) {
        res.status(401).json(`Registration request failed due to ${err}`);
    }
};

// 2. Login Function (Compare entered password with stored hash)
exports.login = async (req, res) => {
    console.log("Inside login controller function");
    const { email, password, role } = req.body;

    try {
        const existingUser = await users.findOne({ email: email, role: role });
        console.log(existingUser);

        if (existingUser) {
            // Compare the entered password with the hashed password stored in the DB
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

            if (isPasswordCorrect) {
                const data = {
                    unqId: existingUser.unqId,
                    username: existingUser.username,
                    email: existingUser.email,
                    role: existingUser.role,
                };

                res.status(200).json({
                    existingUser: data
                });
            } else {
                res.status(406).json("Invalid email id or password");
            }
        } else {
            res.status(406).json("Invalid email id or password");
        }

    } catch (err) {
        res.status(401).json("Login request failed due to " + err);
    }
};
