import { NextRequest, NextResponse } from "next/server";
import { ipAddress, geolocation } from "@vercel/functions";

export async function middleware(request: NextRequest) {
  // Ambil IP dan geolokasi untuk semua request
  const ip = ipAddress(request);
  const geo = geolocation(request);

  // Buat header baru berdasarkan request yang masuk
  const headers = new Headers(request.headers);

  // Set header kustom untuk IP dan negara
  // Gunakan "127.0.0.1" dan "US" sebagai fallback jika tidak terdeteksi
  headers.set("x-client-ip", ip ?? "127.0.0.1");
  headers.set("x-client-geo-country", geo?.country ?? "US");

  // Lanjutkan request dengan header yang sudah dimodifikasi
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Jalankan middleware ini untuk semua rute
  matcher: "/((?!_next/static|favicon.ico).+)",
};
