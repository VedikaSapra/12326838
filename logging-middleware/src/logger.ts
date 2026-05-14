import axios from "axios";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

let AUTH_TOKEN = "";

/**
 * Set token after authentication
 */
export const setAuthToken = (token: string) => {
  AUTH_TOKEN = token;
};

/**
 * Reusable logging function
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
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      }
    );

    console.log("Log Created:", response.data);

  } catch (error: any) {

    console.error(
      "Logging Failed:",
      error?.response?.data || error.message
    );
  }
};