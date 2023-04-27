import { FC, memo, useState, Dispatch, SetStateAction } from "react";
import { PrimaryInput, SecondaryInput } from "../atoms/input/Input";
import {
  Button,
  CardMedia,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PreviewImage from "../molecules/PreviewImage";

type Props = {
  setItemName: Dispatch<SetStateAction<string>>;
  setItemDescription: Dispatch<SetStateAction<string>>;
  setItemCategory: Dispatch<SetStateAction<number>>;
  setItemImages: Dispatch<SetStateAction<File[]>>;
  // setImagesPathsArr: Dispatch<SetStateAction<string[]>>;
};

const ItemForm: FC<Props> = memo((props) => {
  // 状態管理
  const [formItemName, setItemName] = useState<string>("");
  const [formItemDescription, setItemDescription] = useState<string>("");
  const [formItemCategory, setItemCategory] = useState<number>(0);
  const [formItemImages, setItemImages] = useState<File[]>([]);
  // const [imagesPathsArr, setImagesPathsArr] = useState<string[]>([]);

  // propsの受け渡しの処理
  props.setItemName(formItemName);
  props.setItemDescription(formItemDescription);
  props.setItemCategory(formItemCategory);
  props.setItemImages(formItemImages);
  // props.setImagesPathsArr(imagesPathsArr)

  // 画像プレビュー機能
  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 入力した画像に重複がないか判別
    const preventSameImage = formItemImages.some(
      (image: File) => image.name === event.target.files![0].name
    );
    // 重複があった場合は処理を終了
    if (preventSameImage) {
      return;
    }

    // 画像ファイルが3つ以上の場合、古い画像を削除して新しい3つを追加
    if (formItemImages.length >= 3) {
      setItemImages((inputImages: File[]) => {
        const limitedImages = [...inputImages, event.target.files![0]];
        limitedImages.shift();
        return limitedImages;
      });
    }
    // 画像ファイルが３つ未満の場合、通常の画像追加
    else {
      setItemImages((inputImages: File[]) => [
        ...inputImages,
        event.target.files![0],
      ]);
    }
  };

  return (
    <>
      <SecondaryInput
        id="itemName"
        label="商品名"
        defaultValue={formItemName}
        required
        onChange={(e: any) => setItemName(e.target.value)}
        sx={{ width: 400, mb: 5 }}
        inputProps={{ maxLength: 20 }}
      />

      <Typography variant="body1" component="p" sx={{ mb: 1 }}>
        商品画像
      </Typography>

      <Box sx={{ mb: 5, width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        {formItemImages.length > 0 && (
          <PreviewImage
            inputImages={formItemImages}
            setInputImages={setItemImages}
            inputLength={formItemImages.length}
            width={"100%"}
            height={"150px"}
          />
        )}
        {formItemImages.length < 3 && (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <button style={{ background: "none", border: "none" }}>
              <label htmlFor="itemImageFeild">
                <Typography variant="body2" component="p">
                  追加
                </Typography>
                <AddCircleOutlineIcon sx={{ fontSize: 30, mb: 5 }} />
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="itemImageFeild"
                onChange={previewImage}
              />
            </button>
          </Box>
        )}
      </Box>

      <PrimaryInput
        multiline
        aria-label="itemDescription"
        label="商品説明"
        sx={{ width: "100%", mb: 5 }}
        inputProps={{ maxLength: 200 }}
        defaultValue={formItemDescription}
        required
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setItemDescription(e.target.value)
        }
        rows={5}
      />

      <InputLabel id="itemCategoryField" required>
        商品カテゴリー
      </InputLabel>
      <Select
        labelId="itemCategoryField"
        id="itemCategoryField"
        value={formItemCategory}
        label="商品カテゴリー"
        placeholder="商品カテゴリーを選択して下さい"
        onChange={(e) => {
          setItemCategory(Number(e.target.value));
        }}
        sx={{ mb: 5 }}
      >
        <MenuItem value={0}>商品カテゴリーを選択して下さい</MenuItem>
        <MenuItem value={1}>コーヒー/ダーク(深煎り)</MenuItem>
        <MenuItem value={2}>コーヒー/ダーク(中煎り)</MenuItem>
        <MenuItem value={3}>コーヒー/ライト(浅煎り)</MenuItem>
        <MenuItem value={4}>コーヒー/カフェインレス</MenuItem>
        <MenuItem value={5}>ティー</MenuItem>
        <MenuItem value={6}>ココア</MenuItem>
        <MenuItem value={6}>その他</MenuItem>
      </Select>
    </>
  );
});

export default ItemForm;
