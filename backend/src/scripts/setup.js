const User = require("../models/User")
const bcrypt = require("bcrypt")

async function createSuperAdminAccount() {
    try {
        const existingAdmin = await User.findOne({ email: 'superadmin@test.com' })
        if (existingAdmin) {
            console.log("Superadmin account already exist")
        } else {
            const newSuperAdmin = new User({
                firstName: "Superadmin",
                lastName: "123",
                email: "superadmin@test.com",
                password: await bcrypt.hash("superadmin123", 13),
                role: "superadmin"
            })
            await newSuperAdmin.save()
            console.log("Superadmin account created successfully")
        }
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = { createSuperAdminAccount }