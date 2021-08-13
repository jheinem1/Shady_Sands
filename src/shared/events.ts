import { Networking } from "@flamework/networking";
import { RadioStation } from "./modules/radio/station-data-structures";

interface ServerEvents {
    getStation(station: string): RadioStation | undefined;
}

interface ClientEvents {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
