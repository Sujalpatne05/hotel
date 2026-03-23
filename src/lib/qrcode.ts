// Simple QR Code generator using QR Server API
export const generateQRCode = (text: string, size: number = 200): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
};

// Generate QR code for table ordering
export const generateTableQRCode = (tableId: number, baseUrl: string = window.location.origin): string => {
  const orderingUrl = `${baseUrl}/table-qr/${tableId}`;
  return generateQRCode(orderingUrl);
};
