import { useEffect, useState }
from "react";

import axios from "axios";

import {
  Container,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select
} from "@mui/material";

type Notification = {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
};

function App() {

  const [notifications,
    setNotifications] = useState<
      Notification[]
    >([]);

  const [filter,
    setFilter] =
    useState("All");

  useEffect(() => {

    fetchNotifications();

  }, [filter]);

  const fetchNotifications =
  async () => {

    try {

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2ZWRpa2EuMTIzMjY4MzhAbHB1LmluIiwiZXhwIjoxNzc4NzYzODgyLCJpYXQiOjE3Nzg3NjI5ODIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4NDc2MTk1MC1jYWM0LTQ4MjgtYTA4OC0xZmUyOTk3ZWUyM2IiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ2ZWRpa2EiLCJzdWIiOiJlZTJmZDU1Ny03ODQ2LTQ2Y2YtYTQ3OS04NzcyMGU1NGMwNmMifSwiZW1haWwiOiJ2ZWRpa2EuMTIzMjY4MzhAbHB1LmluIiwibmFtZSI6InZlZGlrYSIsInJvbGxObyI6IjEyMzI2ODM4IiwiYWNjZXNzQ29kZSI6IlRSdlpXcSIsImNsaWVudElEIjoiZWUyZmQ1NTctNzg0Ni00NmNmLWE0NzktODc3MjBlNTRjMDZjIiwiY2xpZW50U2VjcmV0IjoiYUp4UnRDa0JEU1VIY2tGdyJ9.kBNYtq-JJWO4BrwUlYd-IuyOI1u4t_PH-TMALON3u2c";

      let url =
        "http://4.224.186.213/evaluation-service/notifications";

      if (filter !== "All") {

        url +=
          `?notification_type=${filter}`;
      }

      const response =
        await axios.get(url, {

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        });

      setNotifications(
        response.data.notifications
      );

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <Container
      maxWidth="md"
      style={{ marginTop: "40px" }}
    >

      <Typography
        variant="h4"
        gutterBottom
      >
        Notification Dashboard
      </Typography>

      <Select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
        fullWidth
      >

        <MenuItem value="All">
          All
        </MenuItem>

        <MenuItem value="Placement">
          Placement
        </MenuItem>

        <MenuItem value="Result">
          Result
        </MenuItem>

        <MenuItem value="Event">
          Event
        </MenuItem>

      </Select>

      {notifications.map((n) => (

        <Card
          key={n.ID}
          style={{
            marginTop: "20px"
          }}
        >

          <CardContent>

            <Typography
              variant="h6"
            >
              {n.Type}
            </Typography>

            <Typography>
              {n.Message}
            </Typography>

            <Typography
              variant="body2"
            >
              {n.Timestamp}
            </Typography>

          </CardContent>

        </Card>
      ))}

    </Container>
  );
}

export default App;