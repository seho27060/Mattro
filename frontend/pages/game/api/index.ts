import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../constants/game";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    const message = req.body;
    res.socket.server.io.emit("message", message);

    res.status(201).json(message);
  }
};
