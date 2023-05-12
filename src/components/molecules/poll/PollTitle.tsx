import { Box } from "@mui/material";
import React from "react";
import { Questionnaire } from "../../../types/type";

type PollTitleProps = {
  poll: Questionnaire[];
};

const PollTitle = ({ poll }: PollTitleProps) => {
  return (
    <>
      <Box
        sx={{
          pt:1,
          borderTop:"double #81671C",
          borderBottom:"double #81671C",
          pb:1,
          backgroundImage: "url(/coffee2.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: 120,
          opacity: 0.8,
          mb: 5,
          mt: 4,
          backgroundPosition: "left center",
          // fontWeight: "bold",
        }}
      >
        <Box
          sx={{
            fontSize: "47px",
            textAlign: "center",
            mt: 1,
            // backgroundColor: "white",
            py: 1,
            fontWeight:"bold",
            color:"#6B3906",
            letterSpacing:5,
            // background:
              // "-webkit-repeating-linear-gradient(-45deg, #fff, #d2691e 2px, #fff 2px, #fff 4px)",
          }}
        >
         {poll[0]?.name}
        </Box>
        <Box
          sx={{
            fontSize: "20px",
            textAlign: "center",
            mt: 1,
            // backgroundColor: "white",
            fontWeight: "bold",
            letterSpacing:3,
            py: 1,
          }}
        >
          開催期間:&emsp; {poll[0]?.startDate.toLocaleDateString()}&emsp;〜&emsp;
          {poll[0]?.endDate.toLocaleDateString()}
        </Box>
      </Box>
    </>
  );
};

export default PollTitle;
