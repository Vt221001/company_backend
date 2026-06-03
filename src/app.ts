import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./Routes/UserRoute";
import { jobRouter } from "./Routes/JobRoute";
import { blogRouter } from "./Routes/BlogRoute";


const app: Application = express();

// Whitelist of allowed origins
const whitelist: (string | RegExp)[] = [
  "https://mainpage.vedanshtiwari.tech",
  "http://localhost:5174",
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5174$/,
];

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (
      !origin ||
      whitelist.some((allowedOrigin) =>
        allowedOrigin instanceof RegExp
          ? allowedOrigin.test(origin)
          : allowedOrigin === origin
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

app.use(bodyParser.json());

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to our Company Backend");
});

app.use(
  "/uploads",
  express.static("public/uploads")
);

app.use("/api/v1/blogs", blogRouter);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobRouter);



// Global error handling middleware
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const statusCode = err.statusCode || 500;

    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      error: message,
    });
  }
);

export { app };