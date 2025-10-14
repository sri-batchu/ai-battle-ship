import { toast, type ToastT } from 'sonner';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

const TOAST_DURATION: Record<ToastType, number> = {
  default: 1500,
  info: 1500,
  success: 1500,
  warning: 2000,
  error: 2000,
};

const MAX_VISIBLE_TOASTS = 3;
let visibleToasts = 0;
let messageQueue: Array<{ message: string; type?: ToastType }> = [];

const showNextToast = () => {
  if (messageQueue.length === 0 || visibleToasts >= MAX_VISIBLE_TOASTS) return;

  const { message, type = 'default' } = messageQueue.shift()!;
  visibleToasts++;

  const toastOptions: Partial<ToastT> = {
    duration: TOAST_DURATION[type],
    onAutoClose: () => {
      visibleToasts--;
      // Process next toast after a small delay
      setTimeout(showNextToast, 100);
    },
  };

  // Use the appropriate toast method based on type
  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'warning':
      toast.warning(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};

export const showToast = (message: string, type: ToastType = 'default') => {
  messageQueue.push({ message, type });
  if (visibleToasts < MAX_VISIBLE_TOASTS) {
    showNextToast();
  }
};

export const clearToasts = () => {
  toast.dismiss();
  messageQueue = [];
  visibleToasts = 0;
};

export { toast };
