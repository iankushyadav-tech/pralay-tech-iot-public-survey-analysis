/**
 * PRALAY TECH - PDF and CSV Export Utility
 * Uses jsPDF and jspdf-autotable to produce college-defense-grade reports.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SurveyResponse, SensorReading } from '../types';

export interface ReportDataPayload {
  responses: SurveyResponse[];
  currentSensor: SensorReading;
  publicSatisfactionRate: number;
  totalResponsesCount: number;
  sentimentCounts: { positive: number; neutral: number; negative: number };
  viewMode: 'all' | 'real_only' | 'demo_only';
}

/**
 * Generates and downloads a branded PDF document.
 */
export function generatePDFReport(data: ReportDataPayload) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const realCount = data.responses.filter(r => !r.isDemo).length;
  const demoCount = data.responses.filter(r => r.isDemo).length;

  // Header Background Accent Bar
  doc.setFillColor(220, 38, 38); // Tailwind red-600
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Title Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('PRALAY TECH', 40, 45);

  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38);
  doc.text('TEAM 02  |  COLLEGE PROJECT EVALUATION (SLOT: 6:50 PM – 7:10 PM)', 190, 45);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('"Innovating Beyond Limits."', 40, 62);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('IoT-Based Public Survey Response Analysis Report', 40, 88);

  // Meta info bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Generated: ${dateStr}  |  Filter Scope: ${data.viewMode.toUpperCase()}`, 40, 104);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(40, 115, pageWidth - 40, 115);

  // Academic Simulation Notice Callout Box
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.roundedRect(40, 125, pageWidth - 80, 42, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('ACADEMIC COMPLIANCE & ZERO-HARDWARE SIMULATION DISCLOSURE:', 50, 140);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  const disclaimerText = 'This project incorporates zero physical IoT microcontrollers. All ambient environmental readings (AQI, Temp, Humidity, CO2, Noise) are algorithmically simulated in-browser for educational evaluation.';
  doc.text(doc.splitTextToSize(disclaimerText, pageWidth - 100), 50, 153);

  // 1. Executive Summary Table
  const summaryBody = [
    ['Total Survey Responses Analyzed', `${data.responses.length} Submissions`],
    ['Real Citizen Submissions', `${realCount} Verified User Responses`],
    ['Pre-seeded Academic Demo Records', `${demoCount} Demo Records (Clearly Segregated)`],
    ['Overall Public Satisfaction Rate', `${data.publicSatisfactionRate}% (${(data.responses.reduce((s, r) => s + r.overallSatisfaction, 0) / (data.responses.length || 1)).toFixed(1)} / 5.0 Stars)`],
    ['Positive Public Sentiment (4-5★)', `${data.sentimentCounts.positive} citizens (${Math.round((data.sentimentCounts.positive / (data.responses.length || 1)) * 100)}%)`],
    ['Neutral Public Sentiment (3★)', `${data.sentimentCounts.neutral} citizens (${Math.round((data.sentimentCounts.neutral / (data.responses.length || 1)) * 100)}%)`],
    ['Critical / Grievance Sentiment (1-2★)', `${data.sentimentCounts.negative} citizens (${Math.round((data.sentimentCounts.negative / (data.responses.length || 1)) * 100)}%)`],
    ['Simulated IoT Sensor Hub Telemetry', `${data.currentSensor.sensorNodeId} -> Temp: ${data.currentSensor.temperature}°C, Hum: ${data.currentSensor.humidity}%, AQI: ${data.currentSensor.airQualityIndex} (${data.currentSensor.status})`]
  ];

  autoTable(doc, {
    startY: 180,
    margin: { left: 40, right: 40 },
    head: [['Key Analytical Metric', 'Observed Value / Statistical Result']],
    body: summaryBody,
    theme: 'grid',
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // 2. Topic Ratings Breakdown Table
  const lastY = (doc as any).lastAutoTable.finalY + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Domain-Wise Civic Satisfaction Index', 40, lastY);

  const avgTopic = (key: keyof SurveyResponse) => {
    const valid = data.responses;
    if (valid.length === 0) return '0.00';
    const sum = valid.reduce((s, r) => s + (Number(r[key]) || 0), 0);
    return (sum / valid.length).toFixed(2);
  };

  const topicTableBody = [
    ['Environmental Awareness', `${avgTopic('environmentalAwareness')} / 5.0`, 'Citizen understanding of recycling, emissions & sustainability'],
    ['Public Transport Satisfaction', `${avgTopic('publicTransportSatisfaction')} / 5.0`, 'Accessibility, punctuality & safety of transit lines'],
    ['Civic Cleanliness & Waste', `${avgTopic('cleanlinessSatisfaction')} / 5.0`, 'Garbage bin clearance, street sweeping, cleanliness'],
    ['Perceived Air Quality', `${avgTopic('airQualitySatisfaction')} / 5.0`, 'Outdoor air clarity, absence of vehicle exhaust smells'],
    ['Overall Urban Living Quality', `${avgTopic('overallSatisfaction')} / 5.0`, 'Holistic civic well-being index across community']
  ];

  autoTable(doc, {
    startY: lastY + 8,
    margin: { left: 40, right: 40 },
    head: [['Civic Domain Area', 'Average Rating', 'Evaluation Focus']],
    body: topicTableBody,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 8,
      cellPadding: 4.5
    }
  });

  // 3. Survey Submissions Sample Table
  const tableY2 = (doc as any).lastAutoTable.finalY + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Survey Submissions Log (Recent Records)', 40, tableY2);

  const sampleResponses = data.responses.slice(0, 15);
  const responsesBody = sampleResponses.map(r => [
    r.id,
    r.isDemo ? 'DEMO DATA' : 'REAL USER',
    r.ageGroup,
    r.location || 'Anonymous',
    `${r.overallSatisfaction} ★`,
    r.primaryConcern,
    r.suggestions.slice(0, 50) + (r.suggestions.length > 50 ? '...' : '')
  ]);

  autoTable(doc, {
    startY: tableY2 + 8,
    margin: { left: 40, right: 40 },
    head: [['ID', 'Data Type', 'Age', 'Location', 'Rating', 'Concern', 'Suggestions']],
    body: responsesBody,
    theme: 'grid',
    headStyles: {
      fillColor: [239, 68, 68],
      textColor: [255, 255, 255],
      fontSize: 8
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 60, fontStyle: 'bold' },
      2: { cellWidth: 45 },
      3: { cellWidth: 70 },
      4: { cellWidth: 40 },
      5: { cellWidth: 80 },
      6: { cellWidth: 'auto' }
    }
  });

  // Footer with Page Numbers
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `PRALAY TECH (Team 02) | College Project Defense (6:50 PM – 7:10 PM) | Page ${i} of ${totalPages}`,
      40,
      doc.internal.pageSize.getHeight() - 15
    );
  }

  // Trigger download
  doc.save(`PRALAY_TECH_Survey_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Downloads survey records as a formatted CSV file.
 */
export function generateCSVReport(responses: SurveyResponse[], fileNamePrefix = 'PRALAY_TECH_Survey_Data') {
  if (responses.length === 0) return;

  const headers = [
    'Response ID',
    'Timestamp (ISO)',
    'Data Category',
    'Age Group',
    'Gender',
    'Location',
    'Environmental Awareness (1-5)',
    'Public Transport Satisfaction (1-5)',
    'Cleanliness Satisfaction (1-5)',
    'Air Quality Satisfaction (1-5)',
    'Overall Satisfaction (1-5)',
    'Primary Concern',
    'Citizen Feedback Quote',
    'Storage Source'
  ];

  const rows = responses.map(r => [
    `"${r.id}"`,
    `"${r.timestamp}"`,
    r.isDemo ? '"DEMO SEED DATA"' : '"REAL USER SUBMISSION"',
    `"${r.ageGroup}"`,
    `"${r.gender || 'Anonymous'}"`,
    `"${(r.location || 'Anonymous Area').replace(/"/g, '""')}"`,
    r.environmentalAwareness,
    r.publicTransportSatisfaction,
    r.cleanlinessSatisfaction,
    r.airQualitySatisfaction,
    r.overallSatisfaction,
    `"${r.primaryConcern}"`,
    `"${(r.suggestions || '').replace(/"/g, '""')}"`,
    `"${r.source || (r.isDemo ? 'demo_seed' : 'firestore')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${fileNamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
