import { Box, Typography } from "@mui/material";
import React from "react";
import Delivery from "../models/Delivery";
import { formatDate } from "../utils/formatDate";
import { formatText } from "../utils/formatText";

interface ViewDeliveryProps {
  delivery: Delivery;
}

export default function ViewDelivery({ delivery }: ViewDeliveryProps) {
 
  return (
    <Box
      display={"flex"}
      justifyContent={"left"}
      flexDirection={"column"}
      alignItems={"left"}
      gap={1}
      flexBasis={1}
    >
      <Typography>Cliente: {delivery.client}</Typography>
      <Typography>Data: {formatDate(delivery.date)}</Typography>
      <iframe
        width="450"
        height="250"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyDvl7oBco3phNJ3tSPEzLcUjTtvKDo001I&origin=${formatText(delivery.origin)}
        &destination=${formatText(delivery.destination)}`}
        allowFullScreen
      ></iframe>
    </Box>
  );
}
