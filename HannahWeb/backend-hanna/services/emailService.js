import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Crear el transporter de nodemailer con la configuración del .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // No fallar en certificados inválidos
    rejectUnauthorized: false,
    // Forzar la versión de TLS a 1.2 (más compatible)
    minVersion: 'TLSv1.2'
  }
});

/**
 * Envía un correo electrónico de contacto
 * @param {Object} contactData - Datos del formulario de contacto
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendContactEmail = async (contactData) => {
  const { nombre, email, telefono, empresa, servicio, mensaje } = contactData;
  
  // Configuración del correo
  const mailOptions = {
    from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
    subject: `Nuevo mensaje de contacto: ${servicio || 'Consulta general'}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo electrónico:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      ${empresa ? `<p><strong>Empresa:</strong> ${empresa}</p>` : ''}
      ${servicio ? `<p><strong>Servicio de interés:</strong> ${servicio}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `,
    // Opcional: Enviar una copia al remitente
    replyTo: email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
