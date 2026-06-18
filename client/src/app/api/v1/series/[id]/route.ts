import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/lib/mongodb/connectToDb";
import { ObjectId } from "mongodb";
import { SERIES } from "@/lib/mongodb/collectionNames";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDb();
    const series = await db.collection(SERIES).findOne({ _id: new ObjectId(id) });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
