import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-navy text-white hover:bg-navy-light shadow-card hover:shadow-cardHover",
  accent:
    "bg-emerald text-white hover:bg-emerald-light shadow-card hover:shadow-cardHover",
  outline:
    "bg-transparent text-ink border border-ink/15 hover:border-ink/30 hover:bg-ink/5",
  outlineLight:
    "bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/10",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  as = "button",
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  const Component = as;
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
