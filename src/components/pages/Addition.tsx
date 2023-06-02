import { Box, CircularProgress, Paper, Alert, AlertTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { FC, memo, useEffect, useState } from "react";

// import { useGetOfficeItems1 } from '../../hooks/useGetOfficeItems1';
import AdmTitleText from "../atoms/text/AdmTitleText";
import axios from "axios";
import { StockHistory } from "../../types/type";
import useGetItems from "../../hooks/useGetItems";
import ModalWindow from "../organisms/ModalWindow";
import StockCard from "../organisms/card/StockCard";
import useGetOfficeItems from "../../hooks/useGetOfficeItems";

type Props = {};

const Consumption: FC<Props> = memo((props) => {
  const navigate = useNavigate();
  // const { itemData, loading, error } = useGetOfficeItems1();
  const { itemData, itemLoading, itemError } = useGetItems("?intheOffice=true");
  const [inputValueArr, setInputValueArr] = useState<number[]>([]);
  useEffect(() => {
    const firstInputValueArr: number[] = [...Array(itemData.length)].map(
      () => 0
    );
    setInputValueArr(firstInputValueArr);
  }, [itemData]);
  console.log(itemData, 109);

  //オフィスに存在する商品のidのみが格納された配列
  const [inTheOfficeItemIdArr, setInTheOfficeItemIdArr] = useState<
    Array<number>
  >([]);

  useEffect(() => {
    setInTheOfficeItemIdArr(itemData.map((item: any) => item.id));
  }, [itemData]);

  //オフィスに存在する商品情報が格納された配列 （現在在庫があるもののみ）
  const [inTheOfficeItemArr, setInTheOfficeItemArr] = useState<
    Array<StockHistory>
  >([]);
  console.log(inTheOfficeItemArr, 187);

  useEffect(() => {
    getStockAmount();
  }, [inTheOfficeItemIdArr]);

  //現在の在庫量を取得
  const getStockAmount = async () => {
    const promises = inTheOfficeItemIdArr.map((test) => {
      return axios
        .get(
          `http://localhost:8880/stockhistory?&itemId=${test}&_sort=id&_order=desc&_limit=1`
        )
        .then((res) => {
          return res.data[0];
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    });
    const newArr = await Promise.all(promises);
    setInTheOfficeItemArr(newArr);
  };

  const testArr = [{ test: "テスト" }, { test1: "テスト1" }];
  const submitTestArr = async () => {
    try {
      for (const item of testArr) {
        await axios.post("http://localhost:8880/stockhistory", item);
      }
      console.log("Data submitted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  //送信ボタン押下後の処理
  // const onClickSubmit = async () => {
  //   const now = new Date();
  //   const dateString = now.toISOString();
  //   console.log('送信しました。');
  //   let i = 0;
  //   try {
  //     for (const item of itemData) {
  //       await axios.post('http://localhost:8880/stockhistory', {
  //         itemId: item.id,
  //         quantity: inputValueArr[i],
  //         day: dateString,
  //         incOrDec: true,
  //         stockAmount: inTheOfficeItemArr[i].stockAmount + inputValueArr[i],
  //       });
  //       i++;
  //     }
  //     console.log('Data submitted successfully');
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   // 処理が全て完了した後に/adminhomeへ遷移
  //   navigate('/adminhome');
  // };

  console.log(inputValueArr, 199);

  const onClickSubmit = async () => {
    const now = new Date();
    const dateString = now.toISOString();
    console.log("送信しました。");

    try {
      await Promise.all(
        itemData.map(async (item, index) => {
          console.log("index", index);
          let newStockAmount;
          if (inTheOfficeItemArr[index]) {
            newStockAmount =
              inTheOfficeItemArr[index].stockAmount + inputValueArr[index];
          } else {
            newStockAmount = inputValueArr[index];
          }
          await axios.post("http://localhost:8880/stockhistory", {
            itemId: item.id,
            quantity: inputValueArr[index],
            day: dateString,
            incOrDec: true,
            stockAmount: newStockAmount,
          });
        })
      );
      // 処理が全て完了した後に/adminhomeへ遷移
      navigate("/adminhome");
      // await restartJsonServer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper
      sx={{
        mb: 5,
        width: "100%",
        minWidth: 500,
        maxWidth: 1200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "30px",
      }}
    >
      <Box id="top" />
      <Box sx={{ width: "60%", p: "30px" }}>
        <AdmTitleText>補充在庫入力</AdmTitleText>
      </Box>
      {itemError ? (
        <Alert severity="error" sx={{ marginTop: "30px", fontSize: "20px" }}>
          <AlertTitle>Error</AlertTitle>
          データが見つかりませんでした。
        </Alert>
      ) : itemLoading ? (
        <CircularProgress sx={{ marginTop: "30px", marginBottom: "40px" }} />
      ) : (
        <StockCard
          itemData={itemData}
          inTheOfficeItemArr={inTheOfficeItemArr}
          inputValueArr={inputValueArr}
          setInputValueArr={setInputValueArr}
        />
      )}
      <div style={{ display: "inline-flex" }}></div>
      <ModalWindow
        title="送信します、よろしいですか？"
        content={""}
        openButtonColor="blue"
        buttonName="送信"
        completeButtonColor={"blue"}
        completeButtonName={`はい`}
        completeAction={onClickSubmit}
        cancelButtonColor={"red"}
        openButtonSxStyle={{
          px: 10,
          py: 4,
          borderRadius: "32px",
          marginTop: "32px",
        }}
      />
    </Paper>
  );
});

export default Consumption;
