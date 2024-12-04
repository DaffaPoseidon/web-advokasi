const express = require("express"); // Mengimpor modul Express untuk membuat aplikasi server Node.js
const signupRoute = require("./routes/Signup")
const loginRoute = require("./routes/Login")
const authenticatedRoute = require("./routes/Authenticated")
const bodyParser = require("body-parser")
const cors = require("cors")
const {createSuperAdminAccount} = require("./scripts/setup")

// Baru
const caseRoutes = require("./routes/CaseRoutes");
//

const app = express(); // Membuat instance aplikasi Express
const PORT = process.env.PORT || 5000; // Menentukan port untuk server

app.use(cors())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({ limit: "50mb" })); // Tingkatkan batas JSON payload
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // Tingkatkan batas URL-encoded

createSuperAdminAccount()

app.use("/user", signupRoute);
app.use("/auth", loginRoute)
app.use("/api", authenticatedRoute)

// Daftarkan rute untuk kasus
app.use("/api/cases", caseRoutes);
// 

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`); // Menjalankan server dan menampilkan URL server ke konsol
});
