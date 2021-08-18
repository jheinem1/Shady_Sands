import { Controller, OnStart } from "@flamework/core";
import Roact from "@rbxts/roact";
import { ContentProvider, Players, Workspace } from "@rbxts/services";
import ButtonComponent from "client/modules/button_component";
import { RadioStation } from "shared/modules/radio/station_data_structures";
import Remotes from "shared/modules/remotes";

@Controller()
export class TempRadioController implements OnStart {
    nextSong(sound: Sound, station: RadioStation) {
        sound.Stop();
        station.currentSongIndex = ++station.currentSongIndex >= station.songs.size() ? 0 : station.currentSongIndex;
        const currentSong = station.songs[station.currentSongIndex];
        sound.SoundId = `rbxassetid://${currentSong.id}`;
        const timeAtStartLoad = os.clock();
        if (!sound.IsLoaded) sound.Loaded.Wait();
        const timePosition = os.clock() - timeAtStartLoad;
        sound.TimePosition = timePosition;
        sound.Play();
        task.delay(currentSong.length - timePosition > 0 ? currentSong.length - timePosition : 0, () =>
            this.nextSong(sound, station),
        );
    }
    onStart() {
        // get station
        const stationPromise = Remotes.Client.WaitFor("GetStation").then((remote) => remote.CallServerAsync("Default"));
        // create/manage sound
        const sound = new Instance("Sound");
        sound.Name = "[DEFAULT RADIO STATION]";
        sound.Parent = Workspace;
        stationPromise.then((station) => {
            if (station) {
                const currentSong = station.songs[station.currentSongIndex];
                sound.SoundId = `rbxassetid://${currentSong.id}`;
                const timeAtStartLoad = os.clock();
                if (!sound.IsLoaded) sound.Loaded.Wait();
                const timePosition =
                    os.clock() -
                    timeAtStartLoad +
                    (station.startedCurrentSong !== undefined ? os.clock() - station.startedCurrentSong : 0);
                sound.Play();
                sound.TimePosition = timePosition;
                task.delay(currentSong.length - timePosition > 0 ? currentSong.length - timePosition : 0, () =>
                    this.nextSong(sound, station),
                );
            } else warn("Unable to fetch radio station data");
        });
        // mount button component
        Roact.mount(
            Roact.createElement(ButtonComponent, { sound: sound }),
            Players.LocalPlayer.WaitForChild("PlayerGui", 5),
        );
    }
}
