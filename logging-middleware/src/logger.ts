import axios from "axios";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

let AUTH_TOKEN = "";

/**
 * Store Bearer Token
 */
export const setAuthToken = (token: string) => {
  AUTH_TOKEN = token;
};

/**
 * Reusable Logging Function
 */
export const Log = async (
  stack: "backend" | "frontend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  packageName:
    | "cache"
    | "controller"
    | "cron_job"
    | "domain"
    | "handler"
    | "repository"
    | "route"
    | "service"
    | "auth"
    | "config"
    | "middleware"
    | "utils"
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style",
  message: string
) => {
  try {

    if (!AUTH_TOKEN) {
      console.error("AUTH TOKEN NOT SET");
      return;
    }

    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("LOG CREATED:", response.data);

  } catch (error: any) {

    console.error(
      "LOGGING FAILED:",
      error?.response?.data || error.message
    );
  }
};