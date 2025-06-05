// import express, { Request, Response } from 'express';
// import dotenv from "dotenv"

// import contactRoutes from "./routes/contactRoutes"
// dotenv.config();

// const app = express();
// const port = process.env.PORT||5000

// app.use(express.json());

// app.use("/api/v1/contact",contactRoutes)

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from TypeScript + Express!');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package
import contactRoutes from "./routes/contactRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
console.log(port, "port");

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your allowed origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/v1/contact", contactRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
