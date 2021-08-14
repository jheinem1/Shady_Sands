import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";

interface ButtonComponentProps {
    sound: Sound;
}

interface ButtonComponentState {
    enabled: boolean;
}

export default class ButtonComponent extends Roact.Component<ButtonComponentProps, ButtonComponentState> {
    state = { enabled: true };
    initialPos = new UDim2(1, -52, 1, -52);
    expandedPos = new UDim2(1, -55, 1, -55);
    initialSize = UDim2.fromOffset(45, 45);
    expandedSize = UDim2.fromOffset(51, 51);
    motor = new SingleMotor(0);
    binding: Roact.Binding<number>;
    constructor(props: ButtonComponentProps) {
        super(props);
        let setBinding: (newValue: number) => void;
        [this.binding, setBinding] = Roact.createBinding(this.motor.getValue());
        this.motor.onStep(setBinding);
    }
    render() {
        return (
            <screengui Key="RadioToggle" ResetOnSpawn={false}>
                <imagebutton
                    Key="RadioToggleButton"
                    Image={this.state.enabled ? "rbxassetid://7250483387" : "rbxassetid://7250483916"}
                    Size={this.binding.map((x) => this.initialSize.Lerp(this.expandedSize, x))}
                    Position={this.binding.map((x) => this.initialPos.Lerp(this.expandedPos, x))}
                    BackgroundTransparency={1}
                    ImageTransparency={0.5}
                    Event={{
                        MouseButton1Click: () => {
                            this.setState({ enabled: !this.state.enabled });
                            this.props.sound.Volume = this.state.enabled ? 2 : 0;
                            const time = 5;
                            this.motor.setGoal(
                                new Spring(0, {
                                    frequency: time,
                                }),
                            );
                            task.delay(time / 60, () => {
                                this.motor.setGoal(
                                    new Spring(1, {
                                        frequency: 5,
                                    }),
                                );
                            });
                        },
                        MouseEnter: () => {
                            this.motor.setGoal(
                                new Spring(1, {
                                    frequency: 5,
                                }),
                            );
                        },
                        MouseLeave: () => {
                            this.motor.setGoal(
                                new Spring(0, {
                                    frequency: 5,
                                }),
                            );
                        },
                    }}
                />
            </screengui>
        );
    }
}
