class Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  acceptsWaiver: boolean;

  constructor(
    id: string = "",
    firstName: string = "",
    lastName: string = "",
    email: string = "",
    acceptsWaiver: boolean = false,
  ) {
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.acceptsWaiver = acceptsWaiver;
  }
};

export default Volunteer;