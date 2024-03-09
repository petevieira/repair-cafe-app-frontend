class Item {
  _id: string;
  acceptsWaiver: boolean;
  orderNumber: number;
  ownersFirstName: string;
  ownersLastName: string;
  ownersEmail: string;
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

  constructor(
    id: string = "",
    acceptsWaiver: boolean = false,
    orderNumber: number,
    ownersFirstName: string = "",
    ownersLastName: string = "",
    ownersEmail: string,
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
  ) {
    this._id = id;
    this.acceptsWaiver = acceptsWaiver;
    this.orderNumber = orderNumber;
    this.ownersEmail = ownersEmail;
    this.ownersFirstName = ownersFirstName;
    this.ownersLastName = ownersLastName;
    this.type = type;
    this.brand = brand;
    this.model = model;
    this.symptoms = symptoms;
    this.repairerFirstName = repairerFirstName;
    this.repairerLastName = repairerLastName;
    this.repairNotes = repairNotes;
    this.repairStatue = repairStatus;
    this.repairBarrier = repairBarrier;
    this.weight = weight;
    this.cost = cost;
  }
};

export default Item;