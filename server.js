import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/", router);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => console.log(`server is now running port: ${port}`));
