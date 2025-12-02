import toast from 'react-hot-toast'

export const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
    dismiss: (toastId) => toast.dismiss(toastId),
    remove: (toastId) => toast.remove(toastId),
}

export default showToast
