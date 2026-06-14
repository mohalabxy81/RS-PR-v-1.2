'use client';

import React, { useState } from 'react';
import { ThemeBuilder } from '@/components/branding/ThemeBuilder';
import { DomainManager } from '@/components/branding/DomainManager';
import { AssetManager } from '@/components/branding/AssetManager';
import { Settings, Palette, Globe, Image as ImageIcon } from 'lucide-react';

export default function BrandingSettingsPage() {
  const [activeTab, setActiveTab] = useState('theme');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Brand Management Center</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 flex flex-col space-y-1">
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'theme' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('theme')}
          >
            <Palette className="h-4 w-4" />
            <span>Theme Builder</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'domain' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('domain')}
          >
            <Globe className="h-4 w-4" />
            <span>Custom Domains</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'assets' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('assets')}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Asset Manager</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'general' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('general')}
          >
            <Settings className="h-4 w-4" />
            <span>General Settings</span>
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'theme' && <ThemeBuilder />}
          {activeTab === 'domain' && <DomainManager />}
          {activeTab === 'assets' && <AssetManager />}
          {activeTab === 'general' && (
            <div className="p-6 bg-card rounded-xl border">
              <h3 className="text-xl font-bold mb-4">General Brand Settings</h3>
              <p className="text-muted-foreground mb-4">Configure your brand name, tagline, and basic details here.</p>
              {/* Form mock */}
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input type="text" className="w-full p-2 rounded-md border bg-background" defaultValue="Acme Real Estate" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline</label>
                  <input type="text" className="w-full p-2 rounded-md border bg-background" defaultValue="Find your dream home" />
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
