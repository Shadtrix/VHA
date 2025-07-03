import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, Lock } from '@mui/icons-material';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      password: yup.string().trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, 'Password must include at least 1 letter and 1 number'),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http.post("/user/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setUser(res.data.user);
          toast.success("Logged in successfully",{ autoClose: 3000 });
          navigate("/");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Login failed");
        });
    },
  });

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      
      <Box sx={{
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{
          width: '90%',
          maxWidth: '500px',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white'
        }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Welcome back
          </Typography>
          <Typography variant="body2" mb={3}>
            Please enter your details
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
                    <Person />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth margin="dense" label="Password" name="password" type="password"
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel control={<Checkbox size="small" />} label="Remember for 30 days" />
              <Link to="/forgot-password" style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>
                Forgot password
              </Link>
            </Box>

            <Button
              fullWidth variant="contained" type="submit"
              sx={{ mt: 2, backgroundColor: 'black', color: 'white', paddingY: 1.3 }}
            >
              SIGN IN
            </Button>

            <Typography variant="body2" align="center" mt={2}>
              Don’t have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'underline' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
          <ToastContainer />
        </Box>
      </Box>

      
      <Box sx={{
        width: '50%',
        display: { xs: 'none', md: 'block' },
        height: '100vh',
        overflow: 'hidden'
      }}>
        <img
          src="/src/public/Login.png"
          alt="Login Illustration"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>
    </Box>
  );
}

export default Login;
