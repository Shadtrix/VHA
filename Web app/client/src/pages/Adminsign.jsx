import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, Lock, Email } from '@mui/icons-material';

function Adminsign() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: yup.object({
      name: yup.string().trim().min(3).required('Name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      data.role = "admin";
      data.roleKey = "69420";
      http.post('/user/register', data)
        .then(() => {
          toast.success('Admin registered successfully');
          navigate('/admin/login');
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Registration failed');
        });
    }
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          width: '50%',
          maxWidth: 500,
          m: 'auto',
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white'
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Admin Sign Up
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            name="name"
            margin="dense"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="dense"
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
              )
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="dense"
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
              )
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            margin="dense"
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
              )
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, backgroundColor: 'black' }}
          >
            Register
          </Button>
          <Typography mt={2} align="center">
            Already an admin? <Link to="/admin/login">Sign in</Link>
          </Typography>
        </Box>
        <ToastContainer />
      </Box>
    </Box>
  );
}

export default Adminsign;
