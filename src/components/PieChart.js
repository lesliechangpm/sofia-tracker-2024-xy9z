import React from 'react';

const PieChart = ({ data, size = 200 }) => {
  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Don't render if no data
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-gray-400 text-sm">No expenses yet</p>
      </div>
    );
  }
  
  // Calculate angles for each segment
  let currentAngle = -90; // Start at top
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
      angle
    };
  });
  
  // Helper function to create SVG path for pie segment
  const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', centerX, centerY,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform transition-all duration-500">
        {/* Draw segments */}
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={createPath(centerX, centerY, radius, segment.startAngle, segment.endAngle)}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-90 transition-opacity duration-200"
            />
            {/* Add percentage label if segment is large enough */}
            {segment.percentage > 10 && (
              <>
                {/* Calculate label position */}
                {(() => {
                  const labelAngle = (segment.startAngle + segment.endAngle) / 2;
                  const labelRadius = radius * 0.7;
                  const labelPos = polarToCartesian(centerX, centerY, labelRadius, labelAngle);
                  
                  return (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-bold text-sm pointer-events-none"
                    >
                      {segment.percentage.toFixed(1)}%
                    </text>
                  );
                })()}
              </>
            )}
          </g>
        ))}
        
        {/* Center circle for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.3}
          fill="white"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex gap-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">
              {item.label}: {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;