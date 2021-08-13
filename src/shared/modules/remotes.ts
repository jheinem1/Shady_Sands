import Net from "@rbxts/net";
import { RadioStation } from "./radio/station_data_structures";

const Remotes = Net.Definitions.Create({
    GetStation: Net.Definitions.ServerAsyncFunction<(stationName: string) => RadioStation | false>(),
});
export default Remotes;
