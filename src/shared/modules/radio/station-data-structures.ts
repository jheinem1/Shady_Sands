import { MarketplaceService } from "@rbxts/services";

export interface Song {
    name: string;
    id: number;
    length: number;
}

export interface RadioStation {
    name: string;
    songs: Song[];
    currentSongIndex: number;
    currentSongTime: number;
    startedCurrentSong?: number;
}

export function createStation(name: string, songs: Song[]): RadioStation {
    return {
        name,
        songs,
        currentSongIndex: 0,
        currentSongTime: 0,
    };
}

async function getSongLength(id: number) {
    const song = new Instance("Sound");
    song.SoundId = `rbxassetid://${id}`;
    song.Loaded.Wait();
    return song.TimeLength;
}

export function getSongsFromId(songIds: number[]): Promise<Song>[] {
    return songIds.mapFiltered(async (id) => {
        const info = MarketplaceService.GetProductInfo(id, Enum.InfoType.Asset);
        return {
            name: info.Name,
            id: id,
            length: await getSongLength(id),
        };
    });
}
