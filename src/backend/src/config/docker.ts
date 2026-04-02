import Docker from "dockerode";
import dotenv from "dotenv";

dotenv.config();

const socketPath = process.env.DOCKER_SOCKET || "/var/run/docker.sock";

export const docker = new Docker({ socketPath });
