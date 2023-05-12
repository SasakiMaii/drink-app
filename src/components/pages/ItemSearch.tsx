import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FC, memo } from "react";
import ItemCard from "../organisms/card/ItemCard";
import { MenuItem, Select, Typography } from "@mui/material";
import type { Items, Polls, Questionnaire } from "../../types/type";
import Paginate from "../atoms/paginate/Paginate";
import Box from "@mui/material/Box";
import { ActiveDarkBlueButton } from "../atoms/button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import Cookies from "js-cookie";
import { useLoginUserFetch } from "../../hooks/useLoginUserFetch";

type Props = {};

const ItemSearch: FC<Props> = memo((props) => {

  const authId = Cookies.get("authId")!;
  const loginUser = useLoginUserFetch({ authId: authId });
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [selectedItem, setSelectedItem] = useState<Items[]>();
  const [allItem, setAllItem] = useState<Items[]>();
  const [selectedValue, setSelectedValue] = useState("name");
  const [categoryName, setCategoryName] = useState<string>();
  console.log(selectedValue);

  const handlePullDown = async (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", encodeURIComponent(value));
    // プルダウンでの選択時に1ページ目に戻る　パラメーター　page=1にする
    searchParams.set("page", "1"); 
    navigate(`${location.pathname}?${searchParams}`);
  

    try {
      const params = {
        itemCategory: category === "all" ? undefined : category,
        name_like: keyword,
      };
      let apiUrl = `http://localhost:8880/items?&otherItem=false&_limit=${perPage}`;
      
      //  名前順
      if (value === "name") {
        apiUrl += `&_sort=name&_order=asc`;
      } else if (value === "intheOffice") {
        // 社内あり
        apiUrl += `&intheOffice=true`;
      } else if (value === "intheOfficeNone") {
        // 社内なし
        apiUrl += `&intheOffice=false`;
      } else {
        apiUrl += `&_sort=${value}&_order=asc`;
      }
      const query = queryString.stringify(params, { skipNull: true });
      const response = await fetch(`${apiUrl}&${query}`);
      const data = await response.json();
      setSelectedItem(data);
      if (apiUrl === "&intheOffice=false" || "&intheOffice=true") {
        setAllItem(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const keyword = queryParams.get("keyword");

  const perPage = 6;
  let currentPage = 1;
  console.log(selectedItem, "item");
  console.log(allItem, "allitem");

  // カテゴリタブを押したときの初期データ
  useEffect(() => {
    const categoryFilterData = async () => {
      try {
        let url = `http://localhost:8880/items?&otherItem=false&_sort=name&_page=${currentPage}&_limit=${perPage}`;
        if (category !== "all") {
          url += `&itemCategory=${category}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (category === "all") {
          setSelectedItem(data.filter((item: any) => !item.otherItem));
        } else {
          const filteredData = data.filter(
            (item: any) => item.itemCategory === Number(category)
          );
          setSelectedItem(filteredData.filter((item: any) => !item.otherItem));
        }
        if (location.search.includes("keyword")) {
          const keyword = new URLSearchParams(location.search).get("keyword");
          let url = `http://localhost:8880/items?&otherItem=false&_page=${currentPage}&_limit=${perPage}&name_like=${keyword}`;
          const response = await fetch(url);
          const data = await response.json();
          setSelectedItem(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    categoryFilterData();
  }, [category, setSelectedItem, keyword]);
  console.log("select", selectedItem);
  // ページング
  const handlePageChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newValue);

    try {
      const params: any = {
        itemCategory: category === "all" ? undefined : category,
        name_like: keyword,
      };
      if (selectedValue === "intheOffice") {
        params.intheOffice = true;
      } else if (selectedValue === "intheOfficeNone") {
        params.intheOffice = false;
      }
      const query = queryString.stringify(params, { skipNull: true });

      const sortValue = selectedValue === "name" ? "name" : "popular";
      const url = `http://localhost:8880/items?&otherItem=false&_sort=${sortValue}&_order=asc&_page=${newValue}&_limit=6&${query}`;

      navigate(`/home/search?${queryParams.toString()}`);

      const res = await fetch(url);
      const data = await res.json();
      setSelectedItem(data);
    } catch (error) {
      console.error(error);
    }
  };
  // カテゴリごとの全件数の取得 //
  // パラメータにcategoryとkeywordの指定があったらフィルタリングして件数を割り出す
  useEffect(() => { 
    const categoryData = async () => {
      try {
        let url = `http://localhost:8880/items?&otherItem=false`;
        
        if (selectedValue === "intheOffice") {
          url += "&intheOffice=true"; // Append intheOffice parameter
        }else if(selectedValue === "intheOfficeNone") {
          url += "&intheOffice=false"; // Append intheOffice parameter
        }
  
        const params = {
          itemCategory: category === "all" ? undefined : category,
          name_like: keyword,
        };
        const query = queryString.stringify(params, { skipNull: true });
        url += `&${query}`;
  
        const res = await fetch(url);
        const data = await res.json();
        setAllItem(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    categoryData();
  }, [category, keyword, selectedValue]);
 

  // Todo カテゴリ検索リファクタリングする
  useEffect(() => {
    if (category === "all") {
      setCategoryName("すべて");
      setSelectedValue("name");
    } else if (category === "1") {
      setCategoryName("ダーク（深煎り）");
      setSelectedValue("name");
    } else if (category === "2") {
      setCategoryName("ミディアム（中煎り）");
      setSelectedValue("name");
    } else if (category === "3") {
      setCategoryName("ライト（浅煎り）");
      setSelectedValue("name");
    } else if (category === "4") {
      setCategoryName("カフェインレス");
      setSelectedValue("name");
    } else if (category === "5") {
      setCategoryName("ティー");
      setSelectedValue("name");
    } else if (category === "6") {
      setCategoryName("ココア");
      setSelectedValue("name");
    } else if (category === "7") {
      setCategoryName("その他");
      setSelectedValue("name");
    }
  }, [category, setSelectedValue]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {category ? (
            <Typography variant="h6" sx={{ mb: 2 }}>
              「{categoryName}」の検索結果一覧
            </Typography>
          ) : (
            ""
          )}
          {keyword ? (
            <Typography variant="h6">{keyword}の検索結果一覧</Typography>
          ) : (
            ""
          )}
          <Typography sx={{ mx: "16px" }}>
            検索結果：{allItem?.length}件
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Select
            size="small"
            value={selectedValue}
            sx={{ border: "none", backgroundColor: "white", mr: "16px" }}
            onChange={handlePullDown}
          >
            <MenuItem value="選択する" disabled>
              {/* <Box sx={{ display: "flex" }}>
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                  選択する
                </Typography>
              </Box> */}
            </MenuItem>
            {/* <MenuItem value="popular">人気順</MenuItem> */}
            <MenuItem value="name">名前順</MenuItem>
            <MenuItem value="intheOffice">社内あり</MenuItem>
            <MenuItem value="intheOfficeNone">社内なし</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box sx={{ mx: "16px" }}></Box>
      {selectedItem ? (
        <>
          {selectedItem && <ItemCard data={selectedItem} />}

          {selectedItem?.length > 0 && (
            <Paginate
              // ページング数
              count={allItem && Math.ceil(allItem?.length / perPage)}
              onChange={handlePageChange}
              // 現在のページ
              page={Number(searchParams.get("page"))}
            />
          )}
        </>
      ) : (
        "該当する商品がありません"
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {loginUser?.isAdmin ? (
          <Link to="/adminhome/additem">
            <ActiveDarkBlueButton event={function (): void {}}>
              商品追加
            </ActiveDarkBlueButton>
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
});

export default ItemSearch;
