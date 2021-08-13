import Roact from "@rbxts/roact";

interface ButtonComponentProps {
    sound: Sound;
}

interface ButtonComponentState {
    enabled: boolean;
}

export default class ButtonComponent extends Roact.Component<ButtonComponentProps, ButtonComponentState> {
    state = { enabled: true };
    render() {
        return (
            <screengui Key="RadioToggle" ResetOnSpawn={false}>
                <textbutton
                    Key="RadioToggleButton"
                    Style={
                        this.state.enabled
                            ? Enum.ButtonStyle.RobloxRoundDefaultButton
                            : Enum.ButtonStyle.RobloxRoundButton
                    }
                    Text="Radio"
                    Size={UDim2.fromOffset(50, 50)}
                    Position={new UDim2(1, -50, 1, -50)}
                    Event={{
                        MouseButton1Click: () => {
                            this.setState({ enabled: !this.state.enabled });
                            this.props.sound.Volume = this.state.enabled ? 2 : 0;
                        },
                    }}
                />
            </screengui>
        );
    }
}
