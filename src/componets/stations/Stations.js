import React, { useState, useEffect } from "react";
import NewStations from "./NewStations";
import Station from "./Station";
import { Box, Typography, Stack } from "@mui/material";
import { db } from "../../init_firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { addCRUD, deleteCRUD } from "../crud/Crud";
import Button from "../interface/Button";
import Container from "../interface/Container";

const Stations = (props) => {
  const [newStation, setNewStation] = useState(false);
  const [stations, SetStations] = useState([]);

  const AddStation = async (name, distance, objectProcess) => {
    const modelObject = {
      name: name,
      distance: distance,
      process: objectProcess,
    };
    addCRUD(modelObject, "stations");
    setNewStation(false);
  };

  const deleteStation = async (id) => {
    deleteCRUD(id, "stations");
  };

  useEffect(() => {
    const unSuscribed = onSnapshot(collection(db, "stations"), (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      SetStations(data);
    });
    return () => {
      unSuscribed();
    };
  }, []);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Container>
          <Typography variant="h4" sx={{ margin: 1 }}>
            Estaciones:
          </Typography>

          <Button execute={(x) => setNewStation(x)}>Nueva Estacion</Button>

          <Box sx={{ padding: 1, borderColor: "black", margin: 1 }}>
            {stations.map((station) => (
              <Station
                key={station.id}
                station={station}
                deleteStation={deleteStation}
              ></Station>
            ))}
          </Box>
        </Container>

        {newStation && <NewStations AddStation={AddStation} />}
      </Stack>
    </>
  );
};

export default Stations;
