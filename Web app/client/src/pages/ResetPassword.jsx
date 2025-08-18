// src/pages/ResetPassword.jsx
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

function strengthScore(pw) {
  let score = 0;
  if (pw.length >= 8) score += 30;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 25;
  if (/\d/.test(pw)) score += 20;
  if (/[^A-Za-z0-9]/.test(pw)) score += 15;
  if (pw.length >= 12) score += 10;
  return Math.min(score, 100);
}

function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email?.trim().toLowerCase();
  const code = state?.code?.trim();

  // If user navigates here directly without context, bounce them back.
  if (!email || !code) return <Navigate to="/forgot-password" replace />;

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const validation = yup.object({
    password: yup
      .string()
      .trim()
      .required('Enter a new password')
      .min(8, 'Use at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Must include letters and numbers'),
    confirmPassword: yup
      .string()
      .required('Confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: validation,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await http.post('/user/reset-password', {
          email,
          code,
          newPassword: values.password.trim(),
        });
        toast.success('Password reset successful');
        setTimeout(() => navigate('/login', { replace: true }), 1000);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Reset failed');
      }
    },
  });

  const score = useMemo(() => strengthScore(formik.values.password), [formik.values.password]);
  const barColor = score < 40 ? 'error' : score < 70 ? 'warning' : 'success';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
        background:
          'linear-gradient(180deg, rgba(13,99,243,0.06) 0%, rgba(0,194,168,0.06) 100%)',
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="stretch">
          {/* Left: Illustration */}
          <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                height: '100%',
                minHeight: 520,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'background.paper',
                boxShadow: 6,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(800px 400px at -10% -10%, rgba(0,194,168,.25), transparent 60%), radial-gradient(800px 400px at 110% -10%, rgba(13,99,243,.25), transparent 60%)',
                }}
              />
              <Box
                component="img"
                src="/reset.png"   // put reset.png in /public
                alt="Reset Illustration"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Grid>

          {/* Right: Form card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={8} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
              <Typography variant="h4" fontWeight={800}>
                Reset password
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                You’re resetting the password for <strong>{email}</strong>.
              </Typography>

              <Stepper activeStep={1} alternativeLabel sx={{ mb: 2 }}>
                <Step><StepLabel>Verify</StepLabel></Step>
                <Step><StepLabel>Reset</StepLabel></Step>
              </Stepper>

              <Alert severity="info" sx={{ mb: 2 }}>
                Tip: use at least 8 characters with a mix of uppercase, lowercase, numbers, and a symbol.
              </Alert>

              <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <TextField
                  fullWidth
                  margin="dense"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  label="New password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw((v) => !v)} edge="end">
                          {showPw ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* strength meter */}
                <Box sx={{ mt: 1, mb: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    color={barColor}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Strength: {score < 40 ? 'Weak' : score < 70 ? 'Okay' : 'Strong'}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  margin="dense"
                  name="confirmPassword"
                  type={showPw2 ? 'text' : 'password'}
                  label="Confirm new password"
                  autoComplete="new-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw2((v) => !v)} edge="end">
                          {showPw2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, py: 1.3, fontWeight: 800, borderRadius: 3, backgroundColor: 'black' }}
                >
                  Reset password
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <MuiLink component={Link} to="/forgot-password" underline="hover">
                    Back to verification
                  </MuiLink>
                  <MuiLink component={Link} to="/login" underline="hover">
                    Go to login
                  </MuiLink>
                </Box>
              </Box>
            </Paper>

          </Grid>
        </Grid>

        <ToastContainer position="bottom-right" />
      </Container>
    </Box>
  );
}

export default ResetPassword;
