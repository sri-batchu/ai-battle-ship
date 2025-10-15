import { toast } from 'sonner';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

const TOAST_DURATION = 3000;
const MAX_VISIBLE_TOASTS = 3;

let visibleToasts = 0;
let messageQueue: Array<{ message: string; type: ToastType }> = [];

const showNextToast = () => {
  if (messageQueue.length === 0 || visibleToasts >= MAX_VISIBLE_TOASTS) return;

  const { message, type = 'default' } = messageQueue.shift()!;
  visibleToasts++;

  const toastOptions = {
    duration: TOAST_DURATION,
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
      opacity: '1',
      zIndex: '1000',
    },
    onAutoClose: () => {
      visibleToasts--;
      // Process next toast after a small delay
      setTimeout(showNextToast, 100);
    },
  };

  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, {
        ...toastOptions,
        duration: 4000, // Keep errors visible longer
      });
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
  // If we haven't reached the max visible toasts, show immediately
  if (visibleToasts < MAX_VISIBLE_TOASTS) {
    messageQueue.push({ message, type });
    showNextToast();
  } else {
    // Otherwise, add to queue
    messageQueue.push({ message, type });
  }
};

export const clearToasts = () => {
  toast.dismiss();
  messageQueue = [];
  visibleToasts = 0;
};

export { toast };
