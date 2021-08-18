import { Service } from "@flamework/core";
import { Faction, getFactions } from "shared/modules/factions";

@Service()
export class FactionService {
    factions = new Array<Faction>();
    async getFactions() {
        if (this.factions.isEmpty()) this.factions = await getFactions();
        return this.factions;
    }
}
