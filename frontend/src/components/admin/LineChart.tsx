"use client";

import { useState, useRef, useEffect } from "react";

interface DataPoint {
  date: string;
  count: number;
}

interface LineChartProps {
  data: DataPoint[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  label: string;
}

export default function LineChart({
  data,
  color,
  gradientFrom,
  gradientTo,
  label,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 280 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Responsive width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 280,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (data.length === 0 || dimensions.width === 0) {
    return (
      <div
        ref={containerRef}
        className="h-[280px] flex items-center justify-center text-gray-500"
      >
        <div className="text-center">
          <p className="text-lg mb-2">Henüz veri yok</p>
          <p className="text-sm">Veriler toplandıkça burada görünecek</p>
        </div>
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const minValue = 0;

  // Calculate points
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1 || 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.count - minValue) / (maxValue - minValue || 1)) * chartHeight,
    data: d,
    index: i,
  }));

  // Create path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Create area path
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    Math.round((maxValue / (yTicks - 1)) * i)
  );

  // X-axis labels (show every few dates based on data length)
  const xLabelStep = Math.max(1, Math.floor(data.length / 7));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Find closest point
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    points.forEach((point, index) => {
      const distance = Math.abs(point.x - x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestDistance < 50) {
      setHoveredIndex(closestIndex);
      setMousePos({ x: points[closestIndex].x, y: points[closestIndex].y });
    } else {
      setHoveredIndex(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  const gradientId = `gradient-${color.replace("#", "")}`;
  const areaGradientId = `area-gradient-${color.replace("#", "")}`;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          {/* Line Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
          
          {/* Area Gradient */}
          <linearGradient id={areaGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {yTickValues.map((tick, i) => {
          const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={dimensions.width - padding.right}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                fill="#6b7280"
                fontSize="12"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % xLabelStep !== 0 && i !== data.length - 1) return null;
          const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
          return (
            <text
              key={i}
              x={x}
              y={dimensions.height - 10}
              fill="#6b7280"
              fontSize="11"
              textAnchor="middle"
            >
              {formatDate(d.date)}
            </text>
          );
        })}

        {/* Area */}
        <path
          d={areaPath}
          fill={`url(#${areaGradientId})`}
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === i ? 6 : 4}
            fill={hoveredIndex === i ? color : "transparent"}
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-150"
          />
        ))}

        {/* Hover Line */}
        {hoveredIndex !== null && (
          <line
            x1={mousePos.x}
            y1={padding.top}
            x2={mousePos.x}
            y2={padding.top + chartHeight}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        )}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none z-10 bg-secondary border border-white/10 rounded-lg px-3 py-2 shadow-xl transform -translate-x-1/2"
          style={{
            left: mousePos.x,
            top: mousePos.y - 60,
          }}
        >
          <p className="text-gray-400 text-xs mb-1">
            {formatDate(data[hoveredIndex].date)}
          </p>
          <p className="font-bold" style={{ color }}>
            {data[hoveredIndex].count.toLocaleString()} {label}
          </p>
        </div>
      )}
    </div>
  );
}
