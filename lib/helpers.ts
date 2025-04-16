import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export const generatePDF = async (elementToPrintId: string) => {
  const element = document.getElementById(elementToPrintId);
  if (!element) {
    throw new Error(`Element with id ${elementToPrintId} not found`);
  }
  const canvas = await html2canvas(element, {
    scale: 3, // Increase scale for better resolution
    useCORS: true, // Ensures external assets (fonts, images) load correctly
    logging: false, // Reduces console noise
  });

  const data = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait", // Use "portrait" instead of "landscape" if needed
    unit: "mm",
    format: "a4", // Standard A4 size
  });

  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("print.pdf");
};

export function generateRandomColorClasses() {
  const colors = {
    red: "bg-red-50 text-red-800",
    pink: "bg-pink-50 text-pink-800",
    purple: "bg-purple-50 text-purple-800",
    indigo: "bg-indigo-50 text-indigo-800",
    blue: "bg-blue-50 text-blue-800",
    cyan: "bg-cyan-50 text-cyan-800",
    teal: "bg-teal-50 text-teal-800",
    green: "bg-green-50 text-green-800",
    lime: "bg-lime-50 text-lime-800",
    yellow: "bg-yellow-50 text-yellow-800",
    amber: "bg-amber-50 text-amber-800",
    orange: "bg-orange-50 text-orange-800",
    brown: "bg-orange-50 text-orange-800",
    gray: "bg-gray-50 text-gray-800",
    slate: "bg-slate-50 text-slate-800",
  };

  type ColorKey = keyof typeof colors;

  const colorKeys = Object.keys(colors) as ColorKey[];
  const randomColor: ColorKey =
    colorKeys[Math.floor(Math.random() * colorKeys.length)];

  return colors[randomColor];
}
