type Variant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusPillProps {
  variant: Variant;
  children: React.ReactNode;
  dot?: boolean;
}

const dotColor: Record<Variant, string> = {
  success: '#1D9E75',
  warning: '#BA7517',
  error:   '#A32D2D',
  info:    '#378ADD',
  neutral: '#A49DAE',
};

export default function StatusPill({ variant, children, dot = false }: StatusPillProps) {
  return (
    <span className={`pill pill-${variant}`}>
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor[variant], display: 'inline-block' }} />
      )}
      {children}
    </span>
  );
}
