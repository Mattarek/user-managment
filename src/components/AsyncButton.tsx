import {Button, type ButtonProps, CircularProgress} from '@mui/material';
import {useState} from 'react';

type AsyncButtonProps = ButtonProps & {
    onAsyncClick?: () => Promise<void>;
};

export function AsyncButton({
                                onAsyncClick,
                                children,
                                disabled,
                                ...props
                            }: AsyncButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (!onAsyncClick) return;
        try {
            setLoading(true);
            await onAsyncClick();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                return error.message;
            }
            return "Unknown error";
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative inline-block">
            <Button
                {...props}
                disabled={disabled || loading}
                onClick={onAsyncClick ? handleClick : props.onClick}
                className={`${props.className ?? ''} ${loading ? 'opacity-70 pointer-events-none' : ''}`}
            >
                {children}
            </Button>
            {loading && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                    <CircularProgress size={22}/>
                </div>
            )}
        </div>
    );
}
