import { Networking } from "@flamework/networking";
import { RadioStation } from "./modules/radio/station_data_structures";

interface ServerEvents {
    areStationsLoaded(): void;
    requestStation(stationName: string): void;
}

interface ClientEvents {
    stationsLoaded(loaded: boolean): void;
    recieveStation(stationName: string, station: RadioStation | undefined): void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
