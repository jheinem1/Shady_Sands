import { GroupService, Players } from "@rbxts/services";

export {};
const groups = [11674634];

const factions = new Array<Faction>();

/** used to store role information for the `Faction` class */
export class Role {
    constructor(public faction: Faction, public name: string, public id: number) {}
    /** checks if the player has the role */
    hasRole(player: Player) {
        return this.faction.getRole(player) === this;
    }
}

/** general-purpose class used to store information about factions relevant to the game */
export class Faction {
    name: string;
    id: number;
    roles: Role[];
    members = new Map<Player, Role>();
    protected connections = new Array<RBXScriptConnection>();
    constructor(info: GroupInfo) {
        this.name = info.Name;
        this.id = info.Id;
        this.roles = info.Roles.map((roleInfo) => new Role(this, roleInfo.Name, roleInfo.Rank));
        Players.GetPlayers().forEach((player) => this.onPlayer(player));
        this.connections.push(Players.PlayerAdded.Connect((player) => this.onPlayer(player)));
    }
    /** called internally when a player joins the game or exists at the time of init */
    protected async onPlayer(player: Player) {
        const rank = player.GetRankInGroup(this.id);
        if (rank > 0) {
            const role = this.roles.find((role) => rank === role.id);
            if (role) this.members.set(player, role);
        }
    }
    /** gets the player's role within the faction (returns nil if not in faction) */
    getRole(player: Player) {
        return this.members.get(player);
    }
    /** checks if a player is in the faction */
    inFaction(player: Player) {
        return this.members.has(player);
    }
    /** disconnects all events before garbage collection */
    destruct() {
        this.connections.forEach((connection) => connection.Disconnect());
    }
}

/** function meant for handlers to asynchronously get and refresh faction information */
export async function getFactions(refresh?: boolean) {
    if (refresh) {
        factions.forEach((faction) => faction.destruct());
        factions.clear();
    }
    if (factions.isEmpty())
        groups.map((id) => new Faction(GroupService.GetGroupInfoAsync(id))).move(0, groups.size(), 0, factions);
    return factions;
}
