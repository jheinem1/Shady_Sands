import { SingleMotor } from "@rbxts/flipper";
import Roact, { Element } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { BetterBinding } from "shared/modules/better_bindings";
import { Faction } from "shared/modules/factions";
import { CardComponent } from "./card";

interface StartMenuProps {
    playerFactions: Faction[];
}

interface StartMenuState {
    cards: Element[];
}

export class StartMenuComponent extends Roact.Component<StartMenuProps, StartMenuState> {
    leftCardVisible = new BetterBinding<boolean>(false);
    rightCardVisible = new BetterBinding<boolean>(false);
    centerCardVisible = new BetterBinding<boolean>(false);
    leftCardPos = new BetterBinding(new UDim2());
    rightCardPos = new BetterBinding(new UDim2());
    centerCardPos = new BetterBinding(new UDim2());
    leftCardTitle = new BetterBinding("");
    rightCardTitle = new BetterBinding("");
    centerCardTitle = new BetterBinding("");
    leftCardDescription = new BetterBinding("");
    rightCardDescription = new BetterBinding("");
    centerCardDescription = new BetterBinding("");
    leftCardImage = new BetterBinding<number | undefined>(undefined);
    rightCardImage = new BetterBinding<number | undefined>(undefined);
    centerCardImage = new BetterBinding<number | undefined>(undefined);
    leftCardGroupID = new BetterBinding<number | undefined>(undefined);
    rightCardGroupID = new BetterBinding<number | undefined>(undefined);
    centerCardGroupID = new BetterBinding<number | undefined>(undefined);
    leftFocusedMotor = new SingleMotor(0);
    centerFocusedMotor = new SingleMotor(0);
    rightFocusedMotor = new SingleMotor(0);
    leftRef = Roact.createRef<Frame>();
    centerRef = Roact.createRef<Frame>();
    connections = new Array<RBXScriptConnection>();
    factionIndex = 0;
    constructor(props: StartMenuProps) {
        super(props);
    }
    updateCards() {
        const playerFactions = this.props.playerFactions;
        const cards = new Array<Element>();
        const left: Faction | undefined = playerFactions[this.factionIndex - 1];
        const center: Faction | undefined = playerFactions[this.factionIndex];
        const right: Faction | undefined = playerFactions[this.factionIndex + 1];
        if (left) {
            const role = left.getRole(Players.LocalPlayer)?.name ?? "Undefined";
        }
    }
    nextCard() {}
    updateCardPos(sideSize: Vector2, centerSize: Vector2) {
        const center = this.getViewportCenter();
        if (center) {
            this.leftCardPos.setValue(UDim2.fromOffset(-sideSize.X / 2, center.Y - sideSize.Y / 2));
            this.rightCardPos.setValue(UDim2.fromOffset(center.X - sideSize.X / 2, center.Y - sideSize.Y / 2));
            this.centerCardPos.setValue(UDim2.fromOffset(center.X - center.X / 2, center.Y - centerSize.Y / 2));
        }
    }
    getViewportCenter() {
        const camera = Workspace.CurrentCamera;
        if (camera) return camera.ViewportSize.div(new Vector2(2, 2));
    }
    didMount() {
        const leftSize = this.leftRef.getValue()?.AbsoluteSize;
        const centerSize = this.centerRef.getValue()?.AbsoluteSize;
        if (leftSize && centerSize)
            Workspace.CurrentCamera?.GetPropertyChangedSignal("ViewportSize").Connect(() =>
                this.updateCardPos(leftSize, centerSize),
            );
    }
    willUnmount() {
        this.connections.forEach((connection) => connection.Disconnect());
    }
    render() {
        return (
            <screengui Key="Start Menu" ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
                {this.state.cards}
            </screengui>
        );
    }
}
