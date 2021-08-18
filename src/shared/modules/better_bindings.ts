import Roact, { Binding } from "@rbxts/roact";

export class BetterBinding<T> implements Binding<T> {
    setter: (value: T) => void;
    binding: Binding<T>;
    constructor(protected value: T) {
        [this.binding, this.setter] = Roact.createBinding<T>(value);
    }
    setValue(value: T): void {
        this.setter(value);
        this.updateValue();
    }
    getValue(): T {
        this.updateValue();
        return this.value;
    }
    updateValue(): void {
        this.value = this.binding.getValue();
    }
    map<U>(predicate: (value: T) => U): Roact.Binding<U> {
        return this.binding.map(predicate);
    }
}
