// src/utils/reportGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePropertyReport = (property, riskData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(34, 197, 94); // Green
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('ClimaScan', 15, 20);
  doc.setFontSize(14);
  doc.text('Climate Risk Assessment Report', 15, 30);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Property Details Section
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Property Information', 15, 55);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Property Name: ${property.name}`, 15, 65);
  doc.text(`Location: ${property.address}`, 15, 72);
  doc.text(`Coordinates: ${property.latitude}, ${property.longitude}`, 15, 79);
  doc.text(`Property Type: ${property.property_type || 'N/A'}`, 15, 86);
  doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 15, 93);
  
  // Risk Assessment Section
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Climate Risk Assessment', 15, 110);
  
  // Risk Scores Table
  const riskTableData = [
    ['Risk Factor', 'Score', 'Level', 'Description'],
    ['Flood Risk', riskData?.flood_score || 'N/A', getRiskLevel(riskData?.flood_score), 'Assessment of flooding potential'],
    ['Heat Stress', riskData?.heat_score || 'N/A', getRiskLevel(riskData?.heat_score), 'Urban heat island impact'],
    ['Coastal Erosion', riskData?.erosion_score || 'N/A', getRiskLevel(riskData?.erosion_score), 'Coastal degradation risk'],
    ['Drainage Issues', riskData?.drainage_score || 'N/A', getRiskLevel(riskData?.drainage_score), 'Water accumulation risk'],
  ];
  
  doc.autoTable({
    startY: 120,
    head: [riskTableData[0]],
    body: riskTableData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
    styles: { fontSize: 10 },
  });
  
  // Overall Risk Score
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Overall Risk Score: ${riskData?.overall_score || 'N/A'}%`, 15, finalY);
  
  // AI Recommendations Section
  if (riskData?.ai_summary) {
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('AI Risk Analysis', 15, finalY + 15);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const splitText = doc.splitTextToSize(riskData.ai_summary, 180);
    doc.text(splitText, 15, finalY + 25);
  }
  
  // Mitigation Actions
  if (riskData?.actions && riskData.actions.length > 0) {
    const actionsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 60 : finalY + 60;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Recommended Actions', 15, actionsY);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    riskData.actions.forEach((action, index) => {
      doc.text(`${index + 1}. ${action}`, 15, actionsY + 10 + (index * 7));
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('© 2025 ClimaScan - Climate Risk Intelligence', 15, 285);
  doc.text('This report is for informational purposes only. Consult professionals for critical decisions.', 15, 290);
  
  // Generate filename and download
  const filename = `ClimaScan_Report_${property.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

// Helper function to determine risk level
const getRiskLevel = (score) => {
  if (!score) return 'N/A';
  const numScore = parseFloat(score);
  if (numScore < 30) return 'Low';
  if (numScore < 60) return 'Medium';
  return 'High';
};

// Function to generate a simple chat transcript report
export const generateChatReport = (messages) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('ClimaScan AI Chat', 15, 20);
  doc.setFontSize(14);
  doc.text('Conversation Transcript', 15, 30);
  
  doc.setTextColor(0, 0, 0);
  
  // Chat content
  let yPosition = 55;
  doc.setFontSize(11);
  
  messages.forEach((msg, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text(`${msg.isUser ? 'You' : 'ClimaScan AI'}:`, 15, yPosition);
    
    doc.setFont(undefined, 'normal');
    const splitText = doc.splitTextToSize(msg.text, 180);
    doc.text(splitText, 15, yPosition + 7);
    
    yPosition += splitText.length * 7 + 10;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('© 2025 ClimaScan - Climate Risk Intelligence', 15, 285);
  
  const filename = `ClimaScan_Chat_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};