import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

let instanceCounter = 0;

export default function LanguageSelector() {
  const [elementId] = useState(() => `google_translate_element_${++instanceCounter}`);

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
        // @ts-ignore
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
          const elements = document.querySelectorAll('[id^="google_translate_element_"]');
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
      console.log('📥 Loading Google Translate script...');
    }
  }, [elementId]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div 
        id={elementId}
        style={{
          display: 'inline-block',
          position: 'relative',
          zIndex: 999999,
          minHeight: '36px',
          minWidth: '120px'
        }}
      />
    </div>
  );
}
