import React from 'react';
import { Upload, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';

export function AssetManager() {
  const assets = [
    { id: 1, name: 'primary-logo.png', type: 'IMAGE', size: '124 KB', date: '2026-06-12' },
    { id: 2, name: 'dark-mode-logo.png', type: 'IMAGE', size: '130 KB', date: '2026-06-12' },
    { id: 3, name: 'custom-font.woff2', type: 'FONT', size: '45 KB', date: '2026-06-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-xl border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Asset Manager</h3>
            <p className="text-muted-foreground">Upload and manage your brand assets like logos, fonts, and watermarks.</p>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center mb-8 bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors">
          <Upload className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG, TTF, or WOFF2 (max. 5MB)</p>
        </div>

        {/* Asset Grid */}
        <h4 className="font-semibold mb-4">Uploaded Assets</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border rounded-lg p-4 flex flex-col group">
              <div className="h-24 bg-muted rounded-md mb-3 flex items-center justify-center">
                {asset.type === 'IMAGE' ? (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <FileText className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate">{asset.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{asset.size} • {asset.date}</p>
                </div>
                <button className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
