import express from 'express';
import multer from 'multer';
import cors from 'cors';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// 🔥 Use the newer model: gemini-1.5-pro or gemini-1.5-flash
const model = genAI.getGenerativeModel({
//   model: 'models/gemini-1.5-pro', // You can also try: gemini-1.5-flash
model: 'models/gemini-2.0-flash',
});

app.post('/api/caption', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const tone = req.body.tone || 'funny';
    const imageData = await fs.promises.readFile(filePath);

    const prompt = `Generate a ${tone} Instagram caption for this image. Be concise and catchy. Do not use bold words. And each captions should have one line gap in between. Give 1-2 liner response. Avoid any explaination or Intro text like "here are some examples etc"`;
    // const prompt = `You are a creative caption writer for social media. Based on the uploaded image, generate 3 unique Instagram captions in the "${tone}" tone. 

    //     Use this template - 

    //     Caption 1 - " The first caption"
    //     Caption 2 - "The 2nd Caption"
    //     Caption 3 - "The 3rd Caption"

    //     Do not use bold words. And each captions should have one line gap in between
        
    //     Tone: ${tone}
        
    //     Do not add any explanation or intro text. Just return the 3 formatted captions.`;


    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: req.file.mimetype,
              data: imageData.toString('base64'),
            },
          },
        ],
      }],
    });

    const caption = result.response.text().trim();
    fs.unlinkSync(filePath); // Clean up uploaded file
    res.json({ caption });
  } catch (err) {
    console.error('🔥 Caption generation failed:', err);
    res.status(500).json({ caption: 'Something went wrong. Try again!' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 CaptionCraft Gemini server running on http://localhost:${PORT}`);
});
