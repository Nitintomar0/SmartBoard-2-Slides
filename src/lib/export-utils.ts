import { processImageWithGemini } from "./gemini";

/**
 * Helper function to parse text content and create a structured presentation outline
 * with proper preview mode handling
 */
export function generatePresentationOutline(text: string, diagrams: any[]) {
  const slides = [];

  // Extract title from content
  const titleMatch = text ? text.match(/^#\s+(.+)$/m) : null;
  const title = titleMatch ? titleMatch[1] : "Whiteboard Content Extraction";

  // Create title slide
  slides.push({
    type: "title",
    title: title,
    content: ["Extracted text and images from the whiteboard"],
    diagrams: [],
    sourceImage: true,
    imageUrl: diagrams && diagrams.length > 0 && diagrams[0].imageData ? diagrams[0].imageData : null,
  });

  // Create extracted text slide with proper formatting
  const textContent = text
    ? text.split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
    : ["Extracted text will appear here"];

  slides.push({
    type: "section",
    title: "Extracted Text",
    content: textContent.length > 0 ? textContent : ["No text was extracted from the image"],
    diagrams: [],
    textOnly: true,
  });

  // Create original image slide with actual image URL
  if (diagrams && diagrams.length > 0 && diagrams[0].imageData) {
    slides.push({
      type: "section",
      title: "Original Image",
      content: ["Source whiteboard image"],
      diagrams: [],
      sourceImage: true,
      originalImage: true,
      imageUrl: diagrams[0].imageData,
    });
  }

  // Create extracted elements slides
  if (diagrams && diagrams.length > 0) {
    diagrams.forEach((diagram, index) => {
      // Skip mathematical equation diagrams in preview mode
      if (diagram.type === "equation") {
        diagram.mathEquation = true;
      }

      slides.push({
        type: "diagram",
        title: diagram.label || `Diagram ${index + 1}`,
        content: [diagram.description || `Visual element detected in the whiteboard`],
        diagrams: [diagram],
        elementsOnly: true,
        imageUrl: diagram.imageData || null,
        mathEquation: diagram.mathEquation || false,
      });
    });
  }

  // Add summary information
  const summary = generateSummary(textContent, diagrams);

  return {
    title: title || "Whiteboard Extraction",
    slides: slides,
    totalSlides: slides.length,
    summary: summary,
  };
}

/**
 * Generate a summary of the content for preview mode
 */
function generateSummary(textContent: string[], diagrams: any[]): string {
  const textSummary = textContent.length > 0
    ? "Text content extracted successfully"
    : "No text content found";

  const diagramCount = diagrams.length;
  const diagramSummary = diagramCount > 0
    ? `${diagramCount} visual elements identified`
    : "No visual elements found";

  return `${textSummary}\n${diagramSummary}`;
}

/**
 * Helper function to format text content with proper alignment
 */
export function formatTextContent(text: string): string[] {
  if (!text) return [];
  
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Helper function to check if a slide should be included in preview/export
 */
export function isSlideVisible(slide: any): boolean {
  // Exclude mathematical equation slides
  if (slide.mathEquation) return false;
  
  // Include all other slides
  return true;
}