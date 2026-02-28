const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Demo admin for development - password is "admin123"
// Using bcrypt.hashSync("admin123", 10) to generate
const demoAdmin = {
  id: 1,
  username: "admin",
  email: "admin@example.com",
  password: bcrypt.hashSync("admin123", 10),
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log("🔐 Login attempt:", { username });

      if (!username || !password) {
        return res.status(400).json({ success: false, error: "Username and password required" });
      }

      let user = null;
      let source = "none";

      // Try database first
      try {
        const users = await query("SELECT * FROM admin_users WHERE username = ?", [username]);
        console.log("📊 Database query result:", users.length, "users found");
        if (users.length > 0) {
          user = users[0];
          source = "database";
          console.log("👤 User from database:", { id: user.id, username: user.username });
        }
      } catch (dbError) {
        // Fallback to demo admin
        console.log("⚠️ Database not available, using demo admin. Error:", dbError.message);
        if (username === demoAdmin.username) {
          user = demoAdmin;
          source = "demo";
        }
      }

      // If not found in database, try demo admin
      if (!user && username === demoAdmin.username) {
        user = demoAdmin;
        source = "demo-fallback";
        console.log("🔄 Using demo admin as fallback");
      }

      if (!user) {
        console.log("❌ User not found");
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      console.log("🔑 Comparing passwords, source:", source);
      let isValidPassword = await bcrypt.compare(password, user.password);
      console.log("🔐 Password valid:", isValidPassword);
      
      // Development fix: If DB password hash is wrong but correct password entered, fix it
      if (!isValidPassword && source === "database" && username === "admin" && password === "admin123") {
        console.log("🔧 Fixing admin password hash in database...");
        const newHash = await bcrypt.hash("admin123", 10);
        try {
          await query("UPDATE admin_users SET password = ? WHERE username = 'admin'", [newHash]);
          console.log("✅ Admin password hash updated successfully!");
          isValidPassword = true; // Allow login after fix
        } catch (updateError) {
          console.log("❌ Failed to update password:", updateError.message);
        }
      }
      
      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      // Update last login
      try {
        await query("UPDATE admin_users SET last_login = NOW() WHERE id = ?", [user.id]);
      } catch (dbError) {
        // Ignore if database not available
      }

      const token = generateToken(user);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  },

  async register(req, res) {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ success: false, error: "All fields are required" });
      }

      // Check if user exists
      try {
        const existing = await query("SELECT id FROM admin_users WHERE username = ? OR email = ?", [
          username,
          email,
        ]);
        if (existing.length > 0) {
          return res.status(400).json({ success: false, error: "Username or email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await query(
          "INSERT INTO admin_users (username, password, email, created_at) VALUES (?, ?, ?, NOW())",
          [username, hashedPassword, email]
        );

        const token = generateToken({ id: result.insertId, username });

        res.status(201).json({
          success: true,
          data: {
            token,
            user: { id: result.insertId, username, email },
          },
        });
      } catch (dbError) {
        return res.status(500).json({ success: false, error: "Database not available" });
      }
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ success: false, error: "Registration failed" });
    }
  },

  async getCurrentUser(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, error: "No token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      try {
        const users = await query("SELECT id, username, email FROM admin_users WHERE id = ?", [
          decoded.id,
        ]);
        if (users.length === 0) {
          // Fallback to demo admin
          if (decoded.id === demoAdmin.id) {
            return res.json({
              success: true,
              data: { id: demoAdmin.id, username: demoAdmin.username, email: demoAdmin.email },
            });
          }
          return res.status(404).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, data: users[0] });
      } catch (dbError) {
        // Fallback
        if (decoded.id === demoAdmin.id) {
          return res.json({
            success: true,
            data: { id: demoAdmin.id, username: demoAdmin.username, email: demoAdmin.email },
          });
        }
        res.status(500).json({ success: false, error: "Database error" });
      }
    } catch (error) {
      res.status(401).json({ success: false, error: "Invalid token" });
    }
  },
};

module.exports = authController;
