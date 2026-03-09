import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Line Chart Component
export const LineChart = ({ data, xKey = 'label', yKey = 'value', height = 200, color = '#3B82F6' }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    setDimensions({ width, height });

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) return;

    // Find max value
    const maxValue = Math.max(...data.map(d => d[yKey]));

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * height;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    // Vertical grid lines
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * width;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.stroke();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (point[yKey] / maxValue) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw points
    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (point[yKey] / maxValue) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

  }, [data, xKey, yKey, height, color]);

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 transform translate-y-6">
        {data.map((point, i) => (
          <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
            {point[xKey]}
          </span>
        ))}
      </div>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({ data, xKey = 'label', yKey = 'value', height = 200, colors = ['#3B82F6'] }) => {
  const maxValue = Math.max(...data.map(d => d[yKey]));

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
        ))}
      </div>

      {/* Bars */}
      <div className="absolute inset-0 flex items-end justify-around">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(item[yKey] / maxValue) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-8 relative group"
          >
            <div
              className={`absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t ${
                colors[index % colors.length]
              }`}
              style={{ height: '100%' }}
            >
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item[yKey]}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around transform translate-y-6">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-500 dark:text-gray-400">
            {item[xKey]}
          </span>
        ))}
      </div>
    </div>
  );
};

// Pie Chart Component
export const PieChart = ({ data, size = 200, colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'] }) => {
  const canvasRef = useRef(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = -Math.PI / 2; // Start from top

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Fill
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Stroke
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * radius * 0.7;
      const labelY = centerY + Math.sin(labelAngle) * radius * 0.7;

      // Draw label if segment is large enough
      if (sliceAngle > 0.3) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY);
      }

      startAngle = endAngle;
    });

  }, [data, size, colors]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="w-full h-full"
        />
      </div>
      
      {/* Legend */}
      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 cursor-pointer"
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
export const DonutChart = ({ data, size = 200, colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    const holeRadius = radius * 0.6;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, holeRadius, endAngle, startAngle, true);
      ctx.closePath();

      // Fill
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Stroke
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, centerX, centerY);

  }, [data, size, colors]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  );
};

// Sparkline Chart (Mini trend line)
export const Sparkline = ({ data, color = '#3B82F6', height = 40, width = 120 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = `${color}20`;
    ctx.fill();

  }, [data, color, height, width]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

// Progress Chart
export const ProgressChart = ({ value, max = 100, size = 120, strokeWidth = 10, color = '#3B82F6' }) => {
  const canvasRef = useRef(null);
  const percentage = (value / max) * 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth) / 2;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Draw progress
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percentage / 100) * (Math.PI * 2);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw text
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);

  }, [value, max, size, strokeWidth, color, percentage]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};