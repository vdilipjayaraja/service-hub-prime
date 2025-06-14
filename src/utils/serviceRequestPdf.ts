
import { ServiceRequest } from "../types";
import jsPDF from "jspdf";

export function generateServiceRequestPdf(request: ServiceRequest) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Service Request Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Ticket ID: ${request.ticketId}`, 14, 35);
  doc.text(`Title: ${request.title}`, 14, 42);
  doc.text(`Description: ${request.description}`, 14, 49);
  doc.text(`Client: ${request.clientName || ""}`, 14, 56);
  doc.text(`Technician: ${request.technicianName || "Unassigned"}`, 14, 63);
  doc.text(`Priority: ${request.priority}`, 14, 70);
  doc.text(`Status: ${request.status}`, 14, 77);
  doc.text(`Created At: ${new Date(request.createdAt).toLocaleString()}`, 14, 84);
  doc.text(`Assigned At: ${request.assignedAt ? new Date(request.assignedAt).toLocaleString() : "Not Assigned"}`, 14, 91);
  doc.text(`Resolved At: ${request.updatedAt ? new Date(request.updatedAt).toLocaleString() : "N/A"}`, 14, 98);

  if (request.resolutionNotes) {
    doc.setFontSize(14);
    doc.text("Resolution Notes:", 14, 110);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(request.resolutionNotes, 180), 14, 117);
  }

  doc.save(`ServiceRequest-${request.ticketId}.pdf`);
}
