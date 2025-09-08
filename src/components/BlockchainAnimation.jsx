import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BlockchainAnimation = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    
    // Node class to manage individual nodes
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 2;
      }
      
      update(width, height) {
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        this.x += this.vx;
        this.y += this.vy;
      }
    }
    
    // Initialize canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };
    
    // Create initial nodes
    const initNodes = () => {
      const numberOfNodes = Math.floor((canvas.width * canvas.height) / 20000);
      nodes = Array.from({ length: numberOfNodes }, () => 
        new Node(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.update(canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(0, 254, 255, 1)' : 'rgba(0, 102, 255, 1)';
        ctx.fill();
        
        // Draw connections
        nodes.forEach(otherNode => {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = isDark 
              ? `rgba(0, 254, 255, ${1 - distance / 150})` 
              : `rgba(0, 102, 255, ${1 - distance / 150})`;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Set up canvas and start animation
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default BlockchainAnimation;