import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Stack,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box>

      {/* ===== Hero with background image ===== */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 360, md: 460 },
          // Vite-safe public path (works in dev and when deployed under a subpath)
          backgroundImage: `url(${import.meta.env.BASE_URL}backgroundimg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 8, md: 10 },
          px: 2
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)'
          }}
        />

        {/* Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Engineering safety & compliance, done right.
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 900, mx: 'auto', mb: 3 }}>
            VHA delivers Fire Safety, MEP Engineering, and Annual Fire Certification services
            with precision, speed, and audit-ready documentation.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/registeredinspectorservices"
            >
              Get a quote
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              component={Link}
              to="/firesafetyengineering"
              sx={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              Learn more
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ===== Trust / Stats ===== */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700}>10+ yrs</Typography>
                <Typography color="text.secondary">
                  of combined engineering experience across industrial, commercial & residential sites
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700}>Fast</Typography>
                <Typography color="text.secondary">
                  Clear timelines, proactive updates, and on-time submissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700}>Audit-ready</Typography>
                <Typography color="text.secondary">
                  Documentation aligned with Singapore codes & regulatory requirements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* ===== Services Overview ===== */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          Our Services
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          End-to-end engineering services tailored to your building’s lifecycle.
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'MEP Engineering',
              desc: 'Mechanical, Electrical & Plumbing design, review, and compliance checks.',
              link: '/mechanicalelectricalplumbing'
            },
            {
              title: 'Fire Safety Engineering',
              desc: 'Performance-based solutions, design verification, and code compliance.',
              link: '/firesafetyengineering'
            },
            {
              title: 'Annual Fire Certification',
              desc: 'AFC planning, inspections, rectifications, and submission support.',
              link: '/annualfirecertification'
            },
            {
              title: 'Registered Inspector Services',
              desc: 'Independent checks, reports, and certification to regulatory standards.',
              link: '/registeredinspectorservices'
            }
          ].map((service, i) => (
            <Grid item xs={12} md={6} lg={3} key={i}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .2s ease, box-shadow .2s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={700}>{service.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {service.desc}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button fullWidth component={Link} to={service.link} variant="outlined">
                    View details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* ===== CTA / Contact ===== */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={700}>
              Need help with your next submission or audit?
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Talk to us about timelines, scope, and required documentation. We’ll guide you through the process.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/registeredinspectorservices"
              >
                Speak to an Engineer
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/reviews"
              >
                See testimonials
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
