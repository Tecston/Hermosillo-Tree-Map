// src/components/UI/Card.tsx
import React from 'react'
import { ThumbsUp, MessageCircle } from 'lucide-react'

export interface CardProps {
  title: string
  description: string
  author: string
  date: string
  category: string
  supports: number
  comments: number
  imageUrl?: string
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  author,
  date,
  category,
  supports,
  comments,
  imageUrl,
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
    {imageUrl && (
      <div className="md:col-span-1 h-32 md:h-auto">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    )}

    <div className="md:col-span-2 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
        <span>{author} • {date}</span>
        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
          {category}
        </span>
      </div>

      <div className="flex items-center space-x-4 mt-3">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
          <ThumbsUp size={16} />
          <span>{supports}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
          <MessageCircle size={16} />
          <span>{comments}</span>
        </button>
      </div>
    </div>
  </div>
)

export default Card
