import axios from "axios";
import dotenv from 'dotenv'
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
dotenv.config();

const New_key = process.env.New_key;
export const postAiCalls = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const options = {
    method: "POST",
    header: {
      Authorization: `Bearer ${New_key}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Can you always write a social media bio for me with the following text? ${text}, Write just the generated text and do not thank me.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    }),
  };

  
    const results = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      options.data,
      { headers: options.header } // Pass the headers separately
    );
    const feedback = results.data.choices[0].message.content;
    res.json({ feedback });
    console.log(feedback);
  
});
