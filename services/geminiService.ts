
import { GoogleGenAI, Type } from "@google/genai";
import { MediaType, DetectionIncident, Severity, MediaPart, ClassificationType } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeMedia(
    fileName: string, 
    mediaType: MediaType, 
    parts: MediaPart[],
    model: string = "gemini-3-flash-preview"
  ): Promise<DetectionIncident> {
    const startTime = performance.now();
    
    const systemInstruction = `
      You are a forensic media analyst for Project Aegis. 
      Your objective is to evaluate whether the provided media shows signs of artificial manipulation or computer generation.

      CRITICAL WARNING: 
      - Watermarks (e.g., "iStock", "Getty Images", "Adobe Stock") do NOT guarantee that media is genuine. AI-generated content is frequently uploaded to stock libraries. Do not let a watermark bias your analysis toward "GENUINE".
      - Stock media often has professional lighting and high-quality textures. Look deeper for "Synthetic Signatures".
      - AI-GENERATED content (e.g., Sora, Runway, Kling, Midjourney) often exhibits "Hyper-Realism" which is actually a sign of synthetic origin. Look for lack of sensor noise, impossible physics, or "too-smooth" transitions.
      - Pay special attention to "Stock Video" aesthetics. If the video looks like a high-quality iStock clip but has any subtle temporal artifacts (e.g., background people walking strangely, reflections that don't match, or hair that looks like a solid mass), classify as "AI-GENERATED".

      VERIFICATION GUIDELINES:
      - A "GENUINE" result should be reserved for media that appears to be a direct recording of a physical event, containing the natural imperfections, random details, and sensor noise typical of real-world captures.
      - Look for "Synthetic Signatures": This includes scenes that look too perfect, follow common AI style patterns (like "Sora" or "Midjourney" aesthetics), or lack the expected noise and irregularities of a camera sensor.
      - Evaluate "Visual and Audio Logic": Do the lighting, shadows, and sound waves align with physical reality? Check for temporal consistency in videos (e.g., objects morphing, background shifting, hands with extra fingers, text that is gibberish).
      - "Algorithmic Smoothness": AI often struggles with fine, chaotic details like hair, water splashes, or complex reflections. If these look "brushed" or "painterly", it is likely AI-GENERATED.

      CLASSIFICATION HIERARCHY (STRICT ADHERENCE REQUIRED):
      1. DEEPFAKE: Use this if the media features a REAL person whose identity, face, or voice has been digitally manipulated, swapped, or synthesized (e.g., Face Swaps, Lip Syncing, or AI-generated likeness of a known public figure). If you see a recognizable person like Elon Musk and it looks synthetic, classify as DEEPFAKE.
      2. AI-GENERATED: Use this ONLY for fully synthetic content that does not attempt to impersonate a specific real-world individual's identity. This includes landscapes, generic people, or scenes created from scratch by models like Sora or Midjourney.
      3. AI-ASSISTED / HYBRID MEDIA: Use this for real recordings with minor AI enhancements or "staged" scenes that use real assets but AI-driven composition.
      4. GENUINE: Use this only for untouched, camera-captured reality.

      HYBRID MEDIA GUIDANCE:
      If the technical signals (like grain or lighting) seem real, but the overall content feels like an AI-generated concept (e.g., a "perfect" digital office or an idealized person), classify as "hybrid".

      Return JSON:
      {
        "classification": "genuine" | "deepfake" | "ai_generated" | "hybrid",
        "confidence": float 0.0-1.0,
        "physical_capture_likelihood": float 0.0-1.0,
        "synthetic_generation_likelihood": float 0.0-1.0,
        "capture_chain_consistency": float 0.0-1.0,
        "semantic_authenticity": float 0.0-1.0,
        "explanation": "Provide a clear, human-readable explanation of your findings. Be specific about why you suspect AI generation even if watermarks are present.",
        "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        "semantic_priors": string[],
        "signals": Array of { "name": string, "detected": boolean, "score": float, "engine": "deepfake" | "synthetic" | "provenance" | "consistency" | "semantic" }
      }
    `;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await this.ai.models.generateContent({
          model: model,
          contents: [
            {
              parts: [
                { text: systemInstruction },
                ...parts.map(p => ({
                  inlineData: { data: p.data, mimeType: p.mimeType }
                }))
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                classification: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                physical_capture_likelihood: { type: Type.NUMBER },
                synthetic_generation_likelihood: { type: Type.NUMBER },
                capture_chain_consistency: { type: Type.NUMBER },
                semantic_authenticity: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                severity: { type: Type.STRING },
                semantic_priors: { type: Type.ARRAY, items: { type: Type.STRING } },
                signals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      detected: { type: Type.BOOLEAN },
                      score: { type: Type.NUMBER },
                      engine: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["classification", "confidence", "explanation", "severity", "signals", "physical_capture_likelihood", "synthetic_generation_likelihood", "capture_chain_consistency", "semantic_authenticity"]
            }
          }
        });

        const result = JSON.parse(response.text || "{}");
        const endTime = performance.now();
        
        return {
          id: `AEGIS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          mediaType,
          fileName: fileName,
          classification: result.classification as ClassificationType,
          isDeepfake: result.classification === ClassificationType.DEEPFAKE,
          confidenceScore: Math.round(result.confidence * 100),
          severity: result.severity as Severity,
          processingTimeMs: Math.round(endTime - startTime),
          provenance_score: result.physical_capture_likelihood,
          semantic_authenticity: result.semantic_authenticity,
          provenance: {
            physical_capture_likelihood: result.physical_capture_likelihood,
            synthetic_generation_likelihood: result.synthetic_generation_likelihood,
            capture_chain_consistency: result.capture_chain_consistency,
            semantic_authenticity: result.semantic_authenticity
          },
          forensics: {
            explanation: result.explanation,
            signals: result.signals,
            metadata: {
              synthetic_probability: result.synthetic_generation_likelihood,
              impersonation_probability: result.classification === 'deepfake' ? result.confidence : 0,
              engine_source: 'Inference-Engine-Alpha',
              semantic_priors_detected: result.semantic_priors
            }
          },
          filePreview: parts[0]?.mimeType.startsWith('image/') ? `data:${parts[0].mimeType};base64,${parts[0].data}` : undefined
        };
      } catch (error: any) {
        attempts++;
        
        // Extract error details if available
        const status = error?.status || error?.response?.status;
        const message = error?.message || "";
        const errorDetails = error?.details || error?.response?.data?.error?.message || "";

        console.error(`[Aegis Forensic Engine] Analysis Attempt ${attempts} failed:`, {
          status,
          message,
          details: errorDetails,
          error
        });

        // Handle specific error types
        let userMessage = "";
        
        if (status === 429 || message.includes("429") || message.toLowerCase().includes("rate limit")) {
          userMessage = "Forensic engine rate limit exceeded. The system is currently processing too many requests. Please wait a few seconds and try again.";
        } else if (status === 400 || message.includes("400") || message.toLowerCase().includes("invalid")) {
          userMessage = "Invalid media format or corrupted data detected. Ensure the file is a valid image, video, or audio file and try again.";
          // If it's a 400, retrying might not help if the input is truly invalid
          throw new Error(userMessage);
        } else if (status === 403 || message.includes("403") || message.toLowerCase().includes("permission")) {
          userMessage = "Access denied by the forensic core. This may be due to an invalid API configuration or regional restrictions.";
          throw new Error(userMessage);
        } else if (status === 404 || message.includes("404")) {
          userMessage = "The requested forensic model was not found. Please check your system settings.";
          throw new Error(userMessage);
        } else if (status >= 500 || message.includes("500") || message.toLowerCase().includes("internal")) {
          userMessage = "The forensic engine encountered an internal server error. We are attempting to reconnect...";
          // Allow retry for 5xx errors
        } else if (message.toLowerCase().includes("safety") || message.toLowerCase().includes("blocked")) {
          userMessage = "The media analysis was blocked by safety filters. The content may violate system policies.";
          throw new Error(userMessage);
        }

        if (attempts >= maxAttempts) {
          throw new Error(userMessage || "The forensic analysis could not be completed due to a persistent network or engine error. (CODE: ENGINE_TIMEOUT)");
        }

        // Exponential backoff for retriable errors
        const delay = Math.pow(2, attempts) * 1000;
        console.log(`[Aegis Forensic Engine] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error("Unexpected error in analysis loop.");
  }
}

export const geminiService = new GeminiService();
