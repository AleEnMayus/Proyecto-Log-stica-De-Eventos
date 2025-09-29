// Crear archivo test-email.js en la raíz del proyecto
require('dotenv').config();
const { sendEventCompletedEmail } = require('./services/emailService');

const testEmail = async () => {
  const fakeEvent = {
    EventName: 'Evento de Prueba',
    EventDateTime: new Date(),
    Address: 'Calle 123',
    Capacity: 50
  };

  const fakeUser = {
    Email: 'diegopandi9@gmail.com', // CAMBIA ESTO
    Names: 'Usuario Prueba'
  };

  const sent = await sendEventCompletedEmail(fakeEvent, fakeUser);
  console.log(sent ? 'Email enviado' : 'Error al enviar');
  process.exit();
};

testEmail();