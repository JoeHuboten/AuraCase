'use client';

import { useState } from 'react';
import { FiFacebook, FiTwitter, FiLink, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export default function SocialShare({ url, title, description, image }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: FiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
    },
    {
      name: 'Twitter',
      icon: FiTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]',
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-[#25D366] hover:border-[#25D366]',
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-[#0088cc] hover:border-[#0088cc]',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400 mr-1">Сподели:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Сподели в ${link.name}`}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border border-slate-600 text-slate-400 transition-all duration-200 hover:text-white ${link.color}`}
        >
          <link.icon size={16} />
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        aria-label="Копирай линк"
        className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 ${
          copied
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-slate-600 text-slate-400 hover:bg-accent hover:border-accent hover:text-white'
        }`}
      >
        {copied ? <FiCheck size={16} /> : <FiLink size={16} />}
      </button>
    </div>
  );
}
