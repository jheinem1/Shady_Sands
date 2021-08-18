import { OnStart, Service } from "@flamework/core";
import { createStation, getSongsFromId, RadioStation } from "shared/modules/radio/station_data_structures";
import radioStations from "shared/modules/radio/stations";
import Remotes from "shared/modules/remotes";

@Service()
export class RadioService implements OnStart {
    stations = new Map<string, RadioStation>();
    running = true;
    getStationRemote = Remotes.Server.Create("GetStation");
    onStart() {
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
                    stationObj.startedCurrentSong = os.clock();
                    const nextSong = () => {
                        if (++stationObj.currentSongIndex >= stationObj.songs.size()) stationObj.currentSongIndex = 0;
                        stationObj.startedCurrentSong = os.clock();
                        task.delay(stationObj.songs[stationObj.currentSongIndex].length, nextSong);
                    };
                    task.delay(stationObj.songs[stationObj.currentSongIndex].length, nextSong);
                }),
            );
        }
        // connect to events
        this.getStationRemote.SetCallback(
            (_player, stationName) =>
                new Promise((resolve: (station: RadioStation | false) => void) =>
                    Promise.allSettled(promises).then(() => resolve(this.stations.get(stationName) ?? false)),
                ),
        );
    }
}
