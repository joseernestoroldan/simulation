import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Chip,
  Box,
  OutlinedInput,
  Button,
} from "@mui/material";
import Container from "../interface/Container";
import NewSequence from "./NewSequence";
import { addCRUD } from "../crud/Crud";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../init_firebase/firebase";
import ButtonInt from "../interface/Button";
import { MenuProps } from "./constants";

const Sequences = () => {
  const [newSequence, setNewSequence] = useState(false); //toggle
  const [sequences, setSequences] = useState([]); //almacena las secuencias existentes en la base de datos
  const [stations, setStations] = useState([]);   //almacena las estaciones existentes en la base de datos
  const [sequence, setSequence] = useState("");
  const [stationArray, setStationArray] = useState([]); //almacena las estaciones seleccionadas para una nueva simulacion
  const [simulation, setSimulation] = useState([]); //almacena la simulacion

  const AddSequence = (nameSequence) => {
    const modelObject = {
      name: nameSequence,
    };
    addCRUD(modelObject, "sequences");
    setNewSequence(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setStationArray(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const arreglo = [];
    stationArray.map((item) => {
      stations.map((item_station) => {
        if (item === item_station.name) {
          arreglo.push(item_station);
        }
        return null
      });
      return null
    });
    console.log("este es mi arreglo:", arreglo);
    setSimulation(arreglo)
  };

  useEffect(() => {//consulta de secuencias disponibles
    const unSuscribed = onSnapshot(collection(db, "sequences"), (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
    
      setSequences(data);
    });
    return () => {
      unSuscribed();
    };
  }, []);

  useEffect(() => {//consulta de estaciones disponibles
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
          <ButtonInt execute={(x) => setNewSequence(x)}>
            NUEVA SECUENCIA
          </ButtonInt>
          <Typography sx={{ margin: 1, fontSize: 18 }}>
            Configurar Simulacion:
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormControl sx={{ width: 230, margin: 1 }}>
                <InputLabel>Secuencias</InputLabel>
                <Select
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
              {/* ---------------------------------------------------------------------------- */}
              <FormControl sx={{ m: 1, width: 230 }}>
                <InputLabel>
                  Estaciones
                </InputLabel>
                <Select
                  multiple
                  value={stationArray}
                  onChange={handleChange}
                  input={
                    <OutlinedInput/>
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {stations.map((station) => (
                    <MenuItem key={station.id} value={station.name}>
                      {station.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button type="submit">Send</Button>
            </FormGroup>
          </form>
        </Container>

        {newSequence && <NewSequence AddSequence={AddSequence} />}
      </Stack>
    </>
  );
};

export default Sequences;
