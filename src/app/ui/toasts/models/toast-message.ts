import { ToastSeverity } from './toast-severity';

export interface ToastMessage {
  message: string;
  severity: ToastSeverity;
  timeoutMs?: number;
}
