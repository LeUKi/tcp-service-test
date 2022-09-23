import React from "react";
import Header from "../components/Header";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useHistory } from "react-router-dom";

const About = () => {
  const history = useHistory();
  const [id, setId] = React.useState("");
  return (
    <React.Fragment>
      <Header title="Test." />
      <main>
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
          
              <TextField
                id="outlined-basic"
                label="Id"
                variant="outlined"
                size="small"
                onChange={(e) => setId(e.target.value)}
              />
           
            <span className="ml-1">
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={() => {
                  history.push("/opendoor?" + id);
                }}
                disabled={id === ""}
              >
                open door
              </Button>
            </span>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default About;
