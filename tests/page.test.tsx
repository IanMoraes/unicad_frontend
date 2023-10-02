
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { Button, CircularProgress } from "@mui/material";
import Home from "../src/app/page";
import React from "react";
import { render } from "react-dom";
import DeliveryService from "../src/app/services/DeliveryService";
import Form from "../src/app/components/Form";
describe('Home', () => {
 it('should render a loading spinner when there are no deliveries', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
  });


  it('should render a table with deliveries when there are deliveries', () => {
    const deliveries = [
      { id: 1, client: 'Client 1', origin: 'Origin 1', destination: 'Destination 1', date: '2022-01-01' },
      { id: 2, client: 'Client 2', origin: 'Origin 2', destination: 'Destination 2', date: '2022-01-02' },
    ];

    jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
    jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());

    const getDeliveriesMock = jest.spyOn(DeliveryService, 'getDeliveries').mockResolvedValue(deliveries);

    render(<Home />);

    expect(getDeliveriesMock).toHaveBeenCalled();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(deliveries.length + 1);
  });


  it('should open dialog when add delivery button is clicked', () => {
    const mockDeliveryService = jest.spyOn(DeliveryService, 'createDeliveries');
    const mockGetDeliveries = jest.spyOn(DeliveryService, 'getDeliveries').mockResolvedValue([]);
    const mockSetDeliveries = jest.fn();
    const mockSetFormData = jest.fn();
    const mockSetOpen = jest.fn();

    const initialFormData: FormData = {
      client: "",
      origin: "",
      destination: "",
      date: null,
    };

    const wrapper = shallow(<Home />);
    const addButton = wrapper.find(Button);

    addButton.simulate('click');

    expect(mockSetOpen).toHaveBeenCalledWith(true);

    wrapper.find(Form).props().handleSubmit({ preventDefault: jest.fn() });

    expect(mockDeliveryService).toHaveBeenCalledWith({
      client: initialFormData.client,
      origin: initialFormData.origin,
      destination: initialFormData.destination,
      date: "",
    });
    expect(mockGetDeliveries).toHaveBeenCalled();

    expect(mockSetDeliveries).toHaveBeenCalledWith([]);
    expect(mockSetFormData).toHaveBeenCalledWith(initialFormData);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should handle errors when getting deliveries from the server', () => {
    jest.spyOn(DeliveryService, 'getDeliveries').mockRejectedValue(new Error('Error getting deliveries'));

    render(<Home />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    expect(screen.getByText('Error getting deliveries')).toBeInTheDocument();
  });


  it('should handle errors when creating a new delivery', () => {
    const mockDeliveryData = {
      client: 'John Doe',
      origin: 'New York',
      destination: 'Los Angeles',
      date: new Date(),
    };
    const mockFormData = {
      client: 'John Doe',
      origin: 'New York',
      destination: 'Los Angeles',
      date: null,
    };
    const mockDeliveries = [
      {
        id: 1,
        client: 'John Doe',
        origin: 'New York',
        destination: 'Los Angeles',
        date: new Date(),
      },
    ];
    const mockDeliveryService = {
      createDeliveries: jest.fn().mockRejectedValue(new Error('Failed to create delivery')),
      getDeliveries: jest.fn().mockResolvedValue(mockDeliveries),
    };
    const mockSetDeliveries = jest.fn();
    const mockSetFormData = jest.fn();
    const mockHandleClose = jest.fn();

    render(
      <Home 
        DeliveryService={mockDeliveryService}
        setDeliveries={mockSetDeliveries}
        setFormData={mockSetFormData}
        handleClose={mockHandleClose}
      />
    );

    fireEvent.click(screen.getByText('Cadastrar Entrega'));
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'Los Angeles' } });
    fireEvent.click(screen.getByText('Cadastrar'));

    expect(mockDeliveryService.createDeliveries).toHaveBeenCalledWith(mockDeliveryData);
    expect(mockDeliveryService.getDeliveries).toHaveBeenCalled();
    expect(mockSetDeliveries).toHaveBeenCalledWith(mockDeliveries);
    expect(mockSetFormData).toHaveBeenCalledWith(mockFormData);
    expect(mockHandleClose).toHaveBeenCalled();
    expect(screen.queryByText('Failed to create delivery')).toBeInTheDocument();
  });

});

   
function shallow(arg0: React.JSX.Element) {
    throw new Error("Function not implemented.");
}

