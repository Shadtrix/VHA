// src/pages/ForgotPassword.jsx
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import { Email, Key } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // focus the right field as the step changes
  useEffect(() => {
    const el = document.querySelector(codeSent ? 'input[name="code"]' : 'input[name="email"]');
    el?.focus();
  }, [codeSent]);

  const formik = useFormik({
    initialValues: { email: '', code: '' },
    validationSchema: yup.object({
      email: yup.string().trim().email('Invalid email').required('Email is required'),
      code: yup
        .string()
        .when('$codeSent', {
          is: true,
          then: (s) =>
            s
              .matches(/^\d{6}$/, 'Enter the 6-digit code')
              .required('Verification code is required'),
          otherwise: (s) => s.notRequired(),
        }),
    }),
    context: { codeSent },
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const email = values.email.trim().toLowerCase();

        if (!codeSent) {
          await http.post('/user/forgot-password', { email });
          toast.success('Verification code sent. Check your email.');
          setCodeSent(true);
        } else {
          await http.post('/user/verify-reset-code', {
            email,
            code: values.code.trim(),
          });
          toast.success('Code verified');
          navigate('/reset-password', {
            state: { email, code: values.code.trim() },
          });
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Error occurred');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
        // soft brandy background
        background:
          'linear-gradient(180deg, rgba(13,99,243,0.06) 0%, rgba(0,194,168,0.06) 100%)',
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="stretch">
          {/* Left: Illustration / Brand area (hidden on small) */}
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
                src="/forgot.png"           // if in /public
                alt="Forgot password illustration"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Grid>

          {/* Right: Card with form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                backdropFilter: 'saturate(140%) blur(6px)',
              }}
            >
              <Typography variant="h4" fontWeight={800}>
                Forgot password
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                {codeSent
                  ? 'Enter the 6-digit code we sent to your email.'
                  : 'Enter your account email and we’ll send you a verification code.'}
              </Typography>

              {/* Progress indicator */}
              <Stepper activeStep={codeSent ? 1 : 0} alternativeLabel sx={{ mb: 2 }}>
                <Step><StepLabel>Email</StepLabel></Step>
                <Step><StepLabel>Verify</StepLabel></Step>
              </Stepper>

              <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <TextField
                  fullWidth
                  margin="dense"
                  name="email"
                  label="Email address"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                {codeSent && (
                  <TextField
                    fullWidth
                    margin="dense"
                    name="code"
                    label="6-digit code"
                    value={formik.values.code}
                    onChange={(e) => {
                      // digits only, max 6
                      const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                      formik.setFieldValue('code', v);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.code && Boolean(formik.errors.code)}
                    helperText={(formik.touched.code && formik.errors.code) || 'Check your inbox (and spam).'}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Key />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {codeSent && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Didn’t get it? Click <strong>Resend code</strong> below, or try a different email.
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.3,
                    fontWeight: 800,
                    borderRadius: 3,
                    backgroundColor: 'black',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: 'white' }} />
                  ) : codeSent ? (
                    'Verify code'
                  ) : (
                    'Send verification code'
                  )}
                </Button>

                {codeSent && (
                  <Button
                    fullWidth
                    variant="text"
                    disabled={loading}
                    sx={{ mt: 1.5 }}
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const email = formik.values.email.trim().toLowerCase();
                        await http.post('/user/forgot-password', { email });
                        toast.success('Code re-sent');
                      } catch (e) {
                        toast.error(e?.response?.data?.message || 'Failed to resend code');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Resend code
                  </Button>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <MuiLink component={Link} to="/login" underline="hover">
                    Back to Login
                  </MuiLink>
                  <MuiLink component={Link} to="/register" underline="hover">
                    Create account
                  </MuiLink>
                </Box>
              </Box>
            </Paper>

          </Grid>
        </Grid>
      </Container>

      <ToastContainer position="bottom-right" />
    </Box>
  );
}

export default ForgotPassword;
