
import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PhotoUploadProps {
  onUpload: (file: File, observacoes?: string) => void;
  dia: number;
}

export const PhotoUpload = ({ onUpload, dia }: PhotoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    await onUpload(selectedFile, observacoes);
    setSelectedFile(null);
    setPreview(null);
    setObservacoes('');
    setUploading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Foto do Dia {dia}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
              <Button variant="outline" onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}>
                Trocar Foto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium">Envie sua foto do dia</p>
                <p className="text-sm text-gray-600">PNG, JPG até 10MB</p>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <Button asChild>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    Escolher Arquivo
                  </label>
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações do Dia</label>
              <Textarea
                placeholder="Como você se sente hoje? Notou alguma mudança?"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Enviando...' : 'Salvar Foto do Dia'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
