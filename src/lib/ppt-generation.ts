import pptxgen from 'pptxgenjs';
import { processImageWithGemini } from './gemini';

interface Slide {
  mathEquation?: boolean;
  type?: string;
  textOnly?: boolean;
  originalImage?: boolean;
  elementsOnly?: boolean;
  title?: string;
  content?: string | string[];
  imageUrl?: string;
}

interface PresentationOutline {
  slides: Slide[];
  summary?: string;
  title?: string;
}

/**
 * Generate base64 thumbnail previews based on slide types
 */
export function generateSlideThumbnails(
  outline: PresentationOutline | null,
  template: string,
  theme: string
): string[] {
  const visibleSlides = outline?.slides?.filter(slide => !slide?.mathEquation) || [];
  return visibleSlides.map(slide => getThumbnailByType(slide));
}

function getThumbnailByType(slide: Slide): string {
  const thumbnails: Record<string, string> = {
    title: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChgF/uK1mBwAAAABJRU5ErkJggg==", // Blue
    textOnly: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==", // Green
    originalImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==", // Red
    elementsOnly: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAHnOcQAAAAABJRU5ErkJggg==", // Purple
    default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGj4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" // Orange
  };

  if (slide.type === 'title') return thumbnails.title;
  if (slide.textOnly) return thumbnails.textOnly;
  if (slide.originalImage) return thumbnails.originalImage;
  if (slide.elementsOnly) return thumbnails.elementsOnly;

  return thumbnails.default;
}

/**
 * Create a PPTX blob from slide data
 */
export async function createPptxBlob(
  outline: PresentationOutline,
  template: string,
  theme: string
): Promise<Blob> {
  try {
    // Ensure outline is defined with proper defaults
    const safeOutline = outline || {};
    const safeSlides = Array.isArray(outline?.slides) ? outline.slides : [];
    
    // Only throw an error if we can't proceed at all
    if (safeSlides.length === 0) {
      console.warn('Warning: Empty slides array in outline structure');
    }

    const pres = new pptxgen();
    setPresentationMeta(pres, safeOutline);

    const visibleSlides = safeSlides.filter(slide => !slide?.mathEquation);

    for (const slide of visibleSlides) {
      const pptSlide = pres.addSlide();
      addSlideTitle(pptSlide, slide);
      addSlideContent(pptSlide, slide);
      await addSlideImage(pptSlide, slide);
    }

    if (safeOutline.summary) {
      addSummarySlide(pres, safeOutline.summary);
    }

    const buffer = await pres.write('blob');
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
  } catch (error) {
    console.error('Error creating PPTX:', error);
    throw new Error(`Failed to create PPTX file: ${(error as Error).message}`);
  }
}

// Helpers

function setPresentationMeta(pres: pptxgen, outline: PresentationOutline) {
  const title = outline.title || 'Whiteboard Content';
  pres.author = 'SmartBoard2Slides';
  pres.company = 'SmartBoard2Slides';
  pres.revision = '1';
  pres.subject = title;
  pres.title = title;
}

function addSlideTitle(pptSlide: pptxgen.Slide, slide: Slide) {
  if (slide?.title) {
    pptSlide.addText(slide.title, {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '10%',
      fontSize: 24,
      bold: true,
      align: 'left',
    });
  }
}

function addSlideContent(pptSlide: pptxgen.Slide, slide: Slide) {
  if (slide?.content) {
    const content = Array.isArray(slide.content)
      ? slide.content.join('\n')
      : String(slide.content);

    pptSlide.addText(content, {
      x: '5%',
      y: slide.title ? '20%' : '10%',
      w: '90%',
      h: slide.imageUrl ? '40%' : '70%',
      fontSize: 14,
      align: 'left',
      breakLine: true,
    });
  }
}

async function addSlideImage(pptSlide: pptxgen.Slide, slide: Slide) {
  if (!slide?.imageUrl) return;

  try {
    const imageData = slide.imageUrl.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    pptSlide.addImage({
      data: imageData,
      x: '5%',
      y: slide.content ? '65%' : '20%',
      w: '90%',
      h: slide.content ? '30%' : '60%',
    });
  } catch (error) {
    console.error('Error adding image to slide:', error);
  }
}

function addSummarySlide(pres: pptxgen, summary: string | string[]) {
  const slide = pres.addSlide();
  slide.addText('Summary', {
    x: '5%',
    y: '5%',
    w: '90%',
    h: '10%',
    fontSize: 24,
    bold: true,
    align: 'left',
  });

  const content = Array.isArray(summary) ? summary.join('\n') : String(summary);

  slide.addText(content, {
    x: '5%',
    y: '20%',
    w: '90%',
    h: '70%',
    fontSize: 14,
    align: 'left',
    breakLine: true,
  });
}
