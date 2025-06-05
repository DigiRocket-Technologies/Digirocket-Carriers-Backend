import express, { Request, Response } from 'express';
import dotenv from "dotenv"

import contactRoutes from "./routes/contactRoutes"
dotenv.config();

const app = express();
const port = process.env.PORT||5000

app.use(express.json());


app.use("/api/v1/contact",contactRoutes)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
