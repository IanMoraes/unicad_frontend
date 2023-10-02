interface Delivery {
  id?: number;
  client: string;
  origin: string;
  destination: string;
  date: string | Date;
  created_at?: Date ;
}

export default Delivery;
