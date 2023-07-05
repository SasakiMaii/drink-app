import { AddPhotoAlternate, Coffee, Create } from "@mui/icons-material";
import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import PreviewImage from "../molecules/PreviewImage";
import previewImages from "../../utils/previewImages";
import { Items, Post, Users } from "../../types/type";
import ModalWindow from "./ModalWindow";
import sendPostData from "../../utils/sendPostData";

// 全商品データ、商品情報取得時エラー、ログインユーザー情報、投稿編集データ、投稿編集のset関数
type Props = {
  // itemData: Items[];
  itemData: any;
  itemError: boolean;
  loginUser: Users;
  editPostData: Post | null;
  setEditPostData: React.Dispatch<React.SetStateAction<Post | null>>;
  reloadPost: boolean;
  setReloadPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostForm: FC<Props> = memo((props) => {
  const {
    itemData,
    itemError,
    loginUser,
    editPostData,
    setEditPostData,
    reloadPost,
    setReloadPost,
  } = props;
  // 入力した画像ファイル格納
  const [inputImages, setInputImages] = useState<File[]>([]);
  // 投稿内容のバリデーションチェック
  const [postError, setPostError] = useState<string | null>(null);
  // 投稿フォームのref
  const postForm = useRef<any>(null);
  // selectで選択した商品のitemId
  const [selectedItemId, setSelectedItemId] = useState<number>(0);

  // 投稿編集の場合、投稿の装飾を削除、画像のfirebaseUrlをFile型に変換
  useEffect(() => {
    if (!editPostData) {
      return;
    }
    postForm.current[0].value = editPostData.content;
    setSelectedItemId(editPostData.itemId);
    setInputImages(
      editPostData.postImages.map((image) => new File([], image.path))
    );
    postForm.current[0].focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPostData]);

  // TODO 投稿送信処理
  const sendPost = async () => {
    if (!postForm.current[0] || !postForm.current[2]) {
      setPostError("エラーが発生しました、再読み込みしてください。");
    }
    await sendPostData(
      postForm.current[0].value,
      postForm.current[2].value,
      inputImages,
      loginUser.id,
      setPostError,
      setEditPostData,
      editPostData
    );

    if (postError) {
      return;
    }
    
    postForm.current.reset();
    setSelectedItemId(0);
    setInputImages([]);
    setReloadPost(!reloadPost);
  };

  return (
    <>
      {/* 投稿内容のバリデーション */}
      {postError && (
        <Typography
          variant="body1"
          sx={{ backgroundColor: "pink", mt: "10px", borderRadius: "3px" }}
        >
          {postError}
        </Typography>
      )}
      <Paper
        component="form"
        id="postForm"
        elevation={3}
        sx={{ mt: 2, mb: 5 }}
        ref={postForm}
        data-testid="postForm"
      >
        <Box sx={{ position: "relative" }}>
          <InputLabel
            variant="standard"
            htmlFor="writeContent"
            sx={[
              { "&:hover": { cursor: "pointer" } },
              { display: "flex", pl: "5px" },
            ]}
          >
            <Create />
            <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>投稿</Typography>
          </InputLabel>
          <TextField
            fullWidth
            id="writeContent"
            rows={3}
            multiline
            variant="standard"
            sx={{ p: "0" }}
          />
        </Box>
        <Select
          name="selectItemCategory"
          value={selectedItemId}
          variant="standard"
          fullWidth
          onChange={(event: SelectChangeEvent<number>) => {
            let itemNum = event.target.value;
            if (typeof event.target.value === "string") {
              itemNum = parseFloat(event.target.value);
            }
            setSelectedItemId(+itemNum);
          }}
          sx={[
            {
              "&:hover": {
                outline: "none",
              },
            },
            { height: "40px", pl: "5px" },
          ]}
        >
          <MenuItem value="0">
            {/* 商品情報の取得ができたかどうか */}
            {itemError ? (
              <Box sx={{ display: "flex" }}>
                <Coffee />
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                  商品情報の取得に失敗しました、再読み込みしてください
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", color: "rgba(0,0,0,0.6)" }}>
                <Coffee />
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                  商品を選択
                </Typography>
              </Box>
            )}
          </MenuItem>
          {itemData.map((item: Items) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                {item.itemName}
              </MenuItem>
            );
          })}
        </Select>
        {/* 入力した画像ファイルがある場合、プレビューを表示 */}
        {inputImages.length > 0 && (
          <PreviewImage
            inputImages={inputImages}
            setInputImages={setInputImages}
            inputLength={inputImages.length}
            width={"160px"}
            height={"160px"}
          />
        )}
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <InputLabel
              variant="standard"
              htmlFor="addImage"
              sx={[
                { "&:hover": { cursor: "pointer" } },
                { display: "flex", pl: "5px" },
              ]}
            >
              <AddPhotoAlternate />
              <Typography variant="body1">画像を追加</Typography>
            </InputLabel>
            <TextField
              id="addImage"
              type="file"
              inputProps={{ accept: "image/*" }}
              sx={{ p: "0", display: "none" }}
              size="small"
              onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                if (!(event.target instanceof HTMLInputElement)) {
                  return;
                }
                event.target.value = "";
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                previewImages(event, inputImages, setInputImages);
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <Stack direction="row" justifyContent="end" sx={{ mx: 1 }}>
              <ModalWindow
                title="投稿してもよろしいですか？"
                content=""
                openButtonColor="blue"
                openButtonSxStyle={{ my: "3px" }}
                completeButtonColor="blue"
                completeButtonName="確定"
                completeAction={sendPost}
                cancelButtonColor="gray"
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
});

export default PostForm;
