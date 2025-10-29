import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomTextField from '@/Components/CustomTextField';
import { Box, Button, Checkbox, Divider, FormControlLabel, IconButton, Alert } from '@mui/material';
import { ArrowRight, Phone, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveScroll: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl grid md:grid-cols-[1fr_520px] bg-card text-foreground border rounded-2xl overflow-hidden shadow-xl">
                    {/* Visual / Brand side */}
                    <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">C</div>
                                <div className="text-xl font-bold tracking-tight">Chronos</div>
                            </div>
                            <h2 className="mt-10 text-3xl font-bold leading-tight">Create your account</h2>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                Join the community and get access to exclusive drops and members-only offers.
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
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Register</h1>
                            <p className="text-sm text-muted-foreground mt-1">Fill your details to get started</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <Box>
                                <CustomTextField
                                    id="name"
                                    label="Full name"
                                    name="name"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    InputProps={{
                                        startAdornment: (
                                            <span className="me-2 text-gray-400"><User size={18} /></span>
                                        )
                                    }}
                                />
                            </Box>

                            <Box>
                                <CustomTextField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <span className="me-2 text-gray-400"><Mail size={18} /></span>
                                        )
                                    }}
                                />
                            </Box>

                            <Box>
                                <CustomTextField
                                    id="phone"
                                    label="Phone number"
                                    name="phone"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone}
                                    InputProps={{
                                        startAdornment: (
                                            <span className="me-2 text-gray-400"><Phone size={18} /></span>
                                        )
                                    }}
                                />
                            </Box>

                            <Box>
                                <CustomTextField
                                    id="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <span className="me-2 text-gray-400"><Lock size={18} /></span>
                                        ),
                                        endAdornment: (
                                            <IconButton type="button" onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                                                {showPassword ? <EyeOff className="text-gray-400" size={18} /> : <Eye className="text-gray-400" size={18} />}
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Box>

                            <Box>
                                <CustomTextField
                                    id="password_confirmation"
                                    label="Confirm password"
                                    type={showPassword2 ? 'text' : 'password'}
                                    name="password_confirmation"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.password_confirmation)}
                                    helperText={errors.password_confirmation}
                                    InputProps={{
                                        startAdornment: (
                                            <span className="me-2 text-gray-400"><Lock size={18} /></span>
                                        ),
                                        endAdornment: (
                                            <IconButton type="button" onClick={() => setShowPassword2(!showPassword2)} edge="end" aria-label="toggle password visibility">
                                                {showPassword2 ? <EyeOff className="text-gray-400" size={18} /> : <Eye className="text-gray-400" size={18} />}
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                className="!mt-6 font-semibold"
                                endIcon={<ArrowRight size={18} />}
                                variant='outlined'
                                disabled={processing}
                            >
                                Create account
                            </Button>

                            <Divider className="!my-6">or</Divider>

                            <div className="text-center text-sm">
                                Already registered?{' '}
                                <Link href={route('login')} className="font-medium text-primary hover:underline">
                                    Log in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
