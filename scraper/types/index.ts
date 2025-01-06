export type Flight = {
  price: string;
  airline: string;
  depart: FlightSched[];
  arrive: FlightSched[];
  duration: string[];
  from: string;
  to: string;
  stops: string[];
};

export type FlightSched = {
  day: string;
  time: string;
};
