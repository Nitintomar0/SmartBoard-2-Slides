import PDFDocument from 'pdfkit-browserify';

/**
 * Generate thumbnail previews for each PDF page
 */
export function generatePDFThumbnails(
  outline: { slides: Array<{ mathEquation?: boolean, type?: string, textOnly?: boolean, originalImage?: boolean, elementsOnly?: boolean }> },
  template: string,
  theme: string
): string[] {
  // Filter out mathematical equation slides
  const visibleSlides = outline.slides.filter((slide) => !slide.mathEquation);

  return visibleSlides.map((slide) => {
    return generateThumbnailForSlide(slide);
  });
}

/**
 * Helper function to generate thumbnail for a specific slide type
 */
function generateThumbnailForSlide(slide: { type?: string, textOnly?: boolean, originalImage?: boolean, elementsOnly?: boolean }): string {
  if (slide.type === "title") {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChgF/uK1mBwAAAABJRU5ErkJggg==";
  } else if (slide.textOnly) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==";
  } else if (slide.originalImage) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==";
  } else if (slide.elementsOnly) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAHnOcQAAAAABJRU5ErkJggg==";
  }
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGj4DwABCQEBtxmN7wAAAABJRU5ErkJggg==";
}

interface Slide {
  mathEquation?: boolean;
  title?: string;
  content?: string | string[];
  imageUrl?: string;
  type?: string;
}

interface Outline {
  slides: Slide[];
  summary?: string;
  title?: string;
}

/**
 * Create an actual PDF file as a Blob with proper text alignment and image inclusion
 */
export async function createPDFBlob(
  outline: any,
  template: string,
  theme: string,
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure outline is defined with proper defaults
      const safeOutline = outline || {};
      const safeSlides = Array.isArray(outline?.slides) ? outline.slides : [];
      
      // Only warn if slides array is empty
      if (safeSlides.length === 0) {
        console.warn('Warning: Empty slides array in outline structure');
      }

      // Filter out mathematical equation slides and include summary
      const visibleSlides = safeSlides.filter((slide) => slide && !slide.mathEquation);
      
      // Add summary slide if available
      if (outline.summary) {
        visibleSlides.push({
          type: "summary",
          title: "Summary",
          content: outline.summary,
        });
      }

      // Create a new PDF document
      const doc = new PDFDocument({
        autoFirstPage: false,
        size: 'letter',
        margin: 50,
        info: {
          Title: outline.title || 'Presentation',
          Author: 'SmartBoard2Slides',
          Subject: 'Whiteboard Content',
          Keywords: 'presentation,whiteboard,slides',
          CreationDate: new Date(),
        }
      });

      // Collect PDF chunks
      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));

      // Process each slide
      for (const slide of visibleSlides) {
        // Add a new page for each slide
        doc.addPage();

        // Add title
        if (slide.title) {
          doc.fontSize(24)
             .font('Helvetica-Bold')
             .text(slide.title, {
               align: 'left',
             });
        }

        // Add content
        if (slide.content) {
          const content = Array.isArray(slide.content)
            ? slide.content.join('\n')
            : String(slide.content);

          doc.moveDown()
             .fontSize(14)
             .font('Helvetica')
             .text(content, {
               align: 'left',
               lineGap: 10,
             });
        }

        // Add image if available
        if (slide.imageUrl) {
          try {
            // Process the image URL directly
            // PDFKit can handle data URLs directly without needing Buffer.from
            const imageUrl = slide.imageUrl;
            
            // Calculate dimensions to fit the page
            const maxWidth = doc.page.width - 100;
            const maxHeight = doc.page.height - (doc.y || 0) - 50;
            
            // Add image directly using the data URL
            doc.moveDown()
               .image(imageUrl, {
                 fit: [maxWidth, maxHeight],
                 align: 'center',
               });
          } catch (imageError) {
            console.error('Error adding image to slide:', imageError);
          }
        }
      }

      // Finalize the PDF
      doc.end();

      // Wait for PDF to finish writing
      doc.on('end', () => {
        try {
          // Combine all chunks into a single Uint8Array
          const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
          const pdfBuffer = new Uint8Array(totalLength);
          let offset = 0;
          chunks.forEach(chunk => {
            pdfBuffer.set(chunk, offset);
            offset += chunk.length;
          });
          
          const blob = new Blob([pdfBuffer], { 
            type: 'application/pdf'
          });
          resolve(blob);
        } catch (blobError) {
          reject(new Error(`Failed to create PDF blob: ${(blobError as Error).message}`));
        }
      });

      doc.on('error', (error) => reject(error));

    } catch (error) {
      console.error("Error creating PDF blob:", error);
      reject(new Error(`Failed to create PDF: ${(error as Error).message}`));
    }
  });
}