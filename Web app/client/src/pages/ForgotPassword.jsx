import { Box, TextField, Button, Typography, InputAdornment, CircularProgress } from '@mui/material';
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
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', code: '' },
    validationSchema: yup.object({
      email: yup.string().trim().email('Invalid email').required('Email is required'),
      code: yup.string().when('$codeSent', {
        is: true,
        then: (s) => s.required('Verification code is required'),
        otherwise: (s) => s.notRequired()
      })
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
            code: values.code.trim()
          });
          toast.success('Code verified');
          navigate('/reset-password', {
            state: { email, code: values.code.trim() }
          });
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Error occurred');
      } finally {
        setLoading(false);
      }
    }
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
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
            />

            {codeSent && (
              <TextField
                fullWidth margin="dense" name="code" label="Enter verification code"
                value={formik.values.code} onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                InputProps={{ startAdornment: <InputAdornment position="start"><Key /></InputAdornment> }}
              />
            )}

            <Button
              fullWidth variant="contained" type="submit" disabled={loading}
              sx={{ mt: 2, backgroundColor: 'black', color: 'white', py: 1.2 }}
            >
              {loading
                ? <CircularProgress size={22} sx={{ color: 'white' }} />
                : (codeSent ? 'Verify code' : 'Send verification code')}
            </Button>

            {codeSent && (
              <Button
                fullWidth variant="text" disabled={loading}
                sx={{ mt: 1 }}
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
