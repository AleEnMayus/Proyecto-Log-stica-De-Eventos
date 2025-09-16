const express = require("express");
const router = express.Router();
const {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} = require("../../controllers/AccountController");

// Crear cuenta
router.post("", createAccount);

// Obtener todas las cuentas
router.get("", getAccounts);

// Obtener una cuenta por ID
router.get("/:id", getAccountById);

// Actualizar cuenta
router.put("/:id", updateAccount);

// Eliminar cuenta
router.delete("/:id", deleteAccount);

module.exports = router;
