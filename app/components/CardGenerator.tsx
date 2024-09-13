'use client';
import { useState, useRef, useEffect } from 'react';
import Card from "./Card";
import InputPanel from "./InputPanel";
import { generateCardWithZhipu } from '../actions/zhipu';
import { CardData } from '../types/cardData';
import { LucideIcon, Briefcase, Star, Book, Heart, Rocket, Trophy, Zap, Coffee, Download, Copy, X, Twitter } from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { FaSquareXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

const iconMap: { [key: string]: LucideIcon } = {
  Briefcase, Star, Book, Heart, Rocket, Trophy, Zap, Coffee
};
const defaultCardData: CardData = {
  name: "雷布斯",
  location: "北京",
  tags: ["企业家", "投资人", "科技创新者"],
  recentFocus: "推动小米集团在智能家居和电动汽车领域的创新",
  highlights: [
    "创立小米科技，打造全球领先的智能手机品牌",
    "担任金山软件董事长，推动公司转型",
    "入选《财富》“全球最具影响力的50位商界领袖”"
  ],
  skills: [
    { name: "企业管理", description: "擅长战略规划和团队领导", color: "blue" },
    { name: "产品创新", description: "推动“米粉文化”和“性价比战略”", color: "green" },
    { name: "投资眼光", description: "成功投资多家科技创新企业", color: "purple" },
    { name: "品牌营销", description: "善于利用社交媒体塑造个人品牌", color: "orange" }
  ],
  hobbies: ["📚 阅读", "🏃‍♂️ 跑步", "✈️ 旅行","👌 ARE YOU OK"],
  motto: "永远相信美好的事情即将发生",
  headerGradient: "from-orange-500 to-red-500",
  icons: {
    recentFocus: "Rocket",
    highlights: "Trophy",
    skills: "Zap",
    hobbies: "Heart"
  },
  avatarUrl: '/images/cute.png',
  qrCodeUrl: '/images/qr.png',
};

// const defaultCardData: CardData = {
//   name: "张三",
//   location: "北京",
//   tags: ["软件工程师", "全栈开发", "AI爱好者"],
//   recentFocus: "正在开发一个基于AI的个人助理应用，旨在提高日常工作效率",
//   highlights: [
//     "领导开发了公司核心产品，用户增长300%",
//     "获得2022年度最佳员工奖",
//     "在国际技术大会上进行主题演讲"
//   ],
//   skills: [
//     { name: "前端开发", description: "精通React、Vue和Angular", color: "blue" },
//     { name: "后端开发", description: "熟练使用Node.js和Python", color: "green" },
//     { name: "数据分析", description: "擅长使用Pandas和Sklearn", color: "purple" },
//     { name: "云计算", description: "有丰富的AWS和Azure经验", color: "orange" }
//   ],
//   hobbies: ["🏋️ 健身", "📚 阅读", "🎸 弹吉他", "✈️ 旅行"],
//   motto: "持续学习，不断创新，追求卓越",
//   headerGradient: "from-blue-500 to-purple-500",
//   icons: {
//     recentFocus: "Briefcase",
//     highlights: "Star",
//     skills: "Book",
//     hobbies: "Heart"
//   },
//   avatarUrl: '/images/cute.png',
//   qrCodeUrl: '/images/qr.png',
// };

export default function CardGenerator() {
  const [cardData, setCardData] = useState<CardData>(defaultCardData);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(defaultCardData.avatarUrl);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(defaultCardData.qrCodeUrl);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (input: string, newAvatarUrl: string | null, newQrCodeUrl: string | null) => {
    setIsLoading(true);
    try {
      const data = await generateCardWithZhipu(input);
      setCardData({
        ...data,
        icons: data.icons || defaultCardData.icons, // 使用默认图标如果 API 没有返回
        headerGradient: data.headerGradient || defaultCardData.headerGradient // 使用默认渐变如果 API 没有返回
      });
      setAvatarUrl(newAvatarUrl);
      setQrCodeUrl(newQrCodeUrl);
    } catch (error) {
      console.error('Error generating card:', error);
      // 这里应该添加错误处理，比如显示一个错误消息
      setCardData(defaultCardData); // 在错误情况下使用默认数据
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCanvas = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const link = document.createElement('a');
      link.download = 'my-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleExport = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'my-card.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting card:', error);
      }
    }
  };

  const handleCopy = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({
                  'image/png': blob
                })
              ]);
            //   alert('名片已成功复制到剪贴板！');
            } catch (err) {
              console.error('复制到剪贴板失败:', err);
              alert('复制到剪贴板失败，请重试。');
            }
          }
        }, 'image/png');
      } catch (error) {
        console.error('生成图片失败:', error);
        alert('生成图片失败，请重试。');
      }
    }
  };

  const cardDataWithIcons = {
    ...cardData,
    icons: {
      recentFocus: iconMap[cardData.icons?.recentFocus as keyof typeof iconMap] || iconMap.Briefcase,
      highlights: iconMap[cardData.icons?.highlights as keyof typeof iconMap] || iconMap.Star,
      skills: iconMap[cardData.icons?.skills as keyof typeof iconMap] || iconMap.Book,
      hobbies: iconMap[cardData.icons?.hobbies as keyof typeof iconMap] || iconMap.Heart,
    },
    avatarUrl,
    qrCodeUrl
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 md:p-8 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">AI 个人名片生成器</h1>
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/3 p-6 bg-gray-50">
          <InputPanel onGenerate={handleGenerate} />
        </div>
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-xl font-semibold">生成中...</p>
            </div>
          ) : (
            <>
              <div ref={cardRef} className="w-full max-w-md">
                <Card data={cardDataWithIcons} />
              </div>
              <div className="flex justify-center items-center space-x-4">
                <button
                    onClick={handleExport}
                    className="mt-4 flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    <Download size={20} className="mr-2" />
                    导出名片
                </button>

                {/* <button
                    onClick={handleCopy}
                    className="mt-4 flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    <Copy size={20} className="mr-2" />
                    拷贝名片
                </button> */}
              </div>
            </>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-600 text-center block mt-4">
        tips:AI生成内容仅供参考，请以实际情况为准 
        
      </span>
      <div className="flex justify-center items-center space-x-4">
      <Link href={'https://x.com/sh_awai'} className={'font-dingTalk'}>
                    <FaSquareXTwitter size={'18'}></FaSquareXTwitter>
                </Link>
                </div>
      
    </div>
  );
}