import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sendContactEmail } from "./services/emailService.js";

dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/contact", async (req, res) => {
    try {
        const contactData = req.body;

        // Validación básica
        // if (!contactData.nombre || !contactData.email || !contactData.mensaje) {
        //     return res.status(400).json({ 
        //         success: false, 
        //         message: "Nombre, correo electrónico y mensaje son obligatorios" 
        //     });
        // }

        // Enviar el correo
        const result = await sendContactEmail(contactData);

        return res.status(200).json({
            success: true,
            message: "Mensaje enviado correctamente",
            data: result
        });
    } catch (error) {
        console.error("Error en la ruta /contact:", error);
        return res.status(500).json({
            success: false,
            message: "Error al enviar el mensaje",
            error: error.message
        });
    }
})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
