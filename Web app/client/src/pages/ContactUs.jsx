import { Box, Container, Grid, Card, CardContent, Typography, Button, Link, Stack } from "@mui/material";

const MAP_Q = encodeURIComponent("17 Kaki Bukit Place, #04-01, Singapore 416195");
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_Q}&z=16&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_Q}`;

export default function ContactUs() {
  return (
    <Box>

      {/* FULL-BLEED HERO (breaks out of the parent Container) */}
      <Box
        component="section"
        sx={{
          position: "relative",
          left: "50%",
          right: "50%",
          ml: "-50vw",
          mr: "-50vw",
          width: "100vw",
          py: { xs: 6, md: 8 },
          textAlign: "center",
          background:
            "radial-gradient(1000px 500px at 10% -10%, rgba(0,194,168,.20), transparent 60%)," +
            "radial-gradient(1000px 500px at 90% -10%, rgba(13,99,243,.20), transparent 60%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight={800}>Contact us</Typography>
        </Container>
      </Box>

      {/* CONTENT (kept within normal page width) */}
      <Container sx={{ py: 4 }}>
        <Grid container spacing={3} alignItems="stretch">
          {/* Map */}
          <Grid item xs={12} md={7}>
            <Card sx={{ height: "100%" }}>
              <Box sx={{ position: "relative", pt: "62%", borderRadius: 2, overflow: "hidden" }}>
                <iframe
                  title="VHA Consultants Map"
                  src={MAP_EMBED}
                  loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
              <Box sx={{ p: 2 }}>
                <Button href={MAP_DIRECTIONS} target="_blank" rel="noreferrer" variant="outlined">
                  Open in Google Maps
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Address / Details */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  VHA Consultants Pte Ltd
                </Typography>

                <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">Contacts</Typography>
                    <Link href="mailto:vhaconsultantsengineering@vha.com" underline="hover">
                      vhaconsultantsengineering@vha.com
                    </Link>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
