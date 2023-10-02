
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
    // Mock data
    const deliveries = [
      { id: 1, client: 'Client 1', origin: 'Origin 1', destination: 'Destination 1', date: '2022-01-01' },
      { id: 2, client: 'Client 2', origin: 'Origin 2', destination: 'Destination 2', date: '2022-01-02' },
    ];

    // Mock useState and useEffect hooks
    jest.spyOn(React, 'useState').mockImplementation((initialValue) => [initialValue, jest.fn()]);
    jest.spyOn(React, 'useEffect').mockImplementation((callback) => callback());

    // Mock DeliveryService.getDeliveries function
    const getDeliveriesMock = jest.spyOn(DeliveryService, 'getDeliveries').mockResolvedValue(deliveries);

    render(<Home />);

    expect(getDeliveriesMock).toHaveBeenCalled();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(deliveries.length + 1); // +1 for the header row
  });


  // Opens a dialog to add a new delivery when the add delivery button is clicked
  it('should open dialog when add delivery button is clicked', () => {
    // Mock the necessary dependencies and setup initial state
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

    // Simulate clicking the add delivery button
    addButton.simulate('click');

    // Assert that the dialog is open
    expect(mockSetOpen).toHaveBeenCalledWith(true);

    // Simulate submitting the form
    wrapper.find(Form).props().handleSubmit({ preventDefault: jest.fn() });

    // Assert that the delivery service methods were called correctly
    expect(mockDeliveryService).toHaveBeenCalledWith({
      client: initialFormData.client,
      origin: initialFormData.origin,
      destination: initialFormData.destination,
      date: "",
    });
    expect(mockGetDeliveries).toHaveBeenCalled();

    // Assert that the state was updated correctly
    expect(mockSetDeliveries).toHaveBeenCalledWith([]);
    expect(mockSetFormData).toHaveBeenCalledWith(initialFormData);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });


  // Handles errors when getting deliveries from the server
  it('should handle errors when getting deliveries from the server', () => {
    // Mock the DeliveryService.getDeliveries function to throw an error
    jest.spyOn(DeliveryService, 'getDeliveries').mockRejectedValue(new Error('Error getting deliveries'));

    // Render the Home component
    render(<Home />);

    // Assert that the CircularProgress component is rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert that the error message is displayed
    expect(screen.getByText('Error getting deliveries')).toBeInTheDocument();
  });


  // Handles errors when creating a new delivery
  it('should handle errors when creating a new delivery', () => {
    // Mock the necessary dependencies and functions
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

    // Render the component with the mocked dependencies and functions
    render(
      <Home
        DeliveryService={mockDeliveryService}
        setDeliveries={mockSetDeliveries}
        setFormData={mockSetFormData}
        handleClose={mockHandleClose}
      />
    );

    // Simulate user interaction
    fireEvent.click(screen.getByText('Cadastrar Entrega'));
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Origem'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('Destino'), { target: { value: 'Los Angeles' } });
    fireEvent.click(screen.getByText('Cadastrar'));

    // Assert the expected behavior
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

