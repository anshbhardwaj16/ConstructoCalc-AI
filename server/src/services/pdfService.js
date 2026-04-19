import PDFDocument from "pdfkit";

export const generateProjectPdf = (project) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ margin: 40 });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("ConstructoCalc AI Report");
    doc.moveDown();

    doc.fontSize(12).text(`Project: ${project.name}`);
    doc.text(`City: ${project.input.city}`);
    doc.text(`Plot Size: ${project.input.plotSize} sq ft`);
    doc.text(`Floors: ${project.input.floors}`);
    doc.text(`Quality: ${project.input.quality}`);
    doc.moveDown();

    doc.fontSize(14).text("Cost Summary");
    doc.fontSize(12).text(`Built-up Area: ${project.result.builtUpArea.toFixed(2)} sq ft`);
    doc.text(`Material Cost: INR ${project.result.materialCost.toFixed(2)}`);
    doc.text(`Labor Cost: INR ${project.result.laborCost.toFixed(2)}`);
    doc.text(`Total Cost: INR ${project.result.totalCost.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).text("AI Explanation");
    doc.fontSize(11).text(project.aiInsights?.explanation || "Not available");
    doc.moveDown();

    doc.fontSize(14).text("Optimization Suggestions");
    (project.aiInsights?.optimization || []).forEach((item) => doc.text(`- ${item}`));
    doc.moveDown();

    doc.fontSize(14).text("Risk Analysis");
    (project.aiInsights?.risks || []).forEach((item) => doc.text(`- ${item}`));

    doc.end();
  });
