import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import projectRouter from "./routers/projectRouter.js";
import pageRouter from "./routers/pageRouter.js";
import userStoryRouter from "./routers/userStoryRouter.js";
import backendResourceRouter from "./routers/backendResourceRouter.js";
import sectionRouter from "./routers/sectionRouter.js";
import roleRouter from "./routers/roleRouter.js";
import techRouter from "./routers/techRouter.js";
import componentRouter from "./routers/componentRouter.js";
import dataModelRouter from "./routers/dataModelRouter.js";
import pageComponentRouter from "./routers/pageComponentRouter.js";
import frontendResourceRouter from "./routers/frontendResourceRouter.js";
import frontendStackRouter from "./routers/frontendStackRouter.js";
import backendStackRouter from "./routers/backendStackRouter.js";
import componentSectionRouter from "./routers/componentSectionRouter.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many requests from this IP address. Please try again in an hour.",
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173" // Your Vite frontend
        : process.env.FRONTEND_URL,
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json());

app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/user`, userRouter);
app.use(`/api/v1/project`, projectRouter);
app.use(`/api/v1/role`, roleRouter);
app.use(`/api/v1/tech`, techRouter);
app.use(`/api/v1/page`, pageRouter);
app.use(`/api/v1/user-story`, userStoryRouter);
app.use(`/api/v1/component`, componentRouter);
app.use(`/api/v1/data-model`, dataModelRouter);
app.use(`/api/v1/backend-resource`, backendResourceRouter);
app.use(`/api/v1/section`, sectionRouter);
app.use(`/api/v1/frontend-resource`, frontendResourceRouter);
app.use(`/api/v1/frontend-stack`, frontendStackRouter);
app.use(`/api/v1/backend-stack`, backendStackRouter);

//NOTE: Join routes:
app.use(`/api/v1/page-component`, pageComponentRouter);
app.use(`/api/v1/component-section`, componentSectionRouter);

app.all("*", (req, res, next) => {
  const error = new AppError(
    `No service was found at ${req.originalUrl} on this server!`,
    404,
  );

  next(error);
});

app.use(globalErrorHandler);

export default app;
