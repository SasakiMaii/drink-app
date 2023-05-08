import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Items } from "../../types/type";
import { useNavigate } from "react-router-dom";
import { ActiveDarkBlueButton, InactiveButton } from "../atoms/button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

type ItemCardProps = {
  data: Items[];
  sxStyle?: any;
};

const ItemCard = ({ data, sxStyle }: ItemCardProps) => {
  // const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleClick = async (id: number) => {
    if (!selectedItems.includes(id)) {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          flex: "end",
          mt: 5,
        }}
      >
        {data &&
          data.map((drink: Items, index) => {
            return (
              <Card
                sx={{
                  width: 270,
                  m: 2,
                  boxShadow: "none",
                  border: "solid 1px ",
                  borderColor: "#bfbec5",
                  ...sxStyle,
                }}
                key={index}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  sx={{
                    textAlign: "center",
                    fontSize: "13px",
                    backgroundColor: "#d6c6af",
                    width: 80,
                    p: "3px",
                    color: "#000",
                    borderRadius: "3px",
                  }}
                >
                  {(() => {
                    if (
                      Number(drink.itemCategory) >= 1 &&
                      Number(drink.itemCategory) <= 4
                    ) {
                      return "コーヒー";
                    } else if (drink.itemCategory === 5) {
                      return "ティー";
                    } else if (drink.itemCategory === 6) {
                      return "ココア";
                    } else {
                      return "その他";
                    }
                  })()}
                </Typography>

                <CardMedia
                  component="img"
                  alt="商品画像"
                  height="140"
                  width="140"
                  image={drink.image[0]}
                  title="商品名"
                  sx={{
                    display: "block",
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    m: "auto",
                  }}
                />
                <CardContent sx={{ height: "150px" }}>
                  {drink.intheOffice ? (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      sx={{
                        textAlign: "center",
                        fontSize: "13px",
                        backgroundColor: "#e0ebaf",
                        width: 80,
                        p: "3px",
                        color: "#000",
                        borderRadius: "3px",
                      }}
                    >
                      社内あり
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      sx={{
                        textAlign: "center",
                        fontSize: "13px",
                        backgroundColor: "#a4c1d7",
                        width: 80,
                        p: "3px",
                        color: "#000",
                        borderRadius: "3px",
                      }}
                    >
                      社内なし
                    </Typography>
                  )}
                  <Typography
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      fontSize: "16px",
                      borderBottom: "double",
                      fontFamily: "Georgia",
                      fontWeight: "bold",
                      height: "200",
                    }}
                  >
                    {drink.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    sx={{ textAlign: "center", fontSize: "13px" }}
                  >
                    {drink.description}
                  </Typography>
                </CardContent>
                {selectedItems.includes(drink.id) ? (
                  <InactiveButton
                    sx={{
                      background: "#e29399",
                      width: 200,
                      mb: 2,
                      boxShadow: "none",
                      border: "double",
                      fontWeight: "bold",
                      ml: 4,
                      ":hover": {
                        background: "#e29399",
                        cursor: "pointer",
                      },
                    }}
                  >
                    &nbsp;投票に追加しました
                  </InactiveButton>
                ) : (
                  <ActiveDarkBlueButton
                    sxStyle={{
                      mb: 1,
                      width: 200,
                      boxShadow: "none",
                      fontWeight: "bold",
                      ml: 4,
                      border: "double",
                    }}
                    event={() => {
                      handleClick(drink.id);
                    }}
                  >
                    <AddCircleOutlineIcon /> &nbsp;追加
                  </ActiveDarkBlueButton>
                )}
              </Card>
            );
          })}
      </Box>
    </>
  );
};

export default ItemCard;
