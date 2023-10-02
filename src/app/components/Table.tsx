import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import ViewDelivery from "./ViewDelivery";
import { useState } from "react";
import Delivery from "../models/Delivery";
import { formatDate } from "../utils/formatDate";
interface ITableProps {
  rows: GridRowsProp;
}

export default function Table({ rows }: ITableProps) {
  const [open, setOpen] = useState(false);
  const [delivery, setDelivery] = useState<Delivery>({client:'', date:'', origin:'', destination:''});
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const convertParamsToDelivery = (params: any): Delivery => {
    return {
      client: params.row.client,
      date: params.row.date,
      origin: params.row.origin,
      destination: params.row.destination,
    };
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 150 },
    { field: "client", headerName: "Cliente", width: 150 },
    { field: "date", headerName: "Data", width: 150,  valueGetter: (params) => formatDate(params.row.date), },
    { field: "origin", headerName: "Origem", width: 150 },
    { field: "destination", headerName: "Destino", width: 150 },
    {
      field: "view",
      headerName: "Visualizar",
      width: 150,
      renderCell: (params) => (
        <IconButton
          aria-label="Visualizar"
          onClick={() => {
            const deliveryData = convertParamsToDelivery(params);
            setDelivery(deliveryData);
            handleClickOpen();
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];
  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Visulizar entrega</DialogTitle>
        <DialogContent>
          <ViewDelivery delivery={delivery}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
