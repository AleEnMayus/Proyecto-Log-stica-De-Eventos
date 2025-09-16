// routes/password.routes.js
import { Router } from "express";
import { changePassword } from "../../controllers/PasswordChange.js";

const router = Router();

// Route for changing password from profile
router.put("/:idUsuario/change-password", changePassword);

export default router;