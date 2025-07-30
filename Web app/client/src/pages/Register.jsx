import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, Lock, Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { generateAIPassword } from '../utils/generatePassword';
import { useState } from 'react';
import { getAIRole } from '../utils/getAIRole';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    onSubmit: async (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();

      // Get role from GenAI
      const aiRole = await getAIRole(data.email);
      console.log("Claude role response:", aiRole); // <-- add this line
      data.role = aiRole || "user";
      console.log("Sending role from Claude:", data.role);
      http.post("/user/register", data)
        .then(() => navigate("/login"))
        .catch(err => {
          toast.error(err?.response?.data?.message || "Registration failed");
        });
    }
  });

  const handleSuggestPassword = async () => {
    try {
      let aiPassword = null;
      let attempts = 0;

      while (attempts < 3) {
        const generated = await generateAIPassword();
        if (!generated) break;

        const trimmed = generated.trim().slice(0, 50);
        const hasLetter = /[a-zA-Z]/.test(trimmed);
        const hasNumber = /[0-9]/.test(trimmed);

        if (hasLetter && hasNumber) {
          aiPassword = trimmed;
          break;
        }

        attempts++;
      }

      if (!aiPassword) {
        toast.error("AI failed to generate a valid password after 3 tries.");
        return;
      }

      formik.setFieldValue("password", aiPassword);
      formik.setFieldValue("confirmPassword", aiPassword);
      toast.info("AI-suggested password inserted.");
    } catch (err) {
      toast.error("Failed to generate password");
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      height: 'auto',
      width: '100%',
      overflow: 'visible',
      backgroundColor: '#f9f9f9'
    }}>
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

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
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
            fullWidth margin="dense" label="Password"
            type={showPassword ? "text" : "password"} name="password"
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
                <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth margin="dense" label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
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
                <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              )
            }}
          />

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            onClick={handleSuggestPassword}
          >
            Suggest Secure Password (AI)
          </Button>

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
      </Box>

      <Box sx={{
        width: '50%',
        flexShrink: 1,
        display: { xs: 'none', md: 'block' },
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <img
          src="/src/public/Register.png"
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
