import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'
import { Alert, Box, Button, Divider } from '@mui/material'
import { Mail, ArrowRight } from 'lucide-react'

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: ''
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('password.email'))
    }

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl grid md:grid-cols-[1fr_520px] bg-card text-foreground border rounded-2xl overflow-hidden shadow-xl">
                    {/* Visual / Brand side */}
                    <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">C</div>
                                <div className="text-xl font-bold tracking-tight">Chronos</div>
                            </div>
                            <h2 className="mt-10 text-3xl font-bold leading-tight">Reset your password</h2>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                Enter your email address and we will send you a link to reset your password.
                            </p>
                        </div>
                    </div>

                    {/* Form side */}
                    <div className="p-6 sm:p-10">
                        {status && (
                            <Alert severity="success" className="mb-4">
                                {status}
                            </Alert>
                        )}

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Forgot your password?</h1>
                            <p className="text-sm text-muted-foreground mt-1">We’ll send a reset link to your email</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
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

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                className="!mt-2 font-semibold"
                                endIcon={<ArrowRight size={18} />}
                                variant='outlined'
                                disabled={processing}
                            >
                                Send reset link
                            </Button>

                            <Divider className="!my-6" />
                            <p className="text-sm text-muted-foreground">
                                You will receive an email with a link to reset your password if the email exists in our system.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
