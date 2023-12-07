import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const notifySuccess = (message: string, redirectTo: string) => {
  const router = useRouter();
  toast.success(message, {
    onClose: () => router.push(redirectTo),
  });
};