class RepairEvent {
    _id: string;
    date: Date;

    constructor(
        id: string = "",
        date: Date = new Date(),
    ) {
        this._id = id;
        this.date = date;
    }
};

export default RepairEvent;
