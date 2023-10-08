import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
} from "@mui/material";
import Container from "../interface/Container";
import Button from "../interface/Button";
import NewSequence from "./NewSequence";
import { addCRUD } from "../crud/Crud";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../init_firebase/firebase";

const Sequences = () => {
  const [newSequence, setNewSequence] = useState(false);
  const [sequences, setSequences] = useState([]);
  const [stations, setStations] = useState([]);
  const [sequence, setSequence] = useState("");
  const [station, setStation] = useState("");

  const AddSequence = (nameSequence) => {
    const modelObject = {
      name: nameSequence,
    };
    addCRUD(modelObject, "sequences");
    setNewSequence(false);
  };

  useEffect(() => {
    const unSuscribed = onSnapshot(collection(db, "sequences"), (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      console.log("Sequences:", data);
      setSequences(data);
    });
    return () => {
      unSuscribed();
    };
  }, []);

  useEffect(() => {
    const unSuscribedStation = onSnapshot(
      collection(db, "stations"),
      (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        console.log("Stations Available:", data);
        setStations(data);
      }
    );

    return () => {
      unSuscribedStation();
    };
  }, []);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Container>
          <Typography sx={{ margin: 1, fontSize: 26 }}>Secuencias:</Typography>
          <Button execute={(x) => setNewSequence(x)}>NUEVA SECUENCIA</Button>
          <Typography sx={{ margin: 1, fontSize: 18 }}>
            Configurar Simulacion:
          </Typography>

          <FormGroup>
            <FormControl sx={{ width: 230, margin: 1 }}>
              <InputLabel id="demo-simple-select-label">
                Simulaciones
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sequence}
                label="Sequence"
                onChange={(e) => {
                  setSequence(e.target.value);
                }}
              >
                {sequences.map((sequence) => (
                  <MenuItem key={sequence.id} value={sequence.id}>
                    {sequence.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 230, margin: 1 }}>
              <InputLabel id="demo-simple-select-label2">Estaciones</InputLabel>
              <Select
                labelId="demo-simple-select-label-2"
                id="demo-simple-select-2"
                value={station}
                label="Stations"
                onChange={(e) => setStation(e.target.value)}
              >
                {stations.map((station) => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </Container>

        {newSequence && <NewSequence AddSequence={AddSequence} />}
      </Stack>
    </>
  );
};

export default Sequences;
