class Item {
  _id: string;
  acceptsWaiver: boolean;
  ownersFirstName: string;
  ownersLastName: string;
  ownersEmail: string;
  type: string;
  brand: string;
  model: string;
  symptoms: string;
  repairerFirstName: string;
  repairerLastName: string;
  notes: string;
  repairStatus: string;
  weight: string;
  cost: string;

  constructor(
    id: string = "",
    acceptsWaiver: boolean = false,
    ownersFirstName: string = "",
    ownersLastName: string = "",
    ownersEmail: string,
    type: string = "",
    brand: string = "",
    model: string = "",
    symptoms: string = "",
    repairerFirstName: string = "",
    repairerLastName: string = "",
    notes: string = "",
    repairStatus: string = "In Queue",
    weight: string = "",
    cost: string = "",
  ) {
    this._id = id;
    this.acceptsWaiver = acceptsWaiver;
    this.ownersEmail = ownersEmail;
    this.ownersFirstName = ownersFirstName;
    this.ownersLastName = ownersLastName;
    this.type = type;
    this.brand = brand;
    this.model = model;
    this.symptoms = symptoms;
    this.repairerFirstName = repairerFirstName;
    this.repairerLastName = repairerLastName;
    this.notes = notes;
    this.status = status;
    this.weight = weight;
    this.cost = cost;
  }
};

export default Item;