import axios from "axios";

const NEW = process.env.New || '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';

export const postAiCalls = async (req, res) => {
  const { text } = req.body;

  const options = {
    method: "POST",
    header: {
      Authorization: `Bearer ${NEW}`,
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
      temperature: 0.7,
      max_tokens: 100,
    }),
  };

  try {
    const results = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      options.data,
      { headers: options.header } // Pass the headers separately
    );
    const feedback = results.data.choices[0].message.content;
    res.json({ feedback });
    console.log(feedback);
  } catch (error) {
    console.error("Error:", error.message);
    // Handle the error and send an error response
    res.status(500).json({ error: error.message });
  }
};
