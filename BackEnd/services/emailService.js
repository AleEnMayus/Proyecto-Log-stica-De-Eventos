const nodemailer = require('nodemailer');
const eventCompletedTemplate = require('./templates/eventCompleted');
const passwordResetTemplate = require('./templates/resetPassword');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar email al completar un evento
const sendEventCompletedEmail = async (event, user) => {
  const surveyLink = `http://localhost:5173/Survey/${event.EventId}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.Email,
    subject: `Tu evento "${event.EventName}" ha sido completado`,
    html: eventCompletedTemplate(event, user, surveyLink)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado a ${user.Email}`);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

// Enviar email con código de recuperación de contraseña
const sendPasswordResetEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Código de recuperación de contraseña ${code}`,
    html: passwordResetTemplate(code)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de recuperación enviado a ${email}`);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

module.exports = { 
  sendEventCompletedEmail,
  sendPasswordResetEmail 
};