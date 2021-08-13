import { Networking } from "@flamework/networking";
import { RadioStation } from "./modules/radio/station-data-structures";

interface ServerEvents {
    requestStation(stationName: string): void;
}

interface ClientEvents {
    recieveStation(stationName: string, station: RadioStation | undefined): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
