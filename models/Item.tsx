class Item {
  id: string;
  ownersFirstName: string;
  ownersLastName: string;
  ownersEmail: string;
  brand: string;
  model: string;
  symptoms: string;
  repairer: string;
  repairerNotes: string;
  repairStatus: string;

  constructor(
    id: string = "",
    ownersFirstName: string = "",
    ownersLastName: string = "",
    ownersEmail: string,
    brand: string = "",
    model: string = "",
    symptoms: string = "",
    repairer: string = "",
    repairerNotes: string = "",
    repairStatus: string = ""
  ) {
    this.id = id;
    this.ownersEmail = ownersEmail;
    this.ownersFirstName = ownersFirstName;
    this.ownersLastName = ownersLastName;
    this.brand = brand;
    this.model = model;
    this.symptoms = symptoms;
    this.repairer = repairer;
    this.repairerNotes = repairerNotes;
    this.repairStatus = repairStatus;
  }
};

export default Item;