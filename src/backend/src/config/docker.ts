import Docker from "dockerode";
import { DEMO_MODE } from "./env";
import { mockDocker } from "../demo/mockDocker";

const socketPath = process.env.DOCKER_SOCKET || "/var/run/docker.sock";

// Demo mode swaps in a simulated Docker so no containers are created on the host.
export const docker: Docker = DEMO_MODE ? (mockDocker as unknown as Docker) : new Docker({ socketPath });
