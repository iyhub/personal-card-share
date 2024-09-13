import React from 'react';
import { LucideIcon, User, MapPin, Briefcase, Star, Book, Heart, Quote, LucideProps } from 'lucide-react';

interface Skill {
  name: string;
  description: string;
  color: string;
}

interface CardProps {
  data: {
    name: string;
    location: string;
    tags: string[];
    recentFocus: string;
    highlights: string[];
    skills: Skill[];
    hobbies: string[];
    motto: string;
    headerGradient: string;
    icons: {
      recentFocus: LucideIcon;
      highlights: LucideIcon;   
      skills: LucideIcon;
      hobbies: LucideIcon;
    };
    avatarUrl: string | null;
    qrCodeUrl: string | null;
  };
}

const Card: React.FC<CardProps> = ({ data }) => {
  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100",
      green: "bg-green-100",
      purple: "bg-purple-100",
      orange: "bg-orange-100",
      red: "bg-red-100",
      indigo: "bg-indigo-100",
    };
    return colorMap[color] || "bg-gray-100";
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* 头部信息 */}
      <div className={`p-6 bg-gradient-to-r ${data.headerGradient} text-white`}>
        <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 border-4 border-white overflow-hidden">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-full h-full p-4" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-center">{data.name}</h1>
        <div className="flex items-center justify-center mt-2">
          <MapPin size={16} className="mr-1" />
          <span>{data.location}</span>
        </div>
        <div className="flex flex-wrap justify-center mt-2 gap-2">
          {data.tags.map((tag, index) => (
            <span key={index} className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 近期关键投入 */}
      <div className="p-6 bg-blue-50">
        <div className="flex items-center mb-2">
          <data.icons.recentFocus className="mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">近期关键投入</h2>
        </div>
        <p className="text-sm text-gray-600">{data.recentFocus}</p>
      </div>

      {/* 履历亮点 */}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <data.icons.highlights className="mr-2 text-yellow-500" />
          <h2 className="text-lg font-semibold">履历亮点</h2>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {data.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </div>

      {/* 擅长领域 */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center mb-2">
          <Book className="mr-2 text-green-500" />
          <h2 className="text-lg font-semibold">擅长领域</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data.skills.map((skill, index) => (
            <div key={index} className={`${getColorClass(skill.color)} p-3 rounded-lg`}>
              <h3 className="font-semibold text-sm">{skill.name}</h3>
              <p className="text-xs text-gray-600">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 兴趣爱好 */}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <data.icons.hobbies className="mr-2 text-red-500" />
          <h2 className="text-lg font-semibold">兴趣爱好</h2>
        </div>
        <p className="text-sm text-gray-600">
          {data.hobbies.join(' | ')}
        </p>
      </div>

      {/* 页脚 */}
      <div className="p-6 bg-gray-800 text-white flex justify-between items-center">
        <div className="flex-1">
          <Quote size={20} className="mb-2 text-blue-300" />
          <p className="text-sm italic">"{data.motto}"</p>
        </div>
        <div className="w-24 h-24 bg-white rounded-lg ml-4 overflow-hidden">
          {data.qrCodeUrl ? (
            <img src={data.qrCodeUrl} alt="QR Code" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No QR Code
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
