/**
 * Central export point for PDF and PPT generation functionality
 */

// Import functionality from modular files
import { generatePDFThumbnails, createPDFBlob } from '@/lib/pdf-generation';
import { generateSlideThumbnails, createPptxBlob } from '@/lib/ppt-generation';
import { generatePresentationOutline, isSlideVisible, formatTextContent } from '@/lib/export-utils';

// Ensure pptxgenjs is imported
import pptxgen from 'pptxgenjs';

// Create the generatePDF function that combines PDF generation steps
export async function generatePDF({
  text,
  diagrams,
  template,
  theme,
  slides,
  accessibility,
  highContrast,
  includeSourceImage
}: {
  text: string;
  diagrams: any[];
  template: string;
  theme: string;
  slides: any[];
  accessibility: boolean;
  highContrast: boolean;
  includeSourceImage: boolean;
}) {
  try {
    // Filter out mathematical equation slides
    const visibleSlides = slides.filter(slide => !slide.mathEquation);
    
    // Create outline object with proper structure
    const outline = {
      slides: visibleSlides || [],
      summary: null // Add summary if needed
    };
    
    // Create PDF blob with proper text alignment and image inclusion
    const pdfBlob = await createPDFBlob(outline, template, theme);
    
    // Return the blob with additional metadata
    return {
      blob: pdfBlob,
      url: URL.createObjectURL(pdfBlob),
      filename: 'presentation.pdf',
      error: null
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { blob: null, error };
  }
}

// Create the generatePPTX function that combines PPT generation steps
export async function generatePPTX({
  text,
  diagrams,
  template,
  theme,
  slides,
  accessibility,
  highContrast,
  includeSourceImage
}: {
  text: string;
  diagrams: any[];
  template: string;
  theme: string;
  slides: any[];
  accessibility: boolean;
  highContrast: boolean;
  includeSourceImage: boolean;
}) {
  try {
    // Filter out mathematical equation slides
    const visibleSlides = slides.filter(slide => !slide.mathEquation);
    
    // Create PPTX blob with proper text alignment and image inclusion
    const pptxBlob = await createPptxBlob(visibleSlides, template, theme);

    // Return the blob with additional metadata
    return {
      blob: pptxBlob,
      url: URL.createObjectURL(pptxBlob),
      filename: 'presentation.pptx',
      error: null
    };
  } catch (error) {
    console.error('Error generating PPTX:', error);
    return { blob: null, error };
  }
}

// Re-export all functionality
export {
  // PDF Generation
  generatePDFThumbnails,
  createPDFBlob,
  
  // PPT Generation
  generateSlideThumbnails,
  createPptxBlob,
  
  // Shared Utilities
  generatePresentationOutline,
  isSlideVisible,
  formatTextContent,
};
