import { CircularProgress } from "@mui/material";
import Home from "./page";

describe('Home', () => {
    it('should render a loading spinner when there are no deliveries', () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
      });
  
  
      it('should render a table with deliveries when there are deliveries', () => {
        const mockDeliveryService = jest.mock('./services/DeliveryService');
        const mockDelivery = jest.mock('./models/Delivery');
        const mockTable = jest.mock('./components/Table');
  
        const initialFormData = {
          client: "",
          origin: "",
          destination: "",
          date: null,
        };
        const deliveries = [{ id: 1, client: "John Doe", origin: "A", destination: "B", date: "2022-01-01" }];
        const open = false;
        const formData = initialFormData;
  
        mockDeliveryService.getDeliveries.mockResolvedValue(deliveries);
  
        const { getByText } = render(<Home />);
  
        expect(getByText("John Doe")).toBeInTheDocument();
        expect(getByText("A")).toBeInTheDocument();
        expect(getByText("B")).toBeInTheDocument();
        expect(getByText("2022-01-01")).toBeInTheDocument();
      });
  
  
      it('should render a button to add a new delivery', () => {
        const mockDeliveries = [];
        const mockSetDeliveries = jest.fn();
        const mockSetOpen = jest.fn();
        const mockSetFormData = jest.fn();
        const mockHandleClickOpen = jest.fn();
        const mockHandleSubmit = jest.fn();
        const mockHandleClose = jest.fn();
        const mockDeliveryService = {
          createDeliveries: jest.fn(),
          getDeliveries: jest.fn().mockResolvedValue(mockDeliveries),
        };
        const mockFormData = {
          client: "",
          origin: "",
          destination: "",
          date: null,
        };
  
        render(
          <Home
            deliveries={mockDeliveries}
            setDeliveries={mockSetDeliveries}
            setOpen={mockSetOpen}
            formData={mockFormData}
            setFormData={mockSetFormData}
            handleClickOpen={mockHandleClickOpen}
            handleSubmit={mockHandleSubmit}
            handleClose={mockHandleClose}
            deliveryService={mockDeliveryService}
          />
        );
  
        expect(screen.getByRole('button', { name: /Cadastrar Entrega/i })).toBeInTheDocument();
      });
  
  
      it('should open dialog when add button is clicked', () => {
        const mockDeliveryService = jest.fn();
        const mockSetDeliveries = jest.fn();
        const mockSetFormData = jest.fn();
        const mockHandleSubmit = jest.fn();
        const mockSetOpen = jest.fn();
        const mockSetFormData = jest.fn();
        const mockHandleClose = jest.fn();
  
        jest.mock('./services/DeliveryService', () => {
          return jest.fn().mockImplementation(() => {
            return {
              createDeliveries: mockDeliveryService,
              getDeliveries: jest.fn().mockResolvedValue([]),
            };
          });
        });
  
        jest.mock('react', () => ({
          ...jest.requireActual('react'),
          useState: (initialState) => [initialState, mockSetDeliveries],
          useEffect: (effect) => effect(),
        }));
  
        jest.mock('@mui/material', () => ({
          ...jest.requireActual('@mui/material'),
          Button: jest.fn().mockImplementation(({ onClick }) => (
            <button onClick={onClick}>Cadastrar Entrega</button>
          )),
          Dialog: jest.fn().mockImplementation(({ open, onClose, children }) => (
            <div>
              <div>{open.toString()}</div>
              <div>{onClose.toString()}</div>
              <div>{children}</div>
            </div>
          )),
        }));
  
        jest.mock('./components/Form', () => ({
          __esModule: true,
          default: jest.fn().mockImplementation(({ formData, setFormData, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
              <button type="submit">Cadastrar</button>
            </form>
          )),
        }));
  
        const Home = require('./Home').default;
        const { render, screen, fireEvent } = require('@testing-library/react');
  
        render(<Home />);
  
        fireEvent.click(screen.getByText('Cadastrar Entrega'));
  
        expect(screen.getByText('true')).toBeInTheDocument();
        expect(screen.getByText('handleClose')).toBeInTheDocument();
        expect(screen.getByText('Form')).toBeInTheDocument();
      });
  
});


