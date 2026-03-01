import { CustomToast, ToastType } from "@/components/ui/custom-toast";
import { toast } from "sonner";

/**
 * 方便呼叫的工具函式
 */
export const showCustomToast = ({
    title,
    message,
    type = 'info',
    duration = 4000,
    isDark = false
}: {
    title: string;
    message?: string;
    type?: ToastType;
    duration?: number;
    isDark?: boolean;
}) => {
    toast.custom((t) => (
        <CustomToast
            t={t}
            title={title}
            message={message}
            type={type}
            duration={duration}
            isDark={isDark}
        />
    ), { duration });
};
