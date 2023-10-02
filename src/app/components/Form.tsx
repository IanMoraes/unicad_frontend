import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import DeliveryService from "../services/DeliveryService";
import Delivery from "../models/Delivery";
import dayjs from "dayjs";
interface FormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    handleSubmit: (e: React.FormEvent) => void;
  }
  
export interface FormData {
  client: string;
  origin: string;
  destination: string;
  date: Date | null;
}

const Form: React.FC<FormProps> = ({formData, handleSubmit, setFormData}:FormProps) => {

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof FormData
  ) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleDateChange = (newDate: Date | null) => {
    setFormData({
      ...formData,
      date: newDate,
    });
  };
 
  

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={4}
        flexBasis={1}
      >
        <TextField
          name="client"
          label="Cliente"
          variant="outlined"
          fullWidth
          required
          value={formData.client}
          onChange={(e) => handleChange(e, "client")}
        />
        <TextField
          name="origin"
          label="Origem"
          variant="outlined"
          fullWidth
          required
          value={formData.origin}
          onChange={(e) => handleChange(e, "origin")}
        />
        <TextField
          name="destination"
          label="Destino"
          variant="outlined"
          fullWidth
          required
          value={formData.destination}
          onChange={(e) => handleChange(e, "destination")}
        />

        <DatePicker
          label="Data"
          value={formData.date}
          onChange={handleDateChange}
          slotProps={{ textField: { name: "date", required: true } }}
        />
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
      </Box>
    </form>
  );
};

export default Form;
