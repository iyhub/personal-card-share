'use server'

import OpenAI from 'openai';
import { CardData } from '../types/cardData';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function openaiAction(input: string): Promise<CardData> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content: "you are a professional personal business card generation assistant. you will generate a JSON object containing the user's name<string>, location<string>, tags<string[]>, recent focus<string>, highlights<string[]>, skills<Skill[]>, hobbies<string[]>, and motto<string>."
        },
        {
            role: "system",
            content: "feild explain: name:user name, location:user country, tags:user job,no nore than 3 items, recent focus:recent dosomeing,no more than 2 items, highlights:user achievement no more than 3 items, skills:user skill no more than 3 items, hobbies:user hobby no more than 3 items, motto:user motto."
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0].message.content;
    console.log("openaiAction result:--->",result);
    if (!result) {
      throw new Error('No result from OpenAI');
    }

    const cardData: CardData = JSON.parse(result);

    // 添加随机图标和渐变色
    const icons = ['Briefcase', 'Star', 'Book', 'Heart', 'Rocket', 'Trophy', 'Zap', 'Coffee'];
    const gradients = [
      "from-blue-500 to-purple-500",
      "from-green-400 to-blue-500",
      "from-pink-500 to-yellow-500",
      "from-purple-400 to-red-500",
      "from-yellow-400 to-orange-500"
    ];

    return {
      ...cardData,
      headerGradient: gradients[Math.floor(Math.random() * gradients.length)],
      icons: {
        recentFocus: icons[Math.floor(Math.random() * icons.length)],
        highlights: icons[Math.floor(Math.random() * icons.length)],
        skills: icons[Math.floor(Math.random() * icons.length)],
        hobbies: icons[Math.floor(Math.random() * icons.length)],
      }
    };
  } catch (error) {
    console.error('Error generating card:', error);
    throw error;
  }
}
