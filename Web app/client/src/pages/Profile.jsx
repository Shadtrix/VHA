import { useEffect, useState, useContext, useRef } from 'react';
import { Box, Card, CardContent, Stack, Typography, TextField, Button, Avatar, InputAdornment, Divider, LinearProgress } from '@mui/material';
import { Lock, Upload } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const inputRef = useRef(null);

  
  const resolveAvatar = (urlPath) => {
    if (!urlPath) return undefined;
    if (/^https?:\/\//i.test(urlPath)) return urlPath;
    return API_BASE + urlPath; 
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await http.get('/user/me');
        setMe(data);
        setName(data.name || '');
        setAvatarUrl(data.avatarUrl || '');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSaveProfile = async () => {
    setSaving(true);
    try {
      await http.put('/user/me', { name });
      
      const { data } = await http.get('/user/me');
      setMe(data);
      const updated = { ...(user || {}), name: data.name, avatarUrl: data.avatarUrl || null };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      alert('Profile updated');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  
  const onPickAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file); 
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const r = await http.post('/user/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const newUrl = r.data.avatarUrl || '';
      setAvatarUrl(newUrl);

      
      const { data } = await http.get('/user/me');
      const updated = { ...(user || {}), name: data.name, avatarUrl: data.avatarUrl || newUrl || null };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);

      alert('Avatar uploaded');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Avatar upload failed');
    } finally {
      
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onChangePassword = async () => {
    if (!pw.newPassword || pw.newPassword.length < 8) return alert('New password must be at least 8 characters');
    if (!/[A-Za-z]/.test(pw.newPassword) || !/\d/.test(pw.newPassword)) return alert('Password must include letters & numbers');
    if (pw.newPassword !== pw.confirm) return alert('Passwords do not match');

    setChangingPw(true);
    try {
      await http.post('/user/change-password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      alert('Password changed');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) return <LinearProgress />;

  const preview = avatarFile ? URL.createObjectURL(avatarFile) : null;
  const displayAvatar = preview || resolveAvatar(avatarUrl);

  return (
    <Box p={3} maxWidth={900} mx="auto">
      <Typography variant="h5" fontWeight={800} mb={2}>Profile</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar src={displayAvatar} sx={{ width: 84, height: 84 }} />
            <div>
              <input
                ref={inputRef}
                id="avatar-input"
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={onPickAvatar}
              />
              <Button variant="outlined" startIcon={<Upload />} onClick={() => inputRef.current?.click()}>
                Upload avatar
              </Button>
            </div>
          </Stack>

          <Stack spacing={2}>
            <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email" value={me?.email || ''} disabled />
            <Box>
              <Button onClick={onSaveProfile} variant="contained" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Change password</Typography>
          <Stack spacing={2}>
            <TextField
              type="password"
              label="Current password"
              value={pw.currentPassword}
              onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }}
            />
            <TextField
              type="password"
              label="New password"
              value={pw.newPassword}
              onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
              helperText="At least 8 characters; must include letters & numbers"
              InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }}
            />
            <TextField
              type="password"
              label="Confirm new password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }}
            />
            <Box>
              <Button onClick={onChangePassword} variant="contained" disabled={changingPw}>
                {changingPw ? 'Changing…' : 'Change password'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary">
        Allowed types: png/jpg/webp. Max size: 2MB.
      </Typography>
    </Box>
  );
}

export default Profile;
