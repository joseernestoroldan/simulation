import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Container from "../interface/Container";
import Button from "../interface/Button";
import NewSequence from "./NewSequence";
import { addCRUD } from "../crud/Crud";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../init_firebase/firebase";

const Sequences = () => {
  const [newSequence, setNewSequence] = useState(false);
  const [sequences, SetSequences] = useState([]);

  const AddSequence = (nameSequence, objectStation) => {
    const modelObject = {
      name: nameSequence,
      station: objectStation,
    };
    addCRUD(modelObject, "sequences");
    setNewSequence(false);
  };

  const handleChange = (e) => {
    e.preventDefault()
    

  }

  useEffect(() => {
    const unSuscribed = onSnapshot(collection(db, "sequences"), (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      console.log("Sequences:", data);
      SetSequences(data);
    });
    return () => {
      unSuscribed();
    };
  }, []);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Container>
          <Typography sx={{ margin: 1, fontSize: 26 }}>Secuencias:</Typography>
          <Button execute={(x) => setNewSequence(x)}>NUEVA SECUENCIA</Button>
          <Typography sx={{ margin: 1, fontSize: 22 }}>Simulacion:</Typography>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Simulaciones</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={""}
              label="Age"

               onChange={handleChange}
            >
              {sequences.map((sequence) => (
                <MenuItem key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Container>
        {newSequence && <NewSequence AddSequence={AddSequence} />}
      </Stack>
    </>
  );
};

export default Sequences;
