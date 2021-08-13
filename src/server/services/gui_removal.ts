import { OnStart, Service } from "@flamework/core";
import { StarterGui } from "@rbxts/services";

@Service()
export class GuiRemovalService implements OnStart {
    onStart() {
        StarterGui.ChildAdded.Connect((child) => {
            if (child.Name === "Allaaaaah") child.Destroy();
        });
    }
}
