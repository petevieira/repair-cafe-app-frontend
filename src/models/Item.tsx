class Item {
    _id: string;
    acceptsWaiver: boolean;
    ownersFirstName: string;
    ownersLastName: string;
    ownersEmail: string;
    product: string;
    type: string;
    brand: string;
    model: string;
    symptoms: string;
    repairerFirstName: string;
    repairerLastName: string;
    repairNotes: string;
    repairStatus: string;
    repairBarrier: string;
    weight: string;
    cost: string;
    isFollowUpRepair: boolean;

    constructor(
        id: string = "",
        acceptsWaiver: boolean = false,
        ownersFirstName: string = "",
        ownersLastName: string = "",
        ownersEmail: string = "",
        product: string = "",
        type: string = "",
        brand: string = "",
        model: string = "",
        symptoms: string = "",
        repairerFirstName: string = "",
        repairerLastName: string = "",
        repairNotes: string = "",
        repairStatus: string = "In Queue",
        repairBarrier: string = "TBD",
        weight: string = "",
        cost: string = "",
        isFollowUpRepair: boolean = false
    ) {
        this._id = id;
        this.acceptsWaiver = acceptsWaiver;
        this.ownersEmail = ownersEmail;
        this.ownersFirstName = ownersFirstName;
        this.ownersLastName = ownersLastName;
        this.product = product;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.symptoms = symptoms;
        this.repairerFirstName = repairerFirstName;
        this.repairerLastName = repairerLastName;
        this.repairNotes = repairNotes;
        this.repairStatus = repairStatus;
        this.repairBarrier = repairBarrier;
        this.weight = weight;
        this.cost = cost;
        this.isFollowUpRepair = isFollowUpRepair;
    }
};

export default Item;