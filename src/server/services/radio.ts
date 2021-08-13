import { OnStart, Service } from "@flamework/core";
import { Events } from "server/events";
import { createStation, getSongsFromId, RadioStation, Song } from "shared/modules/radio/station-data-structures";
import radioStations from "shared/modules/radio/stations";

@Service()
export class RadioService implements OnStart {
    stations = new Map<string, RadioStation>();
    running = true;
    onStart() {
        // load stations
        for (const station of radioStations) {
            const songs = new Array<Song>();
            getSongsFromId(station.songs).forEach((songPromise) => songPromise.then((song) => songs.push(song)));
            const stationObj = createStation(station.name, songs);
            this.stations.set(station.name, stationObj);
            stationObj.startedCurrentSong = os.time();
            while (this.running) {
                const currentSong = stationObj.songs[stationObj.currentSongIndex];
                task.delay(currentSong.length, () => {
                    if (++stationObj.currentSongIndex > stationObj.songs.size()) stationObj.currentSongIndex = 0;
                    stationObj.startedCurrentSong = os.time();
                });
            }
        }
        // connect to events
        Events.connect("getStation", (_player: Player, stationName: string) => {
            const station = this.stations.get(stationName);
            if (station)
                station.currentSongTime =
                    station.startedCurrentSong !== undefined ? os.time() - station.startedCurrentSong : 0;
            return station;
        });
    }
}
