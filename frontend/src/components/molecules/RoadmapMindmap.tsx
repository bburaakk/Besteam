import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Syntax highlighting theme
import type { RoadmapContent } from '../../services/api/roadmap';
import { summaryService, handleApiError } from '../../services';

interface RoadmapMindmapProps {
  content: RoadmapContent;
  roadmapId?: number;
}

const RoadmapMindmap: React.FC<RoadmapMindmapProps> = ({ content, roadmapId = 1 }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('stage-0'); // İlk aşamayı varsayılan olarak seçili yap
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [summaryData, setSummaryData] = useState<{content: string, title: string} | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        setDimensions({ 
          width: Math.max(isMobile ? 1000 : 1600, rect.width || window.innerWidth * 0.9), 
          height: Math.max(isMobile ? 1200 : 2000, window.innerHeight * (isMobile ? 1.2 : 1.5)) 
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
      e.preventDefault();
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
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Mouse position relative to SVG
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Current mouse position in the transformed coordinate system
    const mouseXInWorld = (mouseX - transform.x) / transform.scale;
    const mouseYInWorld = (mouseY - transform.y) / transform.scale;
    
    const delta = e.deltaY * -0.002; // Daha hassas zoom
    const newScale = Math.min(Math.max(0.3, transform.scale + delta), 5); // Daha geniş zoom aralığı
    
    // Calculate new transform to keep mouse position fixed
    const newX = mouseX - mouseXInWorld * newScale;
    const newY = mouseY - mouseYInWorld * newScale;
    
    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [transform]);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const fetchSummary = useCallback(async (itemTitle: string, clickEvent: React.MouseEvent, itemId: string) => {
    setIsLoadingSummary(true);
    setSummaryError(null);
    
    // Tıklanan pozisyonu al
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setModalPosition({
        x: clickEvent.clientX - rect.left,
        y: clickEvent.clientY - rect.top
      });
    }
    
    try {
      // API'den özet çek - roadmap data'sından gelen gerçek ID'yi kullan
      const data = await summaryService.getSummary(roadmapId, itemId);
      setSummaryData({
        title: data.topic || itemTitle, // API'den gelen topic'i kullan, yoksa fallback olarak itemTitle
        content: data.summary || 'Özet bulunamadı.'
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setSummaryError(errorMessage);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [roadmapId]);

  const closeSummary = useCallback(() => {
    setSummaryData(null);
    setSummaryError(null);
    setModalPosition(null);
  }, []);

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
    const newScale = Math.max(transform.scale / 1.2, 0.3);
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

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      // Approximate character width (adjust as needed)
      if (testLine.length * 8 <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
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
    const centerX = 800; // Merkezi daha sağa kaydırdık subtopicler için yer açmak için
    const stageSpacing = 300; // Çok daha fazla dikey boşluk subtopicler için

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
      const fromStep = roadmapData.steps.find(step => step.id === connection.from);
      const toStep = roadmapData.steps.find(step => step.id === connection.to);
      
      if (!fromStep || !toStep) return null;
      
      return (
        <line
          key={`connection-${index}`}
          x1={fromStep.position.x + 100}
          y1={fromStep.position.y + 25}
          x2={toStep.position.x + 100}
          y2={toStep.position.y + 25}
          stroke="#D1D5DB"
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
        step.position.x - (isMobile ? 220 : 270) : 
        step.position.x + (isMobile ? 170 : 220);
      const subtopicSpacing = isMobile ? 40 : 50; // Mobilde daha az boşluk
      const baseY = step.position.y - (subtopics.length * subtopicSpacing / 2);

      return subtopics.map((subtopic: { id: string; name: string; }, index: number) => {
        return (
        <g key={`subtopic-${stepIndex}-${isLeft ? 'left' : 'right'}-${index}`}>
          <line
            x1={isLeft ? step.position.x : step.position.x + 200}
            y1={step.position.y + 25}
            x2={isLeft ? baseX + 250 : baseX}
            y2={baseY + (index * subtopicSpacing) + 20}
            stroke={step.color}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <rect
            x={baseX}
            y={baseY + (index * subtopicSpacing)}
            width={isMobile ? "200" : "250"}
            height="35"
            rx="17"
            fill="white"
            stroke={step.color}
            strokeWidth="2"
            className="cursor-pointer hover:fill-gray-50 transition-all duration-200"
            onClick={(e) => fetchSummary(subtopic.name, e, subtopic.id)}
          />
          {(() => {
            const wrappedLines = wrapText(subtopic.name, isMobile ? 180 : 230);
            const lineHeight = 14;
            const totalHeight = wrappedLines.length * lineHeight;
            const startY = baseY + (index * subtopicSpacing) + 17 - (totalHeight / 2) + (lineHeight / 2);
            const centerX = baseX + (isMobile ? 100 : 125);
            
            return wrappedLines.map((line, lineIndex) => (
        <text
                key={`subtopic-line-${lineIndex}`}
                x={centerX}
                y={startY + (lineIndex * lineHeight)}
          textAnchor="middle"
          dominantBaseline="middle"
                className="text-sm fill-gray-700 font-medium cursor-pointer hover:fill-gray-900 transition-colors"
                style={{ fontSize: isMobile ? '11px' : '12px' }}
                onClick={(e) => fetchSummary(subtopic.name, e, subtopic.id)}
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
                  width="200"
                  height="50"
                  rx="25"
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
                  const wrappedLines = wrapText(step.title, 180);
                  const lineHeight = 16;
                  const totalHeight = wrappedLines.length * lineHeight;
                  const startY = step.position.y + 25 - (totalHeight / 2) + (lineHeight / 2);
                  
                  return wrappedLines.map((line, lineIndex) => (
                <text
                      key={`title-line-${lineIndex}`}
                  x={step.position.x + 100}
                      y={startY + (lineIndex * lineHeight)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                      className="font-semibold cursor-pointer fill-gray-800"
                      style={{ fontSize: '13px' }}
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

      

      {/* Summary Modal */}
      {(summaryData || isLoadingSummary || summaryError) && modalPosition && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          onClick={closeSummary}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden transform transition-all duration-300 ease-out scale-100"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {summaryData?.title || 'Özet Yükleniyor...'}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    📚 Detaylı Özet
                  </span>
                </div>
              </div>
              <button
                onClick={closeSummary}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 flex-shrink-0"
                title="Kapat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[65vh] bg-white">
              {isLoadingSummary && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
                  </div>
                  <span className="mt-4 text-gray-600 text-base font-medium">İçerik yükleniyor...</span>
                  <span className="mt-1 text-gray-400 text-sm">Lütfen bekleyin</span>
                </div>
              )}

              {summaryError && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-red-800 font-semibold mb-1">Bir hata oluştu</h4>
                      <p className="text-red-700 text-sm leading-relaxed">{summaryError}</p>
                    </div>
                  </div>
                </div>
              )}

              {summaryData && !isLoadingSummary && (
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-blue-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // Custom styling for different elements
                      h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5 first:mt-0">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4 first:mt-0">{children}</h3>,
                      p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4 text-base">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 mb-4 italic text-blue-900">{children}</blockquote>,
                      code: ({children, className}) => {
                        const isInline = !className;
                        return isInline ? 
                          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code> :
                          <code className={className}>{children}</code>;
                      },
                      pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm">{children}</pre>,
                      strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                      a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      hr: () => <hr className="my-6 border-gray-300" />,
                      table: ({children}) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-gray-300">{children}</table></div>,
                      thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                      tbody: ({children}) => <tbody>{children}</tbody>,
                      tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                      th: ({children}) => <th className="px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0">{children}</th>,
                      td: ({children}) => <td className="px-4 py-2 text-gray-700 border-r border-gray-300 last:border-r-0">{children}</td>,
                    }}
                  >
                    {summaryData.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 pt-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Detaylı bilgi için içeriği okuyun
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeSummary}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Anladım
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapMindmap;
