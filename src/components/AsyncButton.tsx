import { Button, type ButtonProps, CircularProgress } from "@mui/material";

type AsyncButtonProps = ButtonProps & {
  loading?: boolean;
};

export function AsyncButton({ loading = false, children, disabled, ...props }: AsyncButtonProps) {
  return (
    <div className="relative inline-block">
      <Button
        {...props}
        disabled={disabled || loading}
        className={`${props.className ?? ""} ${loading ? "opacity-70 pointer-events-none" : ""}`}
      >
        {children}
      </Button>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
          <CircularProgress size={22} />
        </div>
      )}
    </div>
  );
}
