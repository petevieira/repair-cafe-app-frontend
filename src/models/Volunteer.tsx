class Volunteer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    acceptsWaiver: boolean;
    eventId: string;

    constructor(
        id: string = "",
        firstName: string = "",
        lastName: string = "",
        email: string = "",
        acceptsWaiver: boolean = false,
        eventId: string = ""
    ) {
        this._id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.acceptsWaiver = acceptsWaiver;
        this.eventId = eventId;
    }
};

export default Volunteer;