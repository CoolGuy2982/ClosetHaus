import { Router } from 'express';
import multer from 'multer';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';

const router = Router();

// Configure Multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

// --- Gemini API Setup ---
const API_KEY = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Helper function to convert buffer to generative part
function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

// --- API Endpoints ---

/**
 * POST /api/classify
 * Handles clothing item classification.
 * Expects 'multipart/form-data' with an 'image' field.
 */
router.post('/classify', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image file uploaded.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      safetySettings
    });

    const categories = ['Top', 'Bottom', 'Shoes', 'Accessory'];
    const prompt = `Analyze the clothing item in the image and classify it into one of the following categories: ${categories.join(', ')}. 
    Also, provide a brief, descriptive name for the item (e.g., "Blue Denim Jacket", "White Sneakers"). 
    Respond with ONLY a JSON object containing "category" and "name".`;

    const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);
    
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Parse to ensure it's valid JSON and matches the frontend's expected type
    const classification = JSON.parse(responseText);
    
    if (!classification.name || !classification.category || !categories.includes(classification.category)) {
      throw new Error('Invalid classification format from AI.');
    }

    res.status(200).json(classification); // Sends { name: "...", category: "..." }

  } catch (error) {
    console.error('Error classifying image:', error);
    res.status(500).send('Error classifying image.');
  }
});

/**
 * POST /api/generate
 * Handles outfit generation (image-to-image with multiple items).
 * Expects 'application/json' with:
 * {
 * userImages: { headshot: { mimeType, data }, fullBody: { mimeType, data } },
 * items: [ { image: { mimeType, data }, name, category }, ... ]
 * }
 */
router.post('/generate', async (req, res) => {
  const { userImages, items } = req.body;

  if (!userImages?.fullBody || !userImages?.headshot) {
    return res.status(400).send('User headshot and full body images are required.');
  }
  if (!items || items.length === 0) {
    return res.status(400).send('At least one clothing item is required.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview", // Using a model that supports this kind of generation
      safetySettings
    });

    const itemDescriptions = items.map((item: any) => `${item.category}: ${item.name}`).join(', ');
  
    const prompt = `The first image provided is the 'user_body' which shows the person and pose to use. 
    The second image is the 'user_headshot' for facial reference. The following images are the clothing items.
    Your task is to generate a photorealistic image of the person from the 'user_body' image, with their face matching the 'user_headshot'. 
    This person should be wearing the following clothing items: ${itemDescriptions}.
    IMPORTANT: IGNORE any people or models that may appear in the images of the clothing items. The final subject MUST be the person from the user's photos.
    The clothing should fit naturally on their body, maintaining the original pose from the 'user_body' image as closely as possible. 
    Place the person against a simple, neutral studio background. The result should be a seamless and realistic composition.`;

    // Build the image parts array
    const imageParts: Part[] = [
      { inlineData: userImages.fullBody },
      { inlineData: userImages.headshot },
      ...items.map((item: any) => ({ inlineData: item.image })),
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    
    // Find the generated image part
    const generatedImagePart = result.response.candidates?.[0].content.parts.find(p => p.inlineData);

    if (!generatedImagePart || !generatedImagePart.inlineData) {
      throw new Error('No image generated by the model.');
    }

    // Send the base64 data of the *new* image back
    res.status(200).json({ base64Image: generatedImagePart.inlineData.data });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Error generating image.');
  }
});

export default router;