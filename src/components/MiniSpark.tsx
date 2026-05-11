interface MiniSparkProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export default function MiniSpark({ data, color = '#1D9E75', width = 120, height = 32 }: MiniSparkProps) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const last = data[data.length - 1];
  const lx = width;
  const ly = height - ((last - min) / range) * (height - 2) - 1;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  );
}
