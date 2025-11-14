import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ClothingCategory, ImagePayload, UserImagesPayload, ClothingItemPayload } from './types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

app.post('/api/classify', async (req: Request, res: Response) => {
    const { image } = req.body as { image: ImagePayload };

    if (!image || !image.mimeType || !image.data) {
        return res.status(400).json({ error: 'Image data is required.' });
    }
    
    const prompt = `Analyze the clothing item in the image and classify it into one of the following categories: ${Object.values(ClothingCategory).join(', ')}. Also, provide a brief, descriptive name for the item (e.g., "Blue Denim Jacket", "White Sneakers"). Respond with ONLY a JSON object containing "category" and "name".`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: image.mimeType, data: image.data } }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING, enum: Object.values(ClothingCategory) }
                    },
                    required: ['name', 'category']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (Object.values(ClothingCategory).includes(result.category)) {
            res.json({
                name: result.name,
                category: result.category as ClothingCategory
            });
        } else {
            throw new Error(`Invalid category received from AI: ${result.category}`);
        }
    } catch (error) {
        console.error("Error classifying item with Gemini:", error);
        res.status(500).json({ error: "Failed to classify the clothing item. Please try again." });
    }
});


app.post('/api/generate-outfit', async (req: Request, res: Response) => {
    const { userImages, items } = req.body as { userImages: UserImagesPayload, items: ClothingItemPayload[] };

    if (!userImages.fullBody || !userImages.headshot) {
        return res.status(400).json({ error: "User images are required." });
    }
    if (!items || items.length === 0) {
        return res.status(400).json({ error: "At least one clothing item is required." });
    }

    const itemDescriptions = items.map(item => `${item.category}: ${item.name}`).join(', ');

    const prompt = `The first image provided is the 'user_body' which shows the person and pose to use. The second image is the 'user_headshot' for facial reference. The following images are the clothing items.
Your task is to generate a photorealistic image of the person from the 'user_body' image, with their face matching the 'user_headshot'. This person should be wearing the following clothing items: ${itemDescriptions}.
IMPORTANT: IGNORE any people or models that may appear in the images of the clothing items. The final subject MUST be the person from the user's photos.
The clothing should fit naturally on their body, maintaining the original pose from the 'user_body' image as closely as possible. Place the person against a simple, neutral studio background. The result should be a seamless and realistic composition.`;

    const imageParts = [
        { inlineData: { mimeType: userImages.fullBody.mimeType, data: userImages.fullBody.data } },
        { inlineData: { mimeType: userImages.headshot.mimeType, data: userImages.headshot.data } },
        ...items.map(item => ({ inlineData: { mimeType: item.image.mimeType, data: item.image.data } })),
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt },
                    ...imageParts
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts[0];
        if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
            res.json({ image: firstPart.inlineData.data });
        } else {
            throw new Error("No image was generated in the response.");
        }
    } catch (error) {
        console.error("Error generating outfit with Gemini:", error);
        res.status(500).json({ error: "Failed to generate outfit. Please check the console for more details." });
    }
});


app.listen(port, () => {
    console.log(`ClosetHaus backend listening on port ${port}`);
});
