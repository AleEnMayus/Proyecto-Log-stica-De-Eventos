const Account = require("../models/Account");
const bcrypt = require("bcrypt");
// Crear cuenta
const createAccount = async (req, res) => {
  try {
    const { Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role } = req.body;

    if (!Names || !DocumentType || !DocumentNumber || !BirthDate || !Email || !Password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 salt rounds

    const result = await Account.create({
      Names,
      DocumentType,
      DocumentNumber,
      BirthDate,
      Email,
      Password: hashedPassword,
      Status: Status || "active",
      Role: Role || "user"
    });

    res.status(201).json({
      message: "Cuenta creada con éxito",
      accountId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    res.status(500).json({ error: "Error interno al crear cuenta" });
  }
};


// Obtener todas las cuentas
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
    res.status(500).json({ error: "Error interno al obtener cuentas" });
  }
};

// Obtener cuenta por ID
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);

    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    res.json(account);
  } catch (error) {
    console.error("Error al obtener cuenta:", error);
    res.status(500).json({ error: "Error interno al obtener cuenta" });
  }
};

// Actualizar cuenta (sin permitir modificar la contraseña ni la foto)
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role } = req.body;

    const result = await Account.update(id, { Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    res.json({ message: "Cuenta actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar cuenta:", error);
    res.status(500).json({ error: "Error interno al actualizar cuenta" });
  }
};

// Eliminar cuenta
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Account.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    res.json({ message: "Cuenta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    res.status(500).json({ error: "Error interno al eliminar cuenta" });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};