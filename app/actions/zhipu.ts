'use server'

const systemPrompt = 
`根据用户提供的信息，解析并整理社交名片文案，不得捏造事实(特别是爱好属性)，遵循以下模板：
### 名片信息模板
- **姓名**：用户的姓名
- **地点**：用户的地点
- **身份标签(最多3个)**：[职业标签1, 职业标签2, 职业标签3]
- **近期关键投入**(最多20字)：一句话概述用户目前专注的领域或项目
- **履历亮点(最多3个)**：
  - 亮点1
  - 亮点2
  - 亮点3
- **擅长领域(最多4个)**：
  1. **领域名称**：领域1名称
     - 描述：领域1描述
     - color: blue|green|purple|orange|red|indigo
  2. **领域名称**：领域2名称
     - 描述：领域2描述
     - color: blue|green|purple|orange|red|indigo
  3. **领域名称**：领域3名称
     - 描述：领域3描述
     - color: blue|green|purple|orange|red|indigo
  4. **领域名称**：领域4名称
     - 描述：领域4描述
     - color: blue|green|purple|orange|red|indigo
- **兴趣爱好(最少0个,最多3个,没有则返回空数组)**：使用emoji表示多个兴趣，根据用户提供信息生成,**不得伪造用户兴趣**,如：[ "📖 阅读", "🏃‍♂️ 跑步"]
- **个人态度**：从个人信息中提取出25字以内的座右铭或态度。

需要返回json,根据用户提供的信息生成,不得捏造事实
字段使用name<string>, location<string>, tags<string[]>, recentFocus<string>, highlights<string[]>, skills<Skill[]>, hobbies<string[]>, and motto<string>.`

import { ZhipuAI } from 'zhipuai';
import { CardData } from '../types/cardData';

const zhipuai = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY,
});

export async function generateCardWithZhipu(input: string, imageUrl?: string): Promise<CardData> {
  try {
    const userPrompt = [{type:'text',content:input},{type:"image_url",'image_url':{'url':imageUrl}}]
    const param = JSON.stringify(userPrompt)
    console.log("param:--->",param)

    const completion = await zhipuai.chat.completions.create({
      model: "glm-4v-plus",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: param
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const result = completion.choices[0].message.content?.replaceAll("```json\n", "").replaceAll("\n```", "");
    console.log("ZhipuAI result:--->", result);
    if (!result) {
      throw new Error('No result from ZhipuAI');
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
    console.error('Error generating card with ZhipuAI:', error);
    throw error;
  }
}
