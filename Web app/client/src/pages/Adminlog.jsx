// src/pages/Adminlog.jsx
import { useState, useContext, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, InputAdornment, IconButton, Divider, CircularProgress, Link as MuiLink } from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Adminlog() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: yup.object({
      email: yup.string().trim().email('Invalid email').required('Email is required'),
      password: yup.string().min(8, 'Min 8 characters').required('Password is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        helpers.setSubmitting(true);
        const payload = {
          email: values.email.trim().toLowerCase(),
          password: values.password.trim(),
        };
        const res = await http.post('/user/login', payload);

        if (res.data.user.role !== 'admin') {
          throw { response: { data: { message: 'Access denied. Not an admin.' } } };
        }

        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate('/admin', { replace: true });
      } catch (err) {
        const msg = err?.response?.data?.message || 'Login failed';
        helpers.setStatus(msg);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h5" fontWeight={800} textAlign="center" gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Sign in with an admin account to access the dashboard.
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="dense"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
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
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formik.status && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {formik.status}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting}
              sx={{ mt: 2, backgroundColor: 'black', color: 'white', py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              {formik.isSubmitting ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Login'}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <MuiLink component={Link} to="/home" underline="hover">
                Back to Home
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Adminlog;
