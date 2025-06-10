import express from "express"
import dotenv from "dotenv"
import cors from "cors";

import contactRoutes from "./routes/contactRoutes.js"
import workshopRoutes from "./routes/workshopRoutes.js"
import webhookRoutes from "./routes/webhookRoutes.js"
dotenv.config();

const app = express();
const port = process.env.PORT||5000


app.use('/api/v1/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Replace with your allowed origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/api/v1/contact",contactRoutes)
app.use("/api/v1/workshop",workshopRoutes)


app.get('/', (req,res) => {
  res.send('Hello from TypeScript + Express!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
