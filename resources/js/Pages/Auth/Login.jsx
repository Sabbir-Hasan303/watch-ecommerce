import CustomTextField from '@/Components/CustomTextField';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Checkbox, FormControlLabel, Button, Alert, Box, Divider, IconButton, InputAdornment } from '@mui/material';
import { ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl grid md:grid-cols-[1fr_480px] bg-card text-foreground border rounded-2xl overflow-hidden shadow-xl">
                    {/* Visual / Brand side */}
                    <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">C</div>
                                <div className="text-xl font-bold tracking-tight">Chronos</div>
                            </div>
                            <h2 className="mt-10 text-3xl font-bold leading-tight">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                Sign in to continue exploring premium watches, curated collections, and exclusive offers.
                            </p>
                        </div>

                        {/* <div className="mt-12 grid grid-cols-3 gap-4 opacity-90">
                            <div className="h-24 rounded-xl bg-card/60 border backdrop-blur-sm" />
                            <div className="h-24 rounded-xl bg-card/60 border backdrop-blur-sm" />
                            <div className="h-24 rounded-xl bg-card/60 border backdrop-blur-sm" />
                        </div> */}
                    </div>

                    {/* Form side */}
                    <div className="p-6 sm:p-10">
                        {status && (
                            <Alert severity="success" className="mb-4">
                                {status}
                            </Alert>
                        )}

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Log in</h1>
                            <p className="text-sm text-muted-foreground mt-1">Use your account credentials to continue</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <Box>
                                <CustomTextField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    InputProps={{ startAdornment: <Mail className="me-2 text-gray-400" size={18} /> }}
                                />
                            </Box>

                            <Box>
                                <CustomTextField
                                    id="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock className="me-2 text-gray-400" size={18} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton type="button" onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                                                    {showPassword ? <EyeOff className="text-gray-400" size={18} /> : <Eye className="text-gray-400" size={18} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>

                            <div className="flex items-center justify-between">
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
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                className="!mt-2 font-semibold"
                                endIcon={<ArrowRight size={18} />}
                                disabled={processing}
                                variant='outlined'
                            >
                                Continue
                            </Button>

                            <Divider className="!my-6">or</Divider>

                            <div className="text-center text-sm">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="font-medium text-primary hover:underline">
                                    Create one
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
