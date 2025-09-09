// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const {
    fullName,
    birthDate,
    identificationType,
    documentNumber,
    email,
    password
  } = req.body;

  // Separar nombre y apellido (ejemplo simple: todo lo que va después del primer espacio es apellido)

  if (!fullName || !birthDate || !identificationType || !documentNumber || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Revisar si ya existe correo o documento
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM user WHERE Email = ? OR DocumentNumber = ?", [email, documentNumber]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "El correo o número de documento ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la tabla
    await db.promise().query(
        `INSERT INTO User
            (Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role) 
        VALUES (?, ?, ?, ?, ?, ?, 'active', 'user')`,
        [fullName, identificationType, documentNumber, birthDate, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos" });
  }

  try {
      const [rows] = await db
        .promise()
        .query("SELECT * FROM User WHERE Email = ?", [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      // Generar un JWT, por ahora solo devolvemos datos básicos
      res.json({
        token: 'token',
        user: {
          id: user.UserId,
          fullName: user.Names,
          identificationType: user.DocumentType,
          documentNumber: user.DocumentNumber,
          email: user.Email,
          birthDate: user.BirthDate,
          role: user.Role,
          photo: user.Photo
        }
      });
    } catch (error) {
      console.error("❌ Error en login:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;
