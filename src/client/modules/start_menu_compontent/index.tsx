import { SingleMotor } from "@rbxts/flipper";
import Roact, { Element } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { Faction } from "shared/modules/factions";
import { CardComponent } from "./card";

interface StartMenuProps {
    playerFactions: Faction[];
}

interface StartMenuState {
    cards: Element[];
}

export class StartMenuComponent extends Roact.Component<StartMenuProps, StartMenuState> {
    leftCardVisible: Roact.Binding<boolean>;
    rightCardVisible: Roact.Binding<boolean>;
    centerCardVisible: Roact.Binding<boolean>;
    setLeftCardVisible: (visible: boolean) => void;
    setRightCardVisible: (visible: boolean) => void;
    setCenterCardVisible: (visible: boolean) => void;
    leftCardPos: Roact.Binding<UDim2>;
    rightCardPos: Roact.Binding<UDim2>;
    centerCardPos: Roact.Binding<UDim2>;
    setLeftCardPos: (position: UDim2) => void;
    setRightCardPos: (position: UDim2) => void;
    setCenterCardPos: (position: UDim2) => void;
    leftCardTitle: Roact.Binding<string>;
    rightCardTitle: Roact.Binding<string>;
    centerCardTitle: Roact.Binding<string>;
    setLeftCardTitle: (title: string) => void;
    setRightCardTitle: (title: string) => void;
    setCenterCardTitle: (title: string) => void;
    leftCardDescription: Roact.Binding<string>;
    rightCardDescription: Roact.Binding<string>;
    centerCardDescription: Roact.Binding<string>;
    setLeftCardDescription: (description: string) => void;
    setRightCardDescription: (description: string) => void;
    setCenterCardDescription: (description: string) => void;
    leftCardImage: Roact.Binding<number | undefined>;
    rightCardImage: Roact.Binding<number | undefined>;
    centerCardImage: Roact.Binding<number | undefined>;
    setLeftCardImage: (image: number | undefined) => void;
    setRightCardImage: (image: number | undefined) => void;
    setCenterCardImage: (image: number | undefined) => void;
    leftCardGroupID: Roact.Binding<number | undefined>;
    rightCardGroupID: Roact.Binding<number | undefined>;
    centerCardGroupID: Roact.Binding<number | undefined>;
    setLeftCardGroupID: (groupID: number | undefined) => void;
    setRightCardGroupID: (groupID: number | undefined) => void;
    setCenterCardGroupID: (groupID: number | undefined) => void;
    leftFocusedMotor = new SingleMotor(0);
    centerFocusedMotor = new SingleMotor(0);
    rightFocusedMotor = new SingleMotor(0);
    leftRef = Roact.createRef<Frame>();
    centerRef = Roact.createRef<Frame>();
    connections = new Array<RBXScriptConnection>();
    factionIndex = 0;
    constructor(props: StartMenuProps) {
        super(props);
        [this.leftCardVisible, this.setLeftCardVisible] = Roact.createBinding<boolean>(false);
        [this.rightCardVisible, this.setRightCardVisible] = Roact.createBinding<boolean>(false);
        [this.centerCardVisible, this.setCenterCardVisible] = Roact.createBinding<boolean>(false);
        [this.leftCardPos, this.setLeftCardPos] = Roact.createBinding(new UDim2());
        [this.rightCardPos, this.setRightCardPos] = Roact.createBinding(new UDim2());
        [this.centerCardPos, this.setCenterCardPos] = Roact.createBinding(new UDim2());
        [this.leftCardTitle, this.setLeftCardTitle] = Roact.createBinding("");
        [this.rightCardTitle, this.setRightCardTitle] = Roact.createBinding("");
        [this.centerCardTitle, this.setCenterCardTitle] = Roact.createBinding("");
        [this.leftCardDescription, this.setLeftCardDescription] = Roact.createBinding("");
        [this.rightCardDescription, this.setRightCardDescription] = Roact.createBinding("");
        [this.centerCardDescription, this.setCenterCardDescription] = Roact.createBinding("");
        [this.leftCardImage, this.setLeftCardImage] = Roact.createBinding<number | undefined>(undefined);
        [this.rightCardImage, this.setRightCardImage] = Roact.createBinding<number | undefined>(undefined);
        [this.centerCardImage, this.setCenterCardImage] = Roact.createBinding<number | undefined>(undefined);
        [this.leftCardGroupID, this.setLeftCardGroupID] = Roact.createBinding<number | undefined>(undefined);
        [this.rightCardGroupID, this.setRightCardGroupID] = Roact.createBinding<number | undefined>(undefined);
        [this.centerCardGroupID, this.setCenterCardGroupID] = Roact.createBinding<number | undefined>(undefined);
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
            this.setLeftCardPos(UDim2.fromOffset(-sideSize.X / 2, center.Y - sideSize.Y / 2));
            this.setRightCardPos(UDim2.fromOffset(center.X - sideSize.X / 2, center.Y - sideSize.Y / 2));
            this.setLeftCardPos(UDim2.fromOffset(center.X - center.X / 2, center.Y - centerSize.Y / 2));
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
