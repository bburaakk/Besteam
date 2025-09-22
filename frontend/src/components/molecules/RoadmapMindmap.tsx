import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoadmapContent } from '../../services/api/roadmap';

interface RoadmapMindmapProps {
  content: RoadmapContent;
  roadmapId?: number;
}

const RoadmapMindmap: React.FC<RoadmapMindmapProps> = ({ content, roadmapId = 1 }) => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<string | null>('stage-0');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        setDimensions({ 
          width: Math.max(isMobile ? 1200 : 1800, rect.width || window.innerWidth * 0.9), 
          height: Math.max(isMobile ? 1500 : 2500, window.innerHeight * (isMobile ? 1.5 : 2)) 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Pan and zoom functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as Element;
    // Allow dragging from background elements, not from interactive nodes
    if (target.tagName === 'svg' || 
        target.id === 'background-rect' || 
        (target.tagName === 'rect' && target.getAttribute('fill') === 'white')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);
    
    // Get mouse position relative to container
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate world coordinates
    const worldX = (mouseX - transform.x) / transform.scale;
    const worldY = (mouseY - transform.y) / transform.scale;
    
    // Calculate new transform to keep mouse position fixed
    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;
    
    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [transform]);

  const handleSubtopicClick = useCallback((_itemTitle: string, _clickEvent: React.MouseEvent, itemId: string) => {
    // Navigate to the detail page with roadmapId and itemId
    navigate(`/roadmap/${roadmapId}/detail/${encodeURIComponent(itemId)}`);
  }, [navigate, roadmapId]);

  const zoomIn = useCallback(() => {
    const newScale = Math.min(transform.scale * 1.2, 5);
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Zoom towards center
    const mouseXInWorld = (centerX - transform.x) / transform.scale;
    const mouseYInWorld = (centerY - transform.y) / transform.scale;
    
    const newX = centerX - mouseXInWorld * newScale;
    const newY = centerY - mouseYInWorld * newScale;
    
    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [transform, dimensions]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(transform.scale * 0.8, 0.3);
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Zoom towards center
    const mouseXInWorld = (centerX - transform.x) / transform.scale;
    const mouseYInWorld = (centerY - transform.y) / transform.scale;
    
    const newX = centerX - mouseXInWorld * newScale;
    const newY = centerY - mouseYInWorld * newScale;
    
    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [transform, dimensions]);

  const wrapText = (text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      // Approximate character width - adjust this value based on your font
      const approximateWidth = testLine.length * 8; // Assuming ~8px per character
      
      if (approximateWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is too long, split it
          if (word.length * 8 > maxWidth) {
            const maxChars = Math.floor(maxWidth / 8);
            for (let i = 0; i < word.length; i += maxChars) {
              lines.push(word.slice(i, i + maxChars));
            }
          } else {
            lines.push(word);
          }
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    // Limit to maximum 3 lines to prevent overflow
    return lines.slice(0, 3);
  };

  // Transform roadmap data to SVG format
  const roadmapData = useMemo(() => {
    const steps: Array<{
      id: string;
      title: string;
      position: { x: number; y: number };
      isMainPath: boolean;
      color: string;
      subtopics: Array<{ id: string; name: string; }>;
    }> = [];
    const connections: Array<{
      from: string;
      to: string;
    }> = [];
    
    const currentY = 150;
    const centerX = 800;
    const stageSpacing = 400;

    // Stage colors
    const stageColors = [
      '#4ECDC4', '#FF6B6B', '#45B7D1', '#F7DC6F', '#96CEB4', 
      '#DDA0DD', '#98D8C8', '#FFEAA7', '#FF7675', '#74B9FF'
    ];

    content.mainStages.forEach((stage, stageIndex) => {
      const stageId = `stage-${stageIndex}`;
      const stageY = currentY + (stageIndex * stageSpacing);
      
      // Create subtopics array with actual IDs
      const subtopics: Array<{ id: string; name: string; }> = [];
      stage.subNodes.forEach(subNode => {
        // Central node'ları da ekleyelim (ID'si olmadığı için unique bir tane oluşturalım)
        const centralNodeId = `stage-${stageIndex}-central-${subNode.centralNodeTitle.replace(/\s+/g, '-').toLowerCase()}`;
        subtopics.push({
          id: centralNodeId,
          name: subNode.centralNodeTitle
        });
        
        // Left items
        subNode.leftItems.forEach(item => {
          subtopics.push({
            id: item.id,
            name: item.name
          });
        });
        
        // Right items
        subNode.rightItems.forEach(item => {
          subtopics.push({
            id: item.id,
            name: item.name
          });
        });
      });

      steps.push({
        id: stageId,
        title: stage.stageName,
        position: { x: centerX - 100, y: stageY },
        isMainPath: true,
        color: stageColors[stageIndex % stageColors.length],
        subtopics: subtopics
      });

      // Create connection to previous stage
      if (stageIndex > 0) {
        connections.push({
          from: `stage-${stageIndex - 1}`,
          to: stageId
        });
      }
    });

    return {
      title: content.diagramTitle,
      steps,
      connections
    };
  }, [content]);

  const renderConnections = () => {
    return roadmapData.connections.map((connection, index: number) => {
      const fromStep = roadmapData.steps.find(s => s.id === connection.from);
      const toStep = roadmapData.steps.find(s => s.id === connection.to);
      
      if (!fromStep || !toStep) return null;

      return (
        <line
          key={`connection-${index}`}
          x1={fromStep.position.x + 120}
          y1={fromStep.position.y + 60}
          x2={toStep.position.x + 120}
          y2={toStep.position.y}
          stroke="#94A3B8"
          strokeWidth="3"
          className="transition-all duration-300"
        />
      );
    });
  };

  const renderSubtopics = (step: typeof roadmapData.steps[0], stepIndex: number) => {
    if (!step.subtopics || step.subtopics.length === 0 || selectedNode !== step.id) return null;

    const subtopicsPerSide = Math.ceil(step.subtopics.length / 2);
    const leftSubtopics = step.subtopics.slice(0, subtopicsPerSide);
    const rightSubtopics = step.subtopics.slice(subtopicsPerSide);

    const renderSide = (subtopics: Array<{ id: string; name: string; }>, isLeft: boolean) => {
      const isMobile = dimensions.width < 1200;
      const baseX = isLeft ? 
        step.position.x - (isMobile ? 280 : 350) : 
        step.position.x + (isMobile ? 250 : 300);
      const subtopicSpacing = isMobile ? 55 : 65;
      const baseY = step.position.y - (subtopics.length * subtopicSpacing / 2);

      return subtopics.map((subtopic: { id: string; name: string; }, index: number) => {
        return (
        <g key={`subtopic-${stepIndex}-${isLeft ? 'left' : 'right'}-${index}`}>
          <line
            x1={isLeft ? step.position.x : step.position.x + 240}
            y1={step.position.y + 30}
            x2={isLeft ? baseX + (isMobile ? 220 : 280) : baseX}
            y2={baseY + (index * subtopicSpacing) + 22}
            stroke={step.color}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <rect
            x={baseX}
            y={baseY + (index * subtopicSpacing)}
            width={isMobile ? "220" : "280"}
            height="45"
            rx="20"
            fill="white"
            stroke={step.color}
            strokeWidth="2"
            className="cursor-pointer hover:fill-gray-50 transition-all duration-200"
            onClick={(e) => handleSubtopicClick(subtopic.name, e, subtopic.id)}
          />
          {(() => {
            const wrappedLines = wrapText(subtopic.name, isMobile ? 210 : 270);
            const lineHeight = 16;
            const totalHeight = wrappedLines.length * lineHeight;
            const startY = baseY + (index * subtopicSpacing) + 22 - (totalHeight / 2) + (lineHeight / 2);
            const centerX = baseX + (isMobile ? 110 : 140);
            
            return wrappedLines.map((line, lineIndex) => (
        <text
                key={`subtopic-line-${lineIndex}`}
                x={centerX}
                y={startY + (lineIndex * lineHeight)}
          textAnchor="middle"
          dominantBaseline="middle"
                className="text-base fill-gray-700 font-medium cursor-pointer hover:fill-gray-900 transition-colors"
                style={{ fontSize: isMobile ? '12px' : '14px' }}
                onClick={(e) => handleSubtopicClick(subtopic.name, e, subtopic.id)}
        >
                {line}
        </text>
            ));
          })()}
        </g>
        );
      });
    };

    return (
      <>
        {renderSide(leftSubtopics, true)}
        {renderSide(rightSubtopics, false)}
      </>
    );
  };

  if (dimensions.width === 0) {
    return <div ref={containerRef} className="w-full h-96 flex items-center justify-center">
      <div className="text-gray-500">Yükleniyor...</div>
    </div>;
  }

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      {/* Header */}
      <div className="text-center mb-8">
        
        
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
          <button
            onClick={zoomOut}
            disabled={transform.scale <= 0.3}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded text-lg font-bold transition-colors"
            title="Uzaklaştır"
          >
            −
          </button>
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs sm:text-sm text-gray-600">Zoom:</span>
            <span className="text-xs sm:text-sm font-semibold min-w-[3rem] text-center">
              {Math.round(transform.scale * 100)}%
            </span>
          </div>
          <button
            onClick={zoomIn}
            disabled={transform.scale >= 5}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded text-lg font-bold transition-colors"
            title="Yakınlaştır"
          >
            +
          </button>
          </div>

       
        
      </div>

      {/* Main SVG Canvas */}
      <div className="relative bg-white rounded-xl shadow-lg p-2 overflow-hidden">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className={`w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ minHeight: '800px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <g 
            transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
            style={{ transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
          >
          {/* Background */}
          <rect 
            id="background-rect"
            width="100%" 
            height="100%" 
            fill="white" 
            className="cursor-move"
          />

          {/* Connections */}
          {renderConnections()}

          {/* Steps */}
          {roadmapData.steps.map((step, index: number) => {
            const isSelected = selectedNode === step.id;
            
            return (
              <g key={`step-${index}`}>
                {/* Main Step Node */}
                <rect
                  x={step.position.x}
                  y={step.position.y}
                  width="240"
                  height="60"
                  rx="30"
                  fill={step.color}
                  stroke={isSelected ? "#1F2937" : "white"}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="cursor-pointer transition-all duration-300 hover:brightness-110"
                  onClick={() => {
                    setSelectedNode(isSelected ? null : step.id);
                  }}
                  filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                />
                
                {/* Step Title */}
                {(() => {
                  const wrappedLines = wrapText(step.title, 230);
                  const lineHeight = 18;
                  const totalHeight = wrappedLines.length * lineHeight;
                  const startY = step.position.y + 30 - (totalHeight / 2) + (lineHeight / 2);
                  
                  return wrappedLines.map((line, lineIndex) => (
                <text
                      key={`title-line-${lineIndex}`}
                  x={step.position.x + 120}
                      y={startY + (lineIndex * lineHeight)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                      className="font-semibold cursor-pointer fill-gray-800"
                      style={{ fontSize: '15px' }}
                  onClick={() => {
                    setSelectedNode(isSelected ? null : step.id);
                  }}
                >
                      {line}
                </text>
                  ));
                })()}



                {/* Subtopics */}
                {renderSubtopics(step, index)}
              </g>
            );
          })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RoadmapMindmap;