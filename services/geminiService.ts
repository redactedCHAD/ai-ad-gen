
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildImagePrompt = (description: string, styles: string[], hasSecondaryImage: boolean): string => {
  const styleText = styles.join(', ');
  let prompt = `Regenerate the primary product photo into a high-quality advertisement image.

Ad context: "${description}"

Apply these styles: ${styleText}.`;

  if (hasSecondaryImage) {
    prompt += `\n\nUse the secondary image for context (e.g., product in use, environment inspiration) but ensure the final ad focuses on the product from the primary photo.`;
  }
  
  prompt += `\n\nThe final image should be a professional ad creative with the product as the main subject.`;

  return prompt;
};

export const generateStyledImage = async (
  primaryImage: UploadedFile,
  secondaryImage: UploadedFile | null,
  description: string,
  styles: string[]
): Promise<{ imageUrl: string | null; text: string | null }> => {
  const model = 'gemini-2.5-flash-image-preview';

  const prompt = buildImagePrompt(description, styles, !!secondaryImage);

  const parts: ({ inlineData: { data: string; mimeType: string; }; } | { text: string; })[] = [];

  parts.push({
    inlineData: {
      data: primaryImage.base64,
      mimeType: primaryImage.mimeType,
    },
  });

  if (secondaryImage) {
    parts.push({
      inlineData: {
        data: secondaryImage.base64,
        mimeType: secondaryImage.mimeType,
      },
    });
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;
    
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          } else if (part.text) {
            text = part.text;
          }
        }
    }
    
    if (!imageUrl) {
        throw new Error("API did not return an image. It might be due to safety policies.");
    }

    return { imageUrl, text };

  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
};

export const generateVideoAd = async (
  image: UploadedFile,
  videoDescription: string,
  styles: string[]
): Promise<string> => {
    let prompt = `Create a short, cinematic, UGC video ad based on this product. Ad context: "${videoDescription}"`;

    if (styles.length > 0) {
        prompt += `\nApply these video styles: ${styles.join(', ')}.`;
    }

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: image.base64,
                mimeType: image.mimeType,
            },
            config: {
                numberOfVideos: 1
            }
        });

        while (!operation.done) {
            // Wait for 10 seconds before polling again
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found. The result might be blocked by safety policies.");
        }
        
        // The API key must be appended to the download URI to fetch the video
        const videoUrlWithKey = `${downloadLink}&key=${process.env.API_KEY}`;
        
        const videoResponse = await fetch(videoUrlWithKey);
        if (!videoResponse.ok) {
            const errorText = await videoResponse.text();
            console.error("Failed to download video:", errorText);
            throw new Error(`Failed to download video: ${videoResponse.statusText}`);
        }
        
        const videoBlob = await videoResponse.blob();
        const objectUrl = URL.createObjectURL(videoBlob);
        
        return objectUrl;

    } catch (error) {
        console.error("Error calling Gemini API for video generation:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the video.");
    }
};
