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

interface CardProps {
    visible: BetterBinding<boolean>;
    position: BetterBinding<UDim2>;
    title: BetterBinding<string>;
    description: BetterBinding<string>;
    image: BetterBinding<number | undefined>;
    groupID: BetterBinding<number | undefined>;
    focusedMotor: SingleMotor;
}

export class StartMenuComponent extends Roact.Component<StartMenuProps, StartMenuState> {
    leftCard: Element;
    center: Element;
    rightCard: Element;
    leftCardProps: CardProps = {
        visible: new BetterBinding<boolean>(false),
        position: new BetterBinding(new UDim2()),
        title: new BetterBinding(""),
        description: new BetterBinding(""),
        image: new BetterBinding<number | undefined>(undefined),
        groupID: new BetterBinding<number | undefined>(undefined),
        focusedMotor: new SingleMotor(0),
    };
    rightCardProps: CardProps = {
        visible: new BetterBinding<boolean>(false),
        position: new BetterBinding(new UDim2()),
        title: new BetterBinding(""),
        description: new BetterBinding(""),
        image: new BetterBinding<number | undefined>(undefined),
        groupID: new BetterBinding<number | undefined>(undefined),
        focusedMotor: new SingleMotor(0),
    };
    centerCardProps: CardProps = {
        visible: new BetterBinding<boolean>(false),
        position: new BetterBinding(new UDim2()),
        title: new BetterBinding(""),
        description: new BetterBinding(""),
        image: new BetterBinding<number | undefined>(undefined),
        groupID: new BetterBinding<number | undefined>(undefined),
        focusedMotor: new SingleMotor(0),
    };
    leftRef = Roact.createRef<Frame>();
    centerRef = Roact.createRef<Frame>();
    connections = new Array<RBXScriptConnection>();
    factionIndex = 0;
    constructor(props: StartMenuProps) {
        super(props);
        const left = this.leftCardProps;
        const right = this.rightCardProps;
        const center = this.centerCardProps;
        this.leftCard = (
            <CardComponent
                visible={left.visible}
                focusedMotor={left.focusedMotor}
                title={left.title}
                description={left.description}
                position={left.position}
                image={left.image}
                groupID={left.groupID}
            />
        );
        this.rightCard = (
            <CardComponent
                visible={right.visible}
                focusedMotor={right.focusedMotor}
                title={right.title}
                description={right.description}
                position={right.position}
                image={right.image}
                groupID={right.groupID}
            />
        );
        this.center = (
            <CardComponent
                visible={center.visible}
                focusedMotor={center.focusedMotor}
                title={center.title}
                description={center.description}
                position={center.position}
                image={center.image}
                groupID={center.groupID}
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
            this.leftCardProps.title.setValue(role);
            this.leftCardProps.description.setValue(`${role} is a part of the group ${left?.name ?? "Undefined"}.`);
        }
        if (right) {
            const role = right.getRole(Players.LocalPlayer)?.name ?? "Undefined";
            this.rightCardProps.title.setValue(role);
            this.rightCardProps.description.setValue(`${role} is a part of the group ${right?.name ?? "Undefined"}.`);
        }
        if (center) {
            const role = center.getRole(Players.LocalPlayer)?.name ?? "Undefined";
            this.centerCardProps.title.setValue(role);
            this.centerCardProps.description.setValue(`${role} is a part of the group ${center?.name ?? "Undefined"}.`);
        }
        // this.updateCardPos(sideSize, centerSize);
    }
    nextCard() {}
    updateCardPos(sideSize: Vector2, centerSize: Vector2) {
        const center = this.getViewportCenter();
        if (center) {
            this.leftCardProps.position.setValue(UDim2.fromOffset(-sideSize.X / 2, center.Y - sideSize.Y / 2));
            this.rightCardProps.position.setValue(
                UDim2.fromOffset(center.X - sideSize.X / 2, center.Y - sideSize.Y / 2),
            );
            this.centerCardProps.position.setValue(
                UDim2.fromOffset(center.X - center.X / 2, center.Y - centerSize.Y / 2),
            );
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
