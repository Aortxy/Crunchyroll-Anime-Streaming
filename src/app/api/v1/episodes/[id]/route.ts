import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/lib/mongodb/connectToDb";
import { ObjectId } from "mongodb";
import { EPISODES } from "@/lib/mongodb/collectionNames";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDb();
    const episode = await db.collection(EPISODES).findOne({ _id: new ObjectId(id) });

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
