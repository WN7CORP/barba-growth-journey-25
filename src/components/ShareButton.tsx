
import React, { useState } from 'react';
import { Share2, Copy, MessageCircle, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  productName: string;
  productLink: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  productName, 
  productLink, 
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);

  const shareText = `Confira este produto: ${productName}`;
  // Usar a URL atual da página em vez de construir uma nova
  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`bg-gradient-to-r from-indigo-500/90 to-purple-600/90 border-0 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all hover:scale-105 backdrop-blur-sm ${className}`}
        >
          <Share2 className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-md border border-gray-200/60 shadow-xl">
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer hover:bg-green-50 transition-colors">
          <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
          <span className="font-medium">WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer hover:bg-blue-50 transition-colors">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium text-green-600">Link copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium">Copiar link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
