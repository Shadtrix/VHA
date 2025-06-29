import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;
    const code = state?.code;

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: yup.object({
            password: yup.string().trim().required('Enter new password')
                .min(8, 'Password too short')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, 'Must contain letters & numbers'),
            confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password')
        }),
        onSubmit: async (values) => {
            try {
                await http.post('/user/reset-password', {
                    email: email.trim().toLowerCase(),
                    code: code.trim(),
                    newPassword: values.password.trim()
                });

                toast.success('Password reset successful');
                setTimeout(() => navigate('/login'), 1500);
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Reset failed');
            }
        }
    });

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
            {/* Left side */}
            <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: '80%', maxWidth: 400 }}>
                    <Typography variant="h4" fontWeight="bold" mb={2}>Reset password</Typography>

                    <form onSubmit={formik.handleSubmit} noValidate>
                        <TextField
                            fullWidth margin="dense" name="password" label="Enter your password" type="password"
                            value={formik.values.password} onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                            }}
                        />

                        <TextField
                            fullWidth margin="dense" name="confirmPassword" label="Please confirm your password" type="password"
                            value={formik.values.confirmPassword} onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                            }}
                        />

                        <Button
                            fullWidth variant="contained" type="submit"
                            sx={{ mt: 2, backgroundColor: 'black', color: 'white', py: 1.2 }}
                        >
                            Reset password
                        </Button>
                    </form>
                    <ToastContainer />
                </Box>
            </Box>

            {/* Right side */}
            <Box sx={{ width: '50%', display: { xs: 'none', md: 'block' } }}>
                <img
                    src="/src/public/reset.png"
                    alt="Reset Illustration"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>
        </Box>
    );
}

export default ResetPassword;
