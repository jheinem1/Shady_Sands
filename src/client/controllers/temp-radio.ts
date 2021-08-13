import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/events";
import { RadioStation } from "shared/modules/radio/station-data-structures";

@Controller()
export class TempRadioController implements OnStart {
    onStart() {
        const stationPromise = new Promise((resolve: (station: RadioStation | undefined) => void) => {
            const connection = Events.connect("recieveStation", (stationName, station) => {
                if (stationName === "Default") {
                    connection.Disconnect();
                    resolve(station);
                }
            });
            Events.requestStation("Default");
        });
        stationPromise.then((station) => {
            if (station) {
                const sound = new Instance("Sound");
                let currentSong = station.songs[station.currentSongIndex];
                sound.SoundId = `rbxassetid://${currentSong.id}`;
                const timeAtStartLoad = os.time();
                if (!sound.IsLoaded) sound.Loaded.Wait();
                const timePosition =
                    os.time() -
                    timeAtStartLoad +
                    (station.startedCurrentSong !== undefined ? station.startedCurrentSong - os.time() : 0);
                sound.Play();
                task.delay(currentSong.length - timePosition > 0 ? currentSong.length - timePosition : 0, () => {
                    station.currentSongIndex =
                        ++station.currentSongIndex > station.songs.size() ? 0 : station.currentSongIndex;
                    currentSong = station.songs[station.currentSongIndex];
                    sound.SoundId = `rbxassetid://${currentSong.id}`;
                    sound.Play();
                });
            } else warn("Unable to fetch radio station data");
        });
    }
}
