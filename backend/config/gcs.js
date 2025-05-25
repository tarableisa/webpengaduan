// backend/config/gcs.js
import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage({
  keyFilename: path.join(process.cwd(), "config", "gcs-key.json"), // ganti sesuai lokasi file key kamu
  projectId: "if-b-08", // sesuaikan dengan ID project
});

const bucketName = "bukti-upload"; // sesuaikan dengan nama bucket kamu
const bucket = storage.bucket(bucketName);

export default bucket;
