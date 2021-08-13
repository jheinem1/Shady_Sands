import { ContentProvider, MarketplaceService } from "@rbxts/services";

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
    ContentProvider.PreloadAsync([song]);
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
