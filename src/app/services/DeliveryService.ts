import api from "../dependencies/api";
import Delivery from '@/app/models/Delivery'

class DeliveryService {
    
  async createDeliveries(delivery: Delivery){
    try {
      const response = await api.post('/delivery', delivery);
    } catch (error) {
      alert(error)
    }
  }

  async getDeliveries(): Promise<Delivery[]> {
    let deliveries: Delivery[] = [];
    try {
      const response = await api.get('/delivery');
      deliveries = response.data.data;
      return deliveries;
    } catch (error) {
      return deliveries;
    }
  }

}

export default new DeliveryService();