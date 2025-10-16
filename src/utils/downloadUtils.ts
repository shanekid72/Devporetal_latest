// Download utility functions for Agent Toolkit templates
import JSZip from 'jszip';

export const downloadFile = (content: string, filename: string, contentType: string = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadJSON = (data: any, filename: string) => {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, filename, 'application/json');
};

export const downloadZip = async (files: { name: string; content: string }[], zipName: string) => {
  try {
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // Add each file to the zip
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    
    // Generate the zip file as a blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Download the zip file
    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating zip file:', error);
    // Fallback to individual file downloads
    files.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file.content, file.name);
      }, index * 100);
    });
  }
};
