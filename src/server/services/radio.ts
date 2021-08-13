import { OnStart, Service } from "@flamework/core";

class RadioStation {
	constructor(public name: string, public ids: number[]) {}
}

@Service()
export class RadioService implements OnStart {
	onStart() {}
}
