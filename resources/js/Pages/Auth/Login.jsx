import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextField, Checkbox, FormControlLabel, Button, Alert, Box } from '@mui/material';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <Alert severity="success" className="mb-4">
                    {status}
                </Alert>
            )}

            <form onSubmit={submit}>
                <Box>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        fullWidth
                        margin="normal"
                        autoComplete="username"
                        autoFocus
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                </Box>

                <Box>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        fullWidth
                        margin="normal"
                        autoComplete="current-password"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </Box>

                <Box className="mt-4">
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                        }
                        label="Remember me"
                    />
                </Box>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <Button type="submit" variant="contained" className="ms-4" disabled={processing}>
                        Log in
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
