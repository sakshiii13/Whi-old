import { useState, useEffect } from "react";
import { Snackbar, Alert, Slide, IconButton } from "@mui/material";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";



const SEVERITY_STYLES = {
  success: {
    icon: CheckCircle2,
    ring: "ring-emerald-200",
    glow: "shadow-[0_8px_30px_-8px_rgba(16,185,129,0.35)]",
    iconWrap: "bg-emerald-50 text-emerald-600",
    bar: "bg-gradient-to-r from-emerald-500 to-green-400",
  },

  error: {
    icon: XCircle,
    ring: "ring-rose-200",
    glow: "shadow-[0_8px_30px_-8px_rgba(244,63,94,0.35)]",
    iconWrap: "bg-rose-50 text-rose-600",
    bar: "bg-gradient-to-r from-rose-500 to-red-400",
  },

  warning: {
    icon: AlertTriangle,
    ring: "ring-amber-200",
    glow: "shadow-[0_8px_30px_-8px_rgba(245,158,11,0.35)]",
    iconWrap: "bg-amber-50 text-amber-600",
    bar: "bg-gradient-to-r from-amber-500 to-yellow-400",
  },

  info: {
    icon: Info,
    ring: "ring-sky-200",
    glow: "shadow-[0_8px_30px_-8px_rgba(14,165,233,0.35)]",
    iconWrap: "bg-sky-50 text-sky-600",
    bar: "bg-gradient-to-r from-sky-500 to-cyan-400",
  },
};

const ANCHOR_MAP = {
  "top-right": { vertical: "top", horizontal: "right" },
  "top-left": { vertical: "top", horizontal: "left" },
  "bottom-right": { vertical: "bottom", horizontal: "right" },
  "bottom-left": { vertical: "bottom", horizontal: "left" },
};


const SlideTransition = (props) => <Slide {...props} direction="left" />;

const SnackBar = ({
  open,
  onClose,
  message,
  title,
  severity = "success",
  autoHideDuration = 4000,
  position = "top-right",
}) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setIsOpen(false);
    onClose?.();
  };

  const config = SEVERITY_STYLES[severity] || SEVERITY_STYLES.success;
  const Icon = config.icon;

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={ANCHOR_MAP[position] || ANCHOR_MAP["top-right"]}
      TransitionComponent={SlideTransition}
      className="!z-[1300]"
    >
      {/* MUI needs a single child that forwards its own ref — wrap Alert directly */}
    <Alert
  onClose={handleClose}
  severity={severity}
  variant="filled"
  icon={false}
  className={`
    relative overflow-hidden
    !w-[360px] !max-w-[92vw]
    !rounded-2xl !p-0
    ring-1 ${config.ring}
    !bg-white
    border border-slate-100
    ${config.glow}
  `}
  classes={{
    message: "!p-0 !w-full",
    action: "!p-0 !m-0 !pr-3 !items-center",
  }}
>
        {/* left accent bar */}
        <span className={`absolute left-0 top-0 h-full w-1 ${config.bar}`} />

        <div className="flex items-start gap-3 py-3.5 pl-5 pr-2">

  <span
    className={`
      mt-0.5 flex h-9 w-9 shrink-0 
      items-center justify-center 
      rounded-xl 
      ${config.iconWrap}
    `}
  >
    <Icon size={20} strokeWidth={2.25}/>
  </span>


  <div className="min-w-0 flex-1 pt-0.5">

    {title && (
      <p className="mb-0.5 text-[13px] font-semibold tracking-wide text-slate-800">
        {title}
      </p>
    )}

    <p className="text-[13.5px] leading-snug font-medium text-slate-500">
      {message}
    </p>

  </div>

</div>

        {/* close button rendered via MUI Alert's action slot */}
     <IconButton
 size="small"
 onClick={handleClose}
 className="
 !absolute 
 !right-2 
 !top-2.5
 !text-slate-400
 hover:!bg-slate-100
 hover:!text-slate-700
 "
>
 <X size={16}/>
</IconButton>
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;