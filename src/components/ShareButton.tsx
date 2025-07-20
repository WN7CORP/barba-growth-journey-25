
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
  const currentUrl = window.location.origin + '/produto/' + encodeURIComponent(productName);

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
          className={`bg-blue-500 hover:bg-blue-600 border-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border shadow-lg">
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer hover:bg-gray-50">
          <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer hover:bg-gray-50">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Link copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copiar link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
