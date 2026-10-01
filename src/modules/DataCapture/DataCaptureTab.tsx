import React, { useState } from 'react';

export default function DataCaptureTab({ schemas }) {
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving to G: Drive and SQL Database...');
    try {
      const response = await fetch('http://localhost:8080/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formTitle: selectedSchema.title,
          payload: formData
        })
      });
      if (response.ok) {
        setStatus('? Successfully saved and validated in the Network Database!');
        setFormData({});
      } else {
        setStatus('? Failed to save data. Ensure backend service is running.');
      }
    } catch (error) {
      setStatus('? Network Error: Could not connect to Data Capture Backend.');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-xl rounded-xl mt-8 border border-slate-200 font-sans">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Field Data Capture</h2>
        <p className="text-slate-500 mt-1">Select a digitized form to securely log telemetry to the Master Database.</p>
      </div>

      <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Digitized Form Schema:</label>
        <select 
          className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium"
          onChange={(e) => {
            const schema = schemas.find(s => s.title === e.target.value);
            setSelectedSchema(schema);
            setFormData({});
            setStatus('');
          }}
        >
          <option value="">-- Choose an Engineering Form --</option>
          {schemas.map(s => (
            <option key={s.title} value={s.title}>{s.title}</option>
          ))}
        </select>
      </div>

      {selectedSchema && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(selectedSchema.properties).map(([key, field]) => (
              <div key={key} className="bg-white p-3 rounded-md border border-slate-100 shadow-sm hover:border-blue-300 transition-colors">
                <label className="block text-sm font-bold text-slate-800 mb-1">{field.title}</label>
                
                {field.enum ? (
                  <select 
                    required
                    value={formData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50"
                  >
                    <option value="">-- Select Option --</option>
                    {field.enum.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input 
                    type={field.type === 'number' ? 'number' : 'text'} 
                    required
                    step={field.type === 'number' ? 'any' : undefined}
                    value={formData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50"
                    placeholder={Enter ...}
                  />
                )}
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{field.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 mt-8">
            <button type="submit" className="w-full md:w-auto bg-blue-700 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-800 shadow-lg transition-transform active:scale-95">
              Submit & Sync Data to G: Drive
            </button>
            {status && <p className="mt-4 text-sm font-bold text-slate-800 bg-slate-100 p-3 rounded-md">{status}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
