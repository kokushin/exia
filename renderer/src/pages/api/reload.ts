import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "This endpoint is deprecated. Reload is handled automatically on save." });
}
