const complaints = require('../Models/complaintSchema');
const users = require('../Models/userSchema');
const nodemailer = require('nodemailer');

exports.sendComplaint = async (req, res) => {
    const { name, email, userId, complaint } = req.body;
    if (name && email && userId && complaint) {
        try {

            // Function to generate cmpId
            const generateCmpId = () => {
                return Math.floor(100000 + Math.random() * 900000);
            };

            // Generate a random 6-digit unique ID
            const cmpId = generateCmpId();
            const newComplaint = new complaints({
                name: name,
                email: email,
                userId: userId,
                complaint: complaint,
                cmpId: `CMP${cmpId}`,
                status: "Pending"
            })
            await newComplaint.save()
            const adminUsers = await users.find({ role: "admin" })
            const adminEmails = adminUsers.map(user => user.email);
            adminEmails.forEach((aEmail) => {
                sendEmail(
                    aEmail,
                    'Alert!!! : from Hero Website',
                    `A New Complaint Activated from ${name}, ${email} : ${complaint}`
                );
            });

            res.status(200).json("Complaint Added Successfully")
        } catch (err) {
            res.status(401).json(`Registration request failed due to ${err}`)
        }
    }
    else {
        res.status(406).json('Something went wrong')
    }
}

exports.getUserCmp = async (req, res) => {
    const userId = req.params.id;
    if (userId) {
        const userCmp = await complaints.find({ userId: userId })
        if (userCmp) {
            res.status(200).json({ data: userCmp, count: userCmp.length })
        }
        else {
            res.status(401).json(`No complaines registered by user`)
        }
    }
    else {
        res.status(406).json('Something went wrong')
    }
}
exports.getAllCmp = async (req, res) => {
    const key = req.query.key
    // Set `isKeyProvided` to true if `key` is not empty, false otherwise
    const isKeyProvided = key && key.trim() !== "";

    console.log(isKeyProvided);
    const pendingCmp = await complaints.find({ status: "Pending" })
    const progressCmp = await complaints.find({ status: "InProgress" })
    const completedCmp = await complaints.find({ status: "Completed" })
    if (key == " ") {

        res.status(200).json({
            pending: pendingCmp,
            progress: progressCmp,
            completed: completedCmp,
        })
    } else {

        // Filter the pendingCmp array to include only objects where name or email starts with the key
        const filteredPendingCmp = pendingCmp.filter(complaint =>
            complaint.name.toLowerCase().startsWith(key.toLowerCase()) ||
            complaint.email.toLowerCase().startsWith(key.toLowerCase())
        );
        // Filter the pendingCmp array to include only objects where name or email starts with the key
        const filteredProgressCmp = progressCmp.filter(complaint =>
            complaint.name.toLowerCase().startsWith(key.toLowerCase()) ||
            complaint.email.toLowerCase().startsWith(key.toLowerCase())
        );
        // Filter the pendingCmp array to include only objects where name or email starts with the key
        const filteredCompletedCmp = completedCmp.filter(complaint =>
            complaint.name.toLowerCase().startsWith(key.toLowerCase()) ||
            complaint.email.toLowerCase().startsWith(key.toLowerCase())
        );
        res.status(200).json({
            pending: filteredPendingCmp,
            progress: filteredProgressCmp,
            completed: filteredCompletedCmp,
        })
    }


}
exports.statusChange = async (req, res) => {
    const { cmpId, status } = req.body;  // Destructure cmpId and status from request body

    try {
        const result = await complaints.findOneAndUpdate(
            { cmpId: cmpId },
            { $set: { status: status } }
        );

        if (!result) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        res.status(200).json({
            message: "Status updated successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating status.", error: error.message });
    }
};

// Function to send an email
const sendEmail = async (toEmail, subject, text) => {
    const mailOptions = {
        from: 'abhijithspatharam05@gmail.com',
        to: toEmail,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
// Setup Nodemailer transport (using Gmail in this case)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abhijithspatharam05@gmail.com',
        pass: 'smcl vqhx ofyk nycl',
    },
    tls: {
        rejectUnauthorized: false,  // If you're using a self-signed cert or unusual network setup
    }
});