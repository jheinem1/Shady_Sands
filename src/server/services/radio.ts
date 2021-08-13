import { OnStart, Service } from "@flamework/core";
import { Events } from "server/events";
import { createStation, getSongsFromId, RadioStation } from "shared/modules/radio/station_data_structures";
import radioStations from "shared/modules/radio/stations";

@Service()
export class RadioService implements OnStart {
    stations = new Map<string, RadioStation>();
    running = true;
    onStart() {
        const connection = Events.connect("areStationsLoaded", (player) => Events.stationsLoaded.fire(player, false));
        // load stations
        const promises = new Array<Promise<void>>();
        for (const station of radioStations) {
            const songsPromise = getSongsFromId(station.songs);
            const stationObjPromise = songsPromise.then((songs) => {
                return createStation(station.name, songs);
            });
            promises.push(
                stationObjPromise.then((stationObj) => {
                    this.stations.set(station.name, stationObj);
                    stationObj.startedCurrentSong = os.time();
                    const nextSong = () => {
                        if (++stationObj.currentSongIndex >= stationObj.songs.size()) stationObj.currentSongIndex = 0;
                        stationObj.startedCurrentSong = os.time();
                        task.delay(stationObj.songs[stationObj.currentSongIndex].length, nextSong);
                    };
                    task.delay(stationObj.songs[stationObj.currentSongIndex].length, nextSong);
                }),
            );
        }
        // connect to events
        Events.connect("requestStation", (player: Player, stationName: string) => {
            const station = this.stations.get(stationName);
            if (station)
                station.currentSongTime =
                    station.startedCurrentSong !== undefined ? os.time() - station.startedCurrentSong : 0;
            Events.recieveStation(player, stationName, station);
        });
        // fire loaded event when done
        Promise.allSettled(promises).then(() => {
            Events.stationsLoaded.broadcast(true);
            connection.Disconnect();
            Events.connect("areStationsLoaded", (player) => Events.stationsLoaded.fire(player, true));
        });
    }
}
