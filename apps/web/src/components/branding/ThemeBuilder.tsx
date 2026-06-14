import React, { useState } from 'react';

export function ThemeBuilder() {
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#1e40af');
  const [fontFamily, setFontFamily] = useState('Inter');

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-xl border">
        <h3 className="text-xl font-bold mb-4">Theme Builder</h3>
        <p className="text-muted-foreground mb-6">Customize the visual identity of your platform.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 rounded border"
                />
                <input 
                  type="text" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-10 rounded border"
                />
                <input 
                  type="text" 
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="Inter">Inter (Sans Serif)</option>
                <option value="Roboto">Roboto (Sans Serif)</option>
                <option value="Merriweather">Merriweather (Serif)</option>
                <option value="Outfit">Outfit (Modern)</option>
              </select>
            </div>

            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium w-full mt-4">
              Save Theme Changes
            </button>
          </div>

          {/* Preview */}
          <div className="border rounded-xl overflow-hidden bg-background">
            <div className="p-4 border-b bg-muted/50 font-medium">Live Preview</div>
            <div className="p-6 space-y-4" style={{ fontFamily }}>
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>Welcome to Acme Real Estate</div>
              <p className="text-muted-foreground">This is how your content will look to your customers and agents.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card shadow-sm text-center">
                  <div className="font-semibold mb-2">Properties</div>
                  <div className="text-3xl font-bold" style={{ color: primaryColor }}>124</div>
                </div>
                <div className="p-4 rounded-lg border bg-card shadow-sm text-center">
                  <div className="font-semibold mb-2">Leads</div>
                  <div className="text-3xl font-bold" style={{ color: secondaryColor }}>48</div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button 
                  style={{ backgroundColor: primaryColor }} 
                  className="px-4 py-2 text-white rounded-md text-sm font-medium"
                >
                  Primary Action
                </button>
                <button 
                  style={{ border: `1px solid ${secondaryColor}`, color: secondaryColor }} 
                  className="px-4 py-2 rounded-md text-sm font-medium bg-transparent"
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
