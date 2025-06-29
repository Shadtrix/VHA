import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { Email, Key } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      code: '',
    },
    validationSchema: yup.object({
      email: yup.string().trim().email('Invalid email').required('Email is required'),
      code: yup.string().when('codeSent', {
        is: true,
        then: yup.string().required('Verification code is required'),
      }),
    }),
    onSubmit: async (values) => {
      try {
        if (!codeSent) {
          await http.post('/user/forgot-password', { email: values.email });
          toast.success('Verification code sent to your email');
          setCodeSent(true);
        } else {
          navigate('/reset-password', { state: { email: values.email, code: values.code } });
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Error occurred');
      }
    },
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      {/* Left side */}
      <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '80%', maxWidth: 400 }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>Forgot password</Typography>
          <Typography variant="body2" mb={2}>Enter your email address:</Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth margin="dense" name="email" label="Enter your email address"
              value={formik.values.email} onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email /></InputAdornment>,
              }}
            />

            {codeSent && (
              <TextField
                fullWidth margin="dense" name="code" label="Enter verification code"
                value={formik.values.code} onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Key /></InputAdornment>,
                }}
              />
            )}

            <Button
              fullWidth variant="contained" type="submit"
              sx={{ mt: 2, backgroundColor: 'black', color: 'white', py: 1.2 }}
            >
              {codeSent ? 'Forgot password' : 'Send verification code'}
            </Button>
          </form>
          <ToastContainer />
        </Box>
      </Box>

      {/* Right side */}
      <Box sx={{ width: '50%', display: { xs: 'none', md: 'block' } }}>
        <img
          src="/src/public/forgot.png"
          alt="Forgot Illustration"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
}

export default ForgotPassword;
