import React, { useState } from 'react';
import { Plus, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function DomainManager() {
  const [domain, setDomain] = useState('');
  
  // Mock data
  const domains = [
    { id: 1, name: 'crm.acmerealestate.com', status: 'VERIFIED', ssl: 'ACTIVE' },
    { id: 2, name: 'app.acmerealestate.com', status: 'PENDING', ssl: 'PROVISIONING' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-xl border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Custom Domains</h3>
            <p className="text-muted-foreground">Manage the domains where your white-label application is hosted.</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </button>
        </div>

        {/* Add Domain Form (mock) */}
        <div className="bg-muted/50 p-4 rounded-lg mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Enter your custom domain</label>
            <input 
              type="text" 
              placeholder="e.g. crm.yourcompany.com" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium h-[42px]">
            Verify
          </button>
        </div>

        {/* Domain List */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Domain</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">SSL</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3">
                    {d.status === 'VERIFIED' ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-600">
                        <Clock className="w-4 h-4 mr-1" /> Pending DNS
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {d.ssl === 'ACTIVE' ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-amber-600">Provisioning</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-primary hover:underline text-xs mr-3">DNS Instructions</button>
                    <button className="text-destructive hover:underline text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* DNS Instructions Mock */}
      <div className="p-6 bg-card rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">DNS Configuration Required</h4>
            <p className="text-sm text-amber-700 dark:text-amber-500 mb-4">To verify app.acmerealestate.com, please add the following CNAME record to your DNS provider.</p>
            <div className="bg-background border rounded p-3 font-mono text-xs overflow-x-auto">
              <div>Type: CNAME</div>
              <div>Name: app</div>
              <div>Value: proxy.platform.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
