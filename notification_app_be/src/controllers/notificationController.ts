import { Request, Response } from "express";

import {
  Log,
  setAuthToken
} from "logging-middleware";

/**
 * SET YOUR TOKEN HERE
 */
setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2ZWRpa2EuMTIzMjY4MzhAbHB1LmluIiwiZXhwIjoxNzc4NzYxMDU4LCJpYXQiOjE3Nzg3NjAxNTgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJkMjNhY2VmMy05NDkyLTQ3M2YtYTg1NC04MjEwMzkyM2MxODkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ2ZWRpa2EiLCJzdWIiOiJlZTJmZDU1Ny03ODQ2LTQ2Y2YtYTQ3OS04NzcyMGU1NGMwNmMifSwiZW1haWwiOiJ2ZWRpa2EuMTIzMjY4MzhAbHB1LmluIiwibmFtZSI6InZlZGlrYSIsInJvbGxObyI6IjEyMzI2ODM4IiwiYWNjZXNzQ29kZSI6IlRSdlpXcSIsImNsaWVudElEIjoiZWUyZmQ1NTctNzg0Ni00NmNmLWE0NzktODc3MjBlNTRjMDZjIiwiY2xpZW50U2VjcmV0IjoiYUp4UnRDa0JEU1VIY2tGdyJ9.hFPS3TEOJEbTKg9S3L-OO3RYMdHB3-J69SvL5VoAJlg");

export const sendNotification = async (
  req: Request,
  res: Response
) => {

  try {

    await Log(
      "backend",
      "info",
      "controller",
      "Notification API called"
    );

    const { message } = req.body;

    if (!message) {

      await Log(
        "backend",
        "error",
        "handler",
        "Message field missing"
      );

      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    await Log(
      "backend",
      "info",
      "service",
      `Notification processed: ${message}`
    );

    res.status(200).json({
      success: true,
      message: "Notification sent successfully"
    });

  } catch (error) {

    await Log(
      "backend",
      "fatal",
      "controller",
      "Unhandled controller error"
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};