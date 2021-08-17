import { SingleMotor } from "@rbxts/flipper";
import Roact from "@rbxts/roact";

interface CardComponentProps {
    focusedMotor: SingleMotor;
    position: Roact.Binding<UDim2>;
    title: Roact.Binding<string>;
    description: Roact.Binding<string>;
    image: Roact.Binding<number | undefined>;
    groupID: Roact.Binding<number | undefined>;
}

export class CardComponent extends Roact.Component<CardComponentProps> {
    focused: Roact.Binding<number>;
    constructor(props: CardComponentProps) {
        super(props);
        let setFocused: (x: number) => void;
        [this.focused, setFocused] = Roact.createBinding(props.focusedMotor.getValue());
        props.focusedMotor.onStep(setFocused);
    }
    render() {
        return (
            <frame
                Key="Card"
                BackgroundColor3={this.focused.map((x) =>
                    Color3.fromRGB(55, 55, 74).Lerp(Color3.fromRGB(32, 32, 43), x),
                )}
                BorderColor3={Color3.fromRGB(125, 125, 168)}
                Size={this.focused.map((x) => new UDim2(0.4, 0, 0.2, 0).Lerp(new UDim2(0.8, 0, 0.4, 0), x))}
                SizeConstraint={Enum.SizeConstraint.RelativeYY}
            >
                <imagelabel
                    Key="Image"
                    BackgroundTransparency={1}
                    Image={this.props.image.map((id) =>
                        id !== undefined ? `rbxassetid://${id}` : "rbxassetid://7271977339",
                    )}
                    ImageTransparency={this.focused.map((x) => -x + 1)}
                    Size={new UDim2(0.79, 0, 1, 0)}
                    SizeConstraint={Enum.SizeConstraint.RelativeYY}
                />
                <textlabel
                    Key="Title"
                    BackgroundTransparency={1}
                    Font={Enum.Font.SourceSansBold}
                    Position={new UDim2(0.55, 0, 0.2, 0)}
                    Size={new UDim2(0.3, 0, 0.1, 0)}
                    Text={this.props.title}
                    TextColor3={this.focused.map((x) =>
                        Color3.fromRGB(150, 150, 150).Lerp(Color3.fromRGB(255, 255, 255), x),
                    )}
                    TextScaled={true}
                    TextSize={14}
                    TextWrapped={true}
                />
                <textlabel
                    Key="Description"
                    BackgroundTransparency={1}
                    Font={Enum.Font.SourceSans}
                    Position={new UDim2(0.55, 0, 0.3, 0)}
                    Size={new UDim2(0.3, 0, 0.5, 0)}
                    Text={this.props.description}
                    TextColor3={this.focused.map((x) =>
                        Color3.fromRGB(150, 150, 150).Lerp(Color3.fromRGB(255, 255, 255), x),
                    )}
                    TextSize={18}
                    TextWrapped={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Top}
                />
                <textbutton
                    Key="GroupButton"
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    Font={Enum.Font.SourceSansSemibold}
                    Position={new UDim2(0.55, 0, 0.8, 0)}
                    Size={new UDim2(0.15, -5, 0.07, 0)}
                    Text="Group"
                    TextColor3={Color3.fromRGB(32, 32, 43)}
                    TextScaled={true}
                    TextSize={12}
                    TextWrapped={true}
                >
                    <uicorner CornerRadius={new UDim(0, 3)} />
                    <uigradient
                        Color={this.focused.map(
                            (x) =>
                                new ColorSequence([
                                    new ColorSequenceKeypoint(
                                        0,
                                        Color3.fromRGB(26, 102, 135).Lerp(Color3.fromRGB(41, 171, 226), x),
                                    ),
                                    new ColorSequenceKeypoint(
                                        1,
                                        Color3.fromRGB(23, 112, 71).Lerp(Color3.fromRGB(34, 181, 115), x),
                                    ),
                                ]),
                        )}
                    />
                </textbutton>
                <textbutton
                    Key="TeamButton"
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    Font={Enum.Font.SourceSansSemibold}
                    Position={new UDim2(0.7, 5, 0.8, 0)}
                    Size={new UDim2(0.15, -5, 0.07, 0)}
                    Text="Play"
                    TextColor3={Color3.fromRGB(32, 32, 43)}
                    TextScaled={true}
                    TextSize={12}
                    TextWrapped={true}
                >
                    <uicorner CornerRadius={new UDim(0, 3)} />
                    <uigradient
                        Color={this.focused.map(
                            (x) =>
                                new ColorSequence([
                                    new ColorSequenceKeypoint(
                                        0,
                                        Color3.fromRGB(26, 102, 135).Lerp(Color3.fromRGB(41, 171, 226), x),
                                    ),
                                    new ColorSequenceKeypoint(
                                        1,
                                        Color3.fromRGB(23, 112, 71).Lerp(Color3.fromRGB(34, 181, 115), x),
                                    ),
                                ]),
                        )}
                    />
                </textbutton>
                <uicorner />
                <uistroke Color={Color3.fromRGB(125, 125, 168)} />
            </frame>
        );
    }
}
