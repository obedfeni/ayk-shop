import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

let cachedDoc: GoogleSpreadsheet | null = null;

export async function getSpreadsheet(): Promise<GoogleSpreadsheet> {
  if (cachedDoc) return cachedDoc;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID!;

  if (!email || !key || !sheetId) {
    throw new Error('Missing Google Sheets environment variables');
  }

  const auth = new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();
  cachedDoc = doc;
  return doc;
}

export function parseVariants(raw: string) {
  if (!raw) return [];
  return raw.split(',').map((p) => {
    const [name, price] = p.split(':');
    return { name: name?.trim(), price: Number(price) };
  }).filter((v) => v.name && !isNaN(v.price));
}

export function serializeVariants(variants: Array<{ name: string; price: number }>) {
  return variants.map((v) => `${v.name}:${v.price}`).join(', ');
}

// Ensure sheets exist with correct headers
export async function ensureSheets(doc: GoogleSpreadsheet) {
  const productHeaders = ['id', 'name', 'price', 'stock', 'image1', 'image2', 'image3', 'description', 'category', 'status', 'variants'];
  const orderHeaders = ['id', 'reference', 'name', 'phone', 'location', 'product_name', 'product_id', 'variant', 'quantity', 'amount', 'status', 'timestamp'];

  if (!doc.sheetsByTitle['products']) {
    await doc.addSheet({ title: 'products', headerValues: productHeaders });
  }
  if (!doc.sheetsByTitle['orders']) {
    await doc.addSheet({ title: 'orders', headerValues: orderHeaders });
  }
}
