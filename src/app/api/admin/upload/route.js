import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import Booking from "@/lib/db/models/booking";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bookingId = formData.get("bookingId");
    const folder = formData.get("folder") || (bookingId ? "bookings" : "misc");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${folder}/${bookingId || "general"}/${Date.now()}_${file.name}`;
    const bucketName = process.env.AWS_BUCKET_NAME || "milkywayy-bookings";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

    if (bookingId) {
      await Booking.update({ filesUrl: fileUrl }, { where: { id: bookingId } });
    }

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
