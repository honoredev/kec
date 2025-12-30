import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

let instanceCounter = 0;

export default function SimpleLanguageSelector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementId] = useState(() => `google_translate_${++instanceCounter}`);

  useEffect(() => {
    const initializeElement = () => {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element ${elementId} not found`);
        return;
      }

      if (element.hasChildNodes()) {
        console.log(`Element ${elementId} already initialized`);
        return;
      }

      try {
        // @ts-ignore - Google Translate types
        if (window.google && window.google.translate) {
          console.log(`Initializing Google Translate for ${elementId}`);
          // @ts-ignore
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,rw,fr,sw',
              // @ts-ignore
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            elementId
          );
          console.log(`✅ ${elementId} initialized successfully`);
        }
      } catch (error) {
        console.error(`Error initializing ${elementId}:`, error);
      }
    };

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    
    if (existingScript) {
      // Script already loaded, just initialize this element
      // @ts-ignore
      if (window.google && window.google.translate) {
        setTimeout(initializeElement, 100);
      } else {
        // Wait for Google Translate to be ready
        const checkInterval = setInterval(() => {
          // @ts-ignore
          if (window.google && window.google.translate) {
            clearInterval(checkInterval);
            initializeElement();
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    } else {
      // Load script for the first time
      window.googleTranslateElementInit = function() {
        console.log('Google Translate script loaded');
        // Initialize all elements on the page
        setTimeout(() => {
          const elements = document.querySelectorAll('[id^="google_translate_"]');
          elements.forEach((el) => {
            if (!el.hasChildNodes() && el.id) {
              try {
                // @ts-ignore
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,rw,fr,sw',
                    // @ts-ignore
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                  },
                  el.id
                );
                console.log(`✅ Initialized ${el.id}`);
              } catch (error) {
                console.error(`Error initializing ${el.id}:`, error);
              }
            }
          });
        }, 200);
      };

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.body.appendChild(script);
      console.log('Google Translate script added to page');
    }
  }, [elementId]);

  return (
    <div className="flex items-center" style={{ minWidth: '120px', minHeight: '36px' }}>
      <div 
        id={elementId}
        ref={containerRef}
        style={{
          display: 'inline-block',
          position: 'relative',
          zIndex: 999999,
          minWidth: '120px',
          minHeight: '36px'
        }}
      />
      {/* Temporary debug indicator */}
      {!containerRef.current?.hasChildNodes() && (
        <div style={{ 
          padding: '8px 12px', 
          backgroundColor: 'rgba(255,255,255,0.9)', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#166534',
          fontWeight: '600'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
}
