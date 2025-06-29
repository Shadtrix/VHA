import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, Lock, Email } from '@mui/icons-material';

function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: yup.object({
      name: yup.string().trim()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters')
        .required('Name is required')
        .matches(/^[a-zA-Z '-,.]+$/, "Name only allow letters, spaces and characters: ' - , ."),
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      password: yup.string().trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must include at least 1 letter and 1 number"),
      confirmPassword: yup.string().trim()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http.post("/user/register", data)
        .then(() => navigate("/login"))
        .catch(err => {
          toast.error(err?.response?.data?.message || "Registration failed");
        });
    }
  });

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f9f9f9'
    }}>
      {/* Left Side - Form */}
      <Box sx={{
        width: '50%',
        maxWidth: '500px',
        margin: 'auto',
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Sign up now
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth margin="dense" label="Name" name="name"
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
              ),
            }}
          />
          <TextField
            fullWidth margin="dense" label="Email address" name="email"
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
          <TextField
            fullWidth margin="dense" label="Password" type="password" name="password"
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
            }}
          />
          <TextField
            fullWidth margin="dense" label="Confirm Password" type="password" name="confirmPassword"
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
            }}
          />
          <Button
            fullWidth variant="contained" type="submit"
            sx={{ mt: 1.5, backgroundColor: 'black', color: 'white' }}
          >
            Sign up
          </Button>
          <Typography variant="body2" mt={1.5} align="center">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'underline' }}>
              Sign in
            </Link>
          </Typography>
        </Box>

        {/* Hidden Admin Access */}
        <Box mt={2} textAlign="center">
          <Button
            size="small"
            variant="text"
            onClick={() => {
              const secret = prompt("Enter admin access code:");
              if (secret === "69420") {
                navigate("/admin/register");
              } else if (secret !== null) {
                toast.error("Incorrect access code.");
              }
            }}
          >
            Admin access
          </Button>
        </Box>

        <ToastContainer />
      </Box>

      {/* Right Side - Image */}
      <Box sx={{
        width: '50%',
        display: { xs: 'none', md: 'block' },
        textAlign: 'center'
      }}>
        <img
          src="/src/public/"
          alt="Signup Illustration"
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            verticalAlign: 'middle'
          }}
        />
      </Box>
    </Box>
  );
}

export default Register;
