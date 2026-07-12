import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface EnergyChartProps {
  progress: number;
}

export function EnergyChart({ progress }: EnergyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Keep track of previous progress for smooth transitions if needed, though state updates are frequent
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 150;
    const margin = 10;
    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2;
    const borderRadius = 10;
    
    // Clear previous elements
    svg.selectAll('*').remove();

    // Definitions for gradients and glowing effects
    const defs = svg.append('defs');

    const gradient = defs
      .append('linearGradient')
      .attr('id', 'battery-fill')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981'); // Emerald 500
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#4ade80'); // Emerge Green

    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Battery Body
    svg.append('rect')
      .attr('x', margin)
      .attr('y', margin)
      .attr('width', innerWidth - 20)
      .attr('height', innerHeight)
      .attr('rx', borderRadius)
      .attr('fill', 'rgba(0, 0, 0, 0.5)')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 2);

    // Battery Terminal
    svg.append('rect')
      .attr('x', width - margin - 20)
      .attr('y', height / 2 - 20)
      .attr('width', 20)
      .attr('height', 40)
      .attr('rx', 4)
      .attr('fill', 'rgba(255, 255, 255, 0.2)');

    // Battery Fill Container (Clipping)
    defs.append('clipPath')
      .attr('id', 'battery-clip')
      .append('rect')
      .attr('x', margin + 4)
      .attr('y', margin + 4)
      .attr('width', innerWidth - 28)
      .attr('height', innerHeight - 8)
      .attr('rx', borderRadius - 2);

    // Group for fill
    const fillGroup = svg.append('g').attr('clip-path', 'url(#battery-clip)');

    // The liquid fill
    const fillWidth = (progress / 100) * (innerWidth - 28);
    
    fillGroup.append('rect')
      .attr('x', margin + 4)
      .attr('y', margin + 4)
      .attr('width', fillWidth)
      .attr('height', innerHeight - 8)
      .attr('fill', 'url(#battery-fill)')
      .attr('filter', 'url(#glow)');

    // Animated particles/energy lines inside the fill
    const numParticles = Math.floor(progress / 5);
    for (let i = 0; i < numParticles; i++) {
      const px = margin + 4 + Math.random() * fillWidth;
      const py = margin + 4 + Math.random() * (innerHeight - 8);
      fillGroup.append('circle')
        .attr('cx', px)
        .attr('cy', py)
        .attr('r', Math.random() * 2 + 1)
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('filter', 'url(#glow)')
        .transition()
        .duration(500 + Math.random() * 1000)
        .attr('cx', px + 20)
        .attr('opacity', 0)
        .ease(d3.easeLinear);
    }

    // Text percentage
    svg.append('text')
      .attr('x', width / 2 - 10)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '28px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .style('text-shadow', '0px 2px 4px rgba(0,0,0,0.5)')
      .text(`${Math.floor(progress)}%`);

  }, [progress]);

  return (
    <div className="flex justify-center w-full my-8">
      <svg
        ref={svgRef}
        width="300"
        height="150"
        viewBox="0 0 300 150"
        style={{ maxWidth: '100%', height: 'auto' }}
        className="drop-shadow-2xl"
      />
    </div>
  );
}
