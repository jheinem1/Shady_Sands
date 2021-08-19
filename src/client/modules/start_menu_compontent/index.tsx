import { SingleMotor } from "@rbxts/flipper";
import Roact, { Element } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { BetterBinding } from "shared/modules/better_bindings";
import { Faction } from "shared/modules/factions";
import { CardComponent } from "./card";

interface StartMenuProps {
    playerFactions: Faction[];
}

interface StartMenuState {}

export class StartMenuComponent extends Roact.Component<StartMenuProps, StartMenuState> {
    leftCard: Element;
    center: Element;
    rightCard: Element;
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
        this.leftCard = (
            <CardComponent
                visible={this.leftCardVisible}
                focusedMotor={this.leftFocusedMotor}
                title={this.leftCardTitle}
                description={this.leftCardDescription}
                position={this.leftCardPos}
                image={this.leftCardImage}
                groupID={this.leftCardGroupID}
            />
        );
        this.rightCard = (
            <CardComponent
                visible={this.rightCardVisible}
                focusedMotor={this.rightFocusedMotor}
                title={this.rightCardTitle}
                description={this.rightCardDescription}
                position={this.rightCardPos}
                image={this.rightCardImage}
                groupID={this.rightCardGroupID}
            />
        );
        this.center = (
            <CardComponent
                visible={this.centerCardVisible}
                focusedMotor={this.centerFocusedMotor}
                title={this.centerCardTitle}
                description={this.centerCardDescription}
                position={this.centerCardPos}
                image={this.centerCardImage}
                groupID={this.centerCardGroupID}
            />
        );
    }
    updateCards() {
        const playerFactions = this.props.playerFactions;
        const left: Faction | undefined = playerFactions[this.factionIndex - 1];
        const center: Faction | undefined = playerFactions[this.factionIndex];
        const right: Faction | undefined = playerFactions[this.factionIndex + 1];
        if (left) {
            const role = left.getRole(Players.LocalPlayer)?.name ?? "Undefined";
            this.leftCardTitle.setValue(role);
            this.leftCardDescription.setValue(`${role} is a part of the group ${left?.name ?? "Undefined"}.`);
        }
        if (right) {
            const role = right.getRole(Players.LocalPlayer)?.name ?? "Undefined";
            this.rightCardTitle.setValue(role);
            this.rightCardDescription.setValue(`${role} is a part of the group ${right?.name ?? "Undefined"}.`);
        }
        if (center) {
            const role = center.getRole(Players.LocalPlayer)?.name ?? "Undefined";
            this.centerCardTitle.setValue(role);
            this.centerCardDescription.setValue(`${role} is a part of the group ${center?.name ?? "Undefined"}.`);
        }
        // this.updateCardPos(sideSize, centerSize);
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
                {this.leftCard}
                {this.center}
                {this.rightCard}
            </screengui>
        );
    }
}
