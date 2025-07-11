export interface RegistrationData {
  title: "mr" | "mrs";
  name: string;
  email: string;
  password: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  signupForNewsletter: boolean;
  receiveSpecialOffers: boolean;
  address: {
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  };
}

export const registrationData: RegistrationData = {
  title: "mr",
  name: "automation-tester",
  email: "automation-tester-1752219447664@test.auto",
  password: "Autiomation#is#fun!",
  dateOfBirth: {
    day: "4",
    month: "1", // January
    year: "1987",
  },
  signupForNewsletter: false,
  receiveSpecialOffers: true,
  address: {
    firstName: "Angel",
    lastName: "Dzhambazov",
    address: "home",
    country: "Singapore",
    state: "Singapore",
    city: "Tampines",
    zipcode: "529536",
    mobileNumber: "+6591234567",
  },
};

// Alternative data sets for different test scenarios
export const registrationDataMrs: RegistrationData = {
  ...registrationData,
  title: "mrs",
  name: "automation-tester-mrs",
  email: "automation-tester-mrs-july-2025@test.auto",
};

export const registrationDataWithNewsletter: RegistrationData = {
  ...registrationData,
  name: "automation-tester-newsletter",
  email: "automation-tester-newsletter-july-2025@test.auto",
  signupForNewsletter: true,
  receiveSpecialOffers: false,
};

export const registrationDataUS: RegistrationData = {
  ...registrationData,
  name: "automation-tester-us",
  email: "automation-tester-us-july-2025@test.auto",
  address: {
    firstName: "John",
    lastName: "Doe",
    address: "123 Main Street",
    country: "United States",
    state: "California",
    city: "San Francisco",
    zipcode: "94102",
    mobileNumber: "+14155552671",
  },
};
