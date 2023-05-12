import {
  Box,
  Card,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { Items, StockHistory } from "../../types/type";
import { ActiveDarkBlueButton, ActiveRedButton } from "../atoms/button/Button";
import { SecondaryInput } from "../atoms/input/Input";
import Paginate from "../atoms/paginate/Paginate";
import AdmTitleText from "../atoms/text/AdmTitleText";

type Props = {
  itemId: number;
  day: string;
  id?: number;
  incOrDecTrue: number;
  incOrDecFalse: number;
  name: string;
  stockAmount: number;
};

type StockHistoryWithName = StockHistory & {
  name: string;
};

const History: FC = memo(() => {
  const [itemDatas, setItemDatas] = useState<Items[]>([]);
  const [originalItemName, setOriginalItemName] = useState<Props[]>([]);
  const [filterItemName, setFilterItemName] = useState<Props[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectItem, setSelectItem] = useState<string>("");
  const [itemsOffset, setItemsOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchErrorMsg, setSearchErrorMsg] = useState<string>("");

  useEffect(() => {
    const historyDataFetch = async () => {
      const historyResponse = await fetch("http://localhost:8880/stockhistory");
      const historyData = await historyResponse.json();

      const itemResponse = await fetch("http://localhost:8880/items");
      const itemData = await itemResponse.json();
      setItemDatas(itemData);

      //商品名入りのオブジェクト作成
      const itemObj = historyData.map((history: { itemId: number }) => {
        const items = itemData.find(
          (item: { id: number }) => item.id === history.itemId
        );
        return items ? { ...history, name: items.name } : history;
      });

      //消費データと補充データを合わせる（itemIdとdayの一致）
      const mergeObj: Props[] = Object.values(
        itemObj.reduce(
          (acc: { [key: string]: Props }, obj: StockHistoryWithName) => {
            const key = obj.itemId + "-" + obj.day.split("T")[0];
            if (!acc[key]) {
              acc[key] = {
                itemId: obj.itemId,
                day: obj.day,
                name: obj.name,
                incOrDecTrue: obj.incOrDec === true ? obj.quantity : 0, //補充数
                incOrDecFalse: obj.incOrDec === false ? obj.quantity : 0, //消費数
                stockAmount: obj.stockAmount,
              };
            } else {
              //incOrDecのリネーム
              if (obj.incOrDec === true) {
                acc[key].incOrDecTrue += obj.quantity;
              } else {
                acc[key].incOrDecFalse += obj.quantity;
              }
              //最新日付（時間）を比較するため
              const currentDateTime = new Date(obj.day).getTime();
              const existingDateTime = new Date(acc[key].day).getTime();
              if (currentDateTime > existingDateTime) {
                // 日付が最新の場合のみ更新する
                acc[key].day = obj.day;
                acc[key].stockAmount = obj.stockAmount;
              }
            }
            return acc;
          },
          {}
        )
      );

      //日付文字列を置き換え
      const dateMergeObj = mergeObj.map((item: Props) => {
        const dateOnly = item.day?.split("T")[0];
        // const transformedDate = dateOnly.replace(/-/g, "/");
        return {
          ...item,
          day: dateOnly,
        };
      });

      // 日付最新順に並び替える
      dateMergeObj.sort((a: Props, b: Props) => {
        return new Date(b.day).getTime() - new Date(a.day).getTime();
      });

      setOriginalItemName(dateMergeObj as Props[]); //初期履歴データ
      setFilterItemName(dateMergeObj as Props[]); //検索用履歴データ
    };
    historyDataFetch();
  }, []);

  const searchHistory = () => {
    if (
      (startDate === "" && endDate !== "") ||
      (startDate !== "" && endDate === "")
    ) {
      setSearchErrorMsg("期間は全て選択してください");
    } else {
      setSearchErrorMsg("");
    }

    //日付・商品検索
    let matchResult = originalItemName;
    if (selectItem) {
      matchResult = matchResult.filter((item) => item.name === selectItem);
    }
    if (startDate && endDate) {
      matchResult = matchResult.filter(
        (item) => item.day >= startDate && item.day <= endDate
      );
    }
    setFilterItemName(matchResult);
    console.log(matchResult, 912);
  };
  console.log(filterItemName, 91);

  const searchReset = () => {
    setSelectItem("");
    setStartDate("");
    setEndDate("");
    setSearchErrorMsg("");
    setFilterItemName(originalItemName);
  };

  //ページネーション
  const itemsPerPage = 10; // 1ページに表示するオブジェクトの数
  const endOffset = itemsOffset + itemsPerPage;
  const currentItems = filterItemName.slice(itemsOffset, endOffset);
  const pageCount = Math.ceil(filterItemName.length / itemsPerPage); //繰り上げ

  const handlePageClick = (e: ChangeEvent, page: number) => {
    setCurrentPage(page);
    const newOffset = ((page - 1) * itemsPerPage) % filterItemName.length;
    setItemsOffset(newOffset);
  };

  const dateConfirm = () => {
    if (endDate === "") {
      setEndDate(startDate);
    }
  };

  return (
    <>
      <Box>
        <Card>
          <Box sx={{ m: "30px" }}>
            <AdmTitleText children="在庫履歴確認" />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <label
                style={{ marginRight: "20px", width: "50px" }}
                htmlFor="period"
              >
                期間
              </label>
              <SecondaryInput
                type="date"
                style={{ marginRight: "5px" }}
                id="period"
                value={startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
                onBlur={dateConfirm}
              />
              <span
                style={{
                  fontSize: "1.5rem",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                〜
              </span>
              <SecondaryInput
                type="date"
                style={{ marginLeft: "5px" }}
                value={endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
                }
              />
            </Box>
            <p style={{ fontSize: "14px", color: "red" }}>{searchErrorMsg}</p>
            <Box sx={{ mt: "40px" }}>
              <Stack
                direction="row"
                sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
                spacing={2}
              >
                <Box>
                  <label style={{ marginRight: "20px" }} htmlFor="itemName">
                    商品名
                  </label>
                  <Select
                    defaultValue="商品を選択"
                    value={selectItem}
                    onChange={(e: SelectChangeEvent<string>) =>
                      setSelectItem(e.target.value)
                    }
                    sx={[
                      {
                        "&:hover": {
                          outline: "none",
                        },
                      },
                      { width: "200px" },
                    ]}
                  >
                    <MenuItem value="商品を選択" disabled>
                      <Box sx={{ display: "flex" }}>
                        <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                          商品を選択
                        </Typography>
                      </Box>
                    </MenuItem>
                    {itemDatas.map((item: Items) => {
                      return (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Stack
                  direction="row"
                  sx={{ alignItems: "flex-end" }}
                  spacing={2}
                >
                  <Box>
                    <ActiveDarkBlueButton
                      children="履歴検索"
                      event={searchHistory}
                    />
                  </Box>
                  <Box>
                    <ActiveRedButton
                      children="検索リセット"
                      event={searchReset}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Card>
        <TableContainer component={Paper} sx={{ mt: "50px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#C0C0C0", fontWeight: "bold" }}>
                <TableCell sx={{ width: "250px" }}>商品名</TableCell>
                <TableCell align="right" sx={{ width: "120px" }}>
                  登録日
                </TableCell>
                <TableCell align="right" sx={{ width: "120px" }}>
                  消費数
                </TableCell>
                <TableCell align="right" sx={{ width: "120px" }}>
                  補充数
                </TableCell>
                <TableCell align="right" sx={{ width: "120px" }}>
                  在庫合計
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((history: Props) => {
                return (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={history.id}
                  >
                    <TableCell component="th" scope="row">
                      {history.name}
                    </TableCell>

                    <TableCell align="right">
                      {history.day
                        .replace(/(^|[^0-9])0+/g, "$1")
                        .replace(/-/g, "/")}
                    </TableCell>
                    <TableCell align="right">{history.incOrDecFalse}</TableCell>
                    <TableCell align="right">{history.incOrDecTrue}</TableCell>
                    <TableCell align="right">{history.stockAmount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {filterItemName.length === 0 &&
              (startDate || endDate || selectItem) && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <p style={{ marginLeft: "20px" }}>検索結果がありません</p>
                  </TableCell>
                </TableRow>
              )}
          </Table>
        </TableContainer>
        <Paginate
          count={pageCount}
          page={currentPage}
          onChange={handlePageClick}
        />
      </Box>
    </>
  );
});

export default History;
