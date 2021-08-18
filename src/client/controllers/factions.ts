import { Controller } from "@flamework/core";
import { Faction, getFactions } from "shared/modules/factions";

@Controller()
export class FactionController {
    factions = new Array<Faction>();
    async getFactions() {
        if (this.factions.isEmpty()) this.factions = await getFactions();
        return this.factions;
    }
}
