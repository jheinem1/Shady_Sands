import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { Faction } from "shared/modules/factions";

interface StartMenuProps {
    playerFactions: Faction[];
}

export class StartMenuComponent extends Roact.Component<StartMenuProps> {
    leftCardPos: Roact.Binding<UDim2>;
    rightCardPos: Roact.Binding<UDim2>;
    centerCardPos: Roact.Binding<UDim2>;
    setLeftCardPos: (position: UDim2) => void;
    setRightCardPos: (position: UDim2) => void;
    setCenterCardPos: (position: UDim2) => void;
    leftRef = Roact.createRef<Frame>();
    centerRef = Roact.createRef<Frame>();
    connections = new Array<RBXScriptConnection>();
    constructor(props: StartMenuProps) {
        super(props);
        [this.leftCardPos, this.setLeftCardPos] = Roact.createBinding(new UDim2());
        [this.rightCardPos, this.setRightCardPos] = Roact.createBinding(new UDim2());
        [this.centerCardPos, this.setCenterCardPos] = Roact.createBinding(new UDim2());
    }
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
            <screengui Key="Start Menu" ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}></screengui>
        );
    }
}
