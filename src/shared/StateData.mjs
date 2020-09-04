class StateData {
    constructor(params) {
        this.value = params.value ? params.value : 0;
        this.str = params.str ? params.str : "";
        this.text = params.text ? params.text : "";
    }
}

export default StateData;