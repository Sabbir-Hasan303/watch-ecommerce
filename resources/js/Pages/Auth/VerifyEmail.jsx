import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import { Alert, Button } from '@mui/material'
import { ArrowRight, Mail } from 'lucide-react'

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({})

    const submit = (e) => {
        e.preventDefault()
        post(route('verification.send'))
    }

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="min-h-[60vh] w-full flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl grid md:grid-cols-[1fr_520px] bg-card text-foreground border rounded-2xl overflow-hidden shadow-xl">
                    {/* Visual / Brand side */}
                    <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">C</div>
                                <div className="text-xl font-bold tracking-tight">Chronos</div>
                            </div>
                            <h2 className="mt-10 text-3xl font-bold leading-tight">Check your inbox</h2>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                We sent you a verification email. Click the link inside to verify your account. You can request another if needed.
                            </p>
                        </div>
                    </div>

                    {/* Actions side */}
                    <div className="p-6 sm:p-10">
                        {status === 'verification-link-sent' && (
                            <Alert severity="success" className="mb-4">
                                A new verification link has been sent to the email address you provided during registration.
                            </Alert>
                        )}

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Verify your email</h1>
                            <p className="text-sm text-muted-foreground mt-1">Didn’t get the email? You can resend</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                className="!mt-2 font-semibold"
                                endIcon={<ArrowRight size={18} />}
                                variant='outlined'
                                disabled={processing}
                            >
                                Resend verification email
                            </Button>

                            <div className="text-center text-sm">
                                Prefer to try later?{' '}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Log out
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
