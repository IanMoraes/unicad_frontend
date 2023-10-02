"use client";
import { Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import DeliveryService from "./services/DeliveryService";
import Delivery from "./models/Delivery";
import Table from "./components/Table";
import Form, { FormData } from "./components/Form"
import dayjs from "dayjs";
import React from "react";
export default function Home() {
  const initialFormData: FormData = {
    client: "",
    origin: "",
    destination: "",
    date: null,
  };

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const convertFormDataToDelivery = (formData: FormData): Delivery => {
    const { client, origin, destination, date } = formData;
    return {
      client,
      origin,
      destination,
      date: date ? dayjs(date).format('DD/M/YYYY'): "",
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deliveryData: Delivery = convertFormDataToDelivery(formData);
    DeliveryService.createDeliveries(deliveryData);
    DeliveryService.getDeliveries().then((data) => {
      setDeliveries(data);
    });
    handleClose()
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    DeliveryService.getDeliveries().then((data) => {
      setDeliveries(data);
    });
  }, []);
  return (
    <main>
      <Container>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
          flexDirection={"column"}
          gap={4}
        >
          <Box justifyContent={"right"} alignItems={"right"}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Cadastrar Entrega
            </Button>
          </Box>
          <Box>
            {deliveries.length > 0 ? (
              <Table rows={deliveries} />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle >Cadastrar Entrega</DialogTitle>
        <DialogContent>
          <Form formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
