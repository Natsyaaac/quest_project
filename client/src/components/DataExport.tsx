import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { exportDataToExcel, importDataFromExcel } from "@/lib/storage";

interface DataExportProps {
  onDataImported: () => void;
}

export function DataExport({ onDataImported }: DataExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const blob = exportDataToExcel();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progres-belajar-${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Diekspor",
      description: "Progresmu sudah disimpan ke file Excel.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const success = await importDataFromExcel(file);
      
      if (success) {
        toast({
          title: "Data Diimpor",
          description: "Progresmu sudah dipulihkan dengan sukses.",
        });
        onDataImported();
      } else {
        toast({
          title: "Impor Gagal",
          description: "Format file tidak valid. Pastikan file Excel sesuai format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Impor Gagal",
        description: "Tidak bisa membaca file Excel.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card data-testid="card-data-export">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-muted">
            <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Cadangkan & Pulihkan</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Ekspor progresmu ke file Excel untuk menyimpannya, atau impor file cadangan untuk memulihkan data.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex-1"
            data-testid="button-export-data"
          >
            <Download className="w-4 h-4 mr-2" />
            Ekspor Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex-1"
            data-testid="button-import-data"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? "Mengimpor..." : "Impor Excel"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
            data-testid="input-import-file"
          />
        </div>
      </CardContent>
    </Card>
  );
}
