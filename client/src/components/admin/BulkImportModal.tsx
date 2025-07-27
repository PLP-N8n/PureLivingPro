import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkImportModal({ isOpen, onClose }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read CSV content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvData(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const processBulkImport = async () => {
    if (!csvData && !file) {
      toast({
        title: 'Error',
        description: 'Please upload a CSV file or paste CSV data',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Parse CSV data into affiliate links
      const lines = csvData.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const linkData = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const link: any = {};
        
        headers.forEach((header, index) => {
          if (values[index]) {
            switch (header) {
              case 'url':
              case 'affiliate url':
              case 'link':
                link.url = values[index];
                break;
              case 'merchant':
              case 'store':
                link.merchant = values[index];
                break;
              case 'product name':
              case 'name':
              case 'title':
                link.productName = values[index];
                break;
              case 'category':
                link.category = values[index];
                break;
              case 'commission':
              case 'commission %':
                link.commission = values[index];
                break;
              case 'description':
                link.description = values[index];
                break;
              case 'image url':
              case 'image':
                link.imageUrl = values[index];
                break;
            }
          }
        });

        if (link.url && link.productName) {
          linkData.push(link);
        }
      }

      // Process links in batches
      const batchSize = 5;
      const results = [];
      
      for (let i = 0; i < linkData.length; i += batchSize) {
        const batch = linkData.slice(i, i + batchSize);
        
        try {
          const response = await apiRequest('POST', '/api/affiliate-links/bulk', {
            links: batch
          });
          const result = await response.json();
          results.push(...result.data);
          
          setProgress(Math.round(((i + batch.length) / linkData.length) * 100));
          
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
          console.error('Batch processing error:', error);
          results.push({ error: `Batch ${i}-${i + batch.length}: ${error.message}` });
        }
      }

      setResults({
        total: linkData.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        details: results
      });

      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-links'] });
      
      toast({
        title: 'Bulk Import Complete',
        description: `Processed ${linkData.length} links. ${results.filter(r => !r.error).length} successful.`
      });

    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `url,merchant,product name,category,commission,description,image url
https://amazon.com/dp/B123456,Amazon,Premium Omega-3,supplements,4,High-quality fish oil supplement,https://example.com/image.jpg
https://clickbank.com/product123,ClickBank,Wellness Guide,health,50,Complete wellness transformation guide,https://example.com/guide.jpg`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'affiliate-links-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import Affiliate Links
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file or paste CSV data to import multiple affiliate links at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div>
              <h3 className="font-medium">Need a template?</h3>
              <p className="text-sm text-muted-foreground">Download our CSV template to get started</p>
            </div>
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </div>

          {/* Manual CSV Input */}
          <div className="space-y-2">
            <Label htmlFor="csv-data">Or Paste CSV Data</Label>
            <Textarea
              id="csv-data"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="url,merchant,product name,category,commission,description,image url&#10;https://amazon.com/dp/B123456,Amazon,Premium Omega-3,supplements,4,High-quality fish oil supplement,https://example.com/image.jpg"
              rows={6}
              disabled={isProcessing}
            />
          </div>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Import Results
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">{results.total}</div>
                  <div className="text-muted-foreground">Total Links</div>
                </div>
                <div>
                  <div className="font-medium text-green-600">{results.successful}</div>
                  <div className="text-muted-foreground">Successful</div>
                </div>
                <div>
                  <div className="font-medium text-red-600">{results.failed}</div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              {results ? 'Close' : 'Cancel'}
            </Button>
            {!results && (
              <Button 
                onClick={processBulkImport} 
                disabled={isProcessing || (!csvData && !file)}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Import Links
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}