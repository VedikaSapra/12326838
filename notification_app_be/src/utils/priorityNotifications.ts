import axios from "axios";

type Notification = {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
};

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2ZWRpa2EuMTIzMjY4MzhAbHB1LmluIiwiZXhwIjoxNzc4NzYyOTIyLCJpYXQiOjE3Nzg3NjIwMjIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlYjkzODU2OC1jY2Y1LTQzMzgtODRjMy04ZTlkOGY5NjdmMzYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ2ZWRpa2EiLCJzdWIiOiJlZTJmZDU1Ny03ODQ2LTQ2Y2YtYTQ3OS04NzcyMGU1NGMwNmMifSwiZW1haWwiOiJ2ZWRpa2EuMTIzMjY4MzhAbHB1LmluIiwibmFtZSI6InZlZGlrYSIsInJvbGxObyI6IjEyMzI2ODM4IiwiYWNjZXNzQ29kZSI6IlRSdlpXcSIsImNsaWVudElEIjoiZWUyZmQ1NTctNzg0Ni00NmNmLWE0NzktODc3MjBlNTRjMDZjIiwiY2xpZW50U2VjcmV0IjoiYUp4UnRDa0JEU1VIY2tGdyJ9.LqoMJ0TlzZxRCvjUUSQZ9fDNbGPxtarJxFlnQpBhMbM";

const API =
  "http://4.224.186.213/evaluation-service/notifications";

const getPriorityScore = (
  notification: Notification
) => {

  const weight =
    TYPE_WEIGHT[notification.Type];

  const time =
    new Date(
      notification.Timestamp
    ).getTime();

  return (
    weight * 10000000000000 + time
  );
};

const fetchNotifications =
async (): Promise<Notification[]> => {

  const response =
    await axios.get(API, {
      headers: {
        Authorization:
          `Bearer ${ACCESS_TOKEN}`
      }
    });

  return response.data.notifications;
};

const getTopNotifications =
async () => {

  try {

    const notifications =
      await fetchNotifications();

    const sorted =
      notifications.sort((a, b) => {

        return (
          getPriorityScore(b) -
          getPriorityScore(a)
        );
      });

    const top10 =
      sorted.slice(0, 10);

    console.log(
      "\nTOP 10 PRIORITY NOTIFICATIONS\n"
    );

    top10.forEach((n, index) => {

      console.log(
        `${index + 1}. [${n.Type}] ${n.Message} (${n.Timestamp})`
      );
    });

  } catch (error) {

    console.error(
      "ERROR FETCHING NOTIFICATIONS",
      error
    );
  }
};

getTopNotifications();