import { Debris, MarketplaceService, ServerStorage } from "@rbxts/services";

export interface Song {
    name: string;
    id: number;
    length: number;
    volume?: number;
    pitch?: number;
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
    song.Parent = ServerStorage;
    if (!song.IsLoaded) song.Loaded.Wait();
    Debris.AddItem(song, 1);
    return song.TimeLength;
}

export async function getSongsFromId(songIds: number[]): Promise<Song[]> {
    const songs = new Array<Song>();
    for (const id of songIds) {
        const info = MarketplaceService.GetProductInfo(id, Enum.InfoType.Asset);
        if (info.AssetTypeId === 3)
            songs.push({
                name: info.Name,
                id: id,
                length: await getSongLength(id),
            });
    }
    return songs;
}
