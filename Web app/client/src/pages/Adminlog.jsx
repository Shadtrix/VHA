import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, Lock } from '@mui/icons-material';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

function Adminlog() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: yup.object({
            email: yup.string().email().required(),
            password: yup.string().min(8).required()
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();

            http.post('/user/login', data)
                .then((res) => {
                    if (res.data.user.role !== 'admin') {
                        toast.error('Access denied. Not an admin.', { autoClose: 3000 });
                        return;
                    }
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setUser(res.data.user);

                    toast.success('Admin logged in', { autoClose: 3000 });

                    // Delay navigation slightly to let toast show
                    setTimeout(() => {
                        navigate('/admin');
                    }, 500); // 0.5 seconds
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message || 'Login failed', { autoClose: 3000 });
                });
        }
    });

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Box sx={{ width: '50%', maxWidth: 500, m: 'auto', p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center">Admin Login</Typography>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <TextField fullWidth label="Email" name="email" margin="dense" value={formik.values.email}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                    />
                    <TextField fullWidth label="Password" name="password" type="password" margin="dense" value={formik.values.password}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                    />
                    <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, backgroundColor: 'black' }}>
                        Login
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Adminlog;
