router.post("/upload", upload.single("pdf"), async (req, res) => {
  const connection = await db.getConnection(); // Para rollback si algo falla
  try {
    const { eventId } = req.body;

    if (!eventId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Debe proporcionar el ID del evento" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    // Verificar si ya tiene contrato asignado
    const [existing] = await connection.query(
      `SELECT e.EventName, e.ContractRoute, u.Email, u.Names
       FROM Events e
       JOIN User u ON e.ClientId = u.UserId
       WHERE e.EventId = ?`,
      [eventId]
    );

    if (!existing.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // 🚫 Si ya tiene contrato, no se guarda ni reenvía
    if (existing[0].ContractRoute) {
      fs.unlinkSync(req.file.path); // eliminar archivo subido
      return res.status(400).json({
        error: "El contrato ya fue asignado a este evento. No se puede reemplazar.",
      });
    }

    // ✅ Generar ruta y número
    const contractNumber = Math.floor(100000 + Math.random() * 900000);
    const contractUrl = `/uploads/contracts/${req.file.filename}`;

    await connection.beginTransaction();

    // Guardar contrato en la base
    await connection.query(
      `UPDATE Events 
       SET ContractRoute = ?, ContractNumber = ?
       WHERE EventId = ?`,
      [contractUrl, contractNumber, eventId]
    );

    // === Enviar correo al cliente ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER || "tucorreo@gmail.com",
        pass: process.env.MAIL_PASS || "tu_contraseña_de_aplicacion",
      },
    });

    const mailOptions = {
      from: `Equipo de Eventos <${process.env.MAIL_USER || "tucorreo@gmail.com"}>`,
      to: existing[0].Email,
      subject: `Contrato del evento "${existing[0].EventName}" - Código ${contractNumber}`,
      text: `Hola ${existing[0].Names},\n\nAdjuntamos el contrato correspondiente a su evento "${existing[0].EventName}".\n\nPuede acceder al documento en: ${contractUrl}\n\nSaludos,\nEquipo de Eventos.`,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    await connection.commit();

    res.json({
      success: true,
      message: "Contrato subido y enviado correctamente",
      data: {
        eventId,
        eventName: existing[0].EventName,
        userName: existing[0].Names,
        contractNumber,
        contractUrl,
        emailSentTo: existing[0].Email,
      },
    });
  } catch (error) {
    console.error("Error al subir contrato:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); // limpia si falla
    await connection.rollback();
    res.status(500).json({ error: "Error interno al subir o enviar contrato" });
  } finally {
    connection.release();
  }
});
