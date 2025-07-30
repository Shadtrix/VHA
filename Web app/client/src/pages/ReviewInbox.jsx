import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Collapse, Badge, Button } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

const ReviewInbox = () => {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3001/api/reviews/moderation-log").then(res => {
      // Check if inbox has been marked as read in localStorage
      const markedRead = localStorage.getItem("inboxMarkedRead");
      if (markedRead === "true") {
        setLogs([]); // Hide badge
      } else {
        setLogs(res.data);
      }
    });
  }, []);

  const handleMarkAsRead = () => {
    setLogs([]);
    localStorage.setItem("inboxMarkedRead", "true");
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          mb: 1,
        }}
      >
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          color={open ? "primary" : "default"}
          sx={{ mr: 1 }}
        >
          <Badge
            color="error"
            badgeContent={logs.length > 0 ? logs.length : null}
            invisible={logs.length === 0}
          >
            <MailIcon />
          </Badge>
        </IconButton>
        <Typography
          variant="h6"
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            fontWeight: 600,
            letterSpacing: 0.5,
            color: open ? "primary.main" : "text.primary",
            transition: "color 0.2s",
          }}
        >
          Inbox
        </Typography>
      </Box>
      <Collapse in={open}>
        <Box
          sx={{
            maxHeight: 300,
            minHeight: 100,
            width: 340,
            overflowY: "auto",
            mt: 1,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onClick={handleMarkAsRead}
            disabled={logs.length === 0}
          >
            Mark as Read
          </Button>
          {logs.length === 0 ? (
            <Typography sx={{ mt: 1, color: "#888", textAlign: "center" }}>
              No moderation messages.
            </Typography>
          ) : (
            logs.map(log => (
              <Box
                key={log.id}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  border: "1px solid #d1d5db",
                  borderRadius: 2,
                  background: "#f5f7fa",
                  fontSize: "0.97rem",
                  boxShadow: 1,
                }}
              >
                <Typography sx={{ fontWeight: 500, color: "#1976d2" }}>
                  Review ID: {log.reviewId}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  <span style={{ fontWeight: 500 }}>Reason:</span> {log.reason}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ReviewInbox;