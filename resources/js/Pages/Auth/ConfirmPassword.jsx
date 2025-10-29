import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'
import { Alert, Box, Button } from '@mui/material'
import { ArrowRight, Lock } from 'lucide-react'

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: ''
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('password.confirm'), { onFinish: () => reset('password') })
    }

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="min-h-[60vh] w-full flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-3xl grid md:grid-cols-[1fr_480px] bg-card text-foreground border rounded-2xl overflow-hidden shadow-xl">
                    {/* Visual / Brand side */}
                    <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">C</div>
                                <div className="text-xl font-bold tracking-tight">Chronos</div>
                            </div>
                            <h2 className="mt-10 text-3xl font-bold leading-tight">Security check</h2>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                Please confirm your password to continue.
                            </p>
                        </div>
                    </div>

                    {/* Form side */}
                    <div className="p-6 sm:p-10">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Confirm password</h1>
                            <p className="text-sm text-muted-foreground mt-1">Re-enter your password to proceed</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <Box>
                                <CustomTextField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    fullWidth
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <span className="me-2 text-gray-400"><Lock size={18} /></span>
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
                                Confirm
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
