require('dotenv').config();
// const { sendEventCompletedEmail } = require('./services/emailService');
const { sendPasswordResetEmail } = require("./services/emailService");

const testEmail = async () => {

  /* Prueba de envío de email al completar evento
  const fakeEvent = {
    EventName: 'Evento de Prueba',
    EventDateTime: new Date(),
    Address: 'Calle 123',
    Capacity: 50
  };

  const fakeUser = {
    Email: 'diegopandi9@gmail.com', // usuario de prueba
    Names: 'Usuario Prueba'
  };

  const sent = await sendEventCompletedEmail(fakeEvent, fakeUser);
  */

  // Prueba de envío de email con código de recuperación de contraseña
  const fakeCode = 1234; // código de prueba
  const fakeUser = 'apilogisticaeventos@gmail.com'
  const sent = await sendPasswordResetEmail(fakeUser, fakeCode);

  console.log(sent ? 'Email enviado' : 'Error al enviar');
  process.exit();
};

testEmail();