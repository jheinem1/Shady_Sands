import { Controller, OnStart } from "@flamework/core";
import { ContentProvider, Workspace } from "@rbxts/services";
import { Events } from "client/events";
import { RadioStation } from "shared/modules/radio/station-data-structures";

@Controller()
export class TempRadioController implements OnStart {
    onStart() {
        const stationPromise = new Promise((resolve: (station: RadioStation | undefined) => void) => {
            const onLoaded = () => {
                const recieveStationConnection = Events.connect("recieveStation", (stationName, station) => {
                    if (stationName === "Default") {
                        recieveStationConnection.Disconnect();
                        resolve(station);
                    }
                });
                Events.requestStation("Default");
            };
            const stationLoadedConnection = Events.connect("stationsLoaded", (loaded) => {
                if (loaded) {
                    onLoaded();
                    stationLoadedConnection.Disconnect();
                }
            });
            Events.areStationsLoaded();
        });
        const sound = new Instance("Sound");
        sound.Name = "[DEFAULT RADIO STATION]";
        sound.Parent = Workspace;
        stationPromise.then((station) => {
            if (station) {
                let currentSong = station.songs[station.currentSongIndex];
                sound.SoundId = `rbxassetid://${currentSong.id}`;
                const timeAtStartLoad = os.time();
                ContentProvider.PreloadAsync([sound]);
                const timePosition =
                    os.time() -
                    timeAtStartLoad +
                    (station.startedCurrentSong !== undefined ? station.startedCurrentSong - os.time() : 0);
                sound.Play();
                task.delay(currentSong.length - timePosition > 0 ? currentSong.length - timePosition : 0, () => {
                    station.currentSongIndex =
                        ++station.currentSongIndex >= station.songs.size() ? 0 : station.currentSongIndex;
                    currentSong = station.songs[station.currentSongIndex];
                    sound.SoundId = `rbxassetid://${currentSong.id}`;
                    sound.Play();
                });
            } else warn("Unable to fetch radio station data");
        });
    }
}
