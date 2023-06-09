import { FC, memo, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { Post } from "../../types/type";
import { Link } from "react-router-dom";
import { Like } from "../../types/type";

type Props = {
  itemId: number;
};

const TimelineCorner: FC<Props> = memo((props) => {
  const [postData, setPostData] = useState<Post[]>([]);
  const [displayPostId, setDisplayPostId] = useState<number>(0);
  const [displayPostData, setDisplayPostData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 該当する投稿を取得
  useEffect(() => {
    const fetchData: () => Promise<void> = async () => {
      try {
        const res = await fetch(
          `http://localhost:8880/posts?itemId=${props.itemId}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        if (data.length > 0) {
          setPostData(data);
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [props.itemId]);

  // 関連する投稿のそれぞれのいいね数を取得
  useEffect(() => {
    const fetchLikes: () => Promise<void> = async () => {
      const allLikes: any[] = await Promise.all(
        postData.map(async (post) => {
          try {
            const res = await fetch(
              `http://localhost:8880/likes?postId=${post.id}`,
              {
                method: "GET",
              }
            );
            const data = await res.json();
            return data;
          } catch (error) {
            console.error("Error:", error);
          }
        })
      );
      const maxLikesLengthArray: Like[] = allLikes.reduce((acc, cur) => {
        return acc.length > cur.length ? acc : cur;
      }, []);
      if(maxLikesLengthArray.length === 0) {
        const postLastData = postData[postData.length - 1]
        setDisplayPostId(postLastData.id)
        return;
      }

      const newDisplayPostId: number = maxLikesLengthArray[0].postId;
      if (newDisplayPostId !== displayPostId) {
        setDisplayPostId(newDisplayPostId);
      }
      
    };
    if (postData.length > 0) {
      fetchLikes();
    }
  }, [postData, displayPostId]);

  // 表示させる投稿データ取得
  useEffect(() => {
    const fetchDisplayPost: () => Promise<void> = async () => {
      if (displayPostId === 0) {
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:8880/posts/${displayPostId}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        setDisplayPostData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchDisplayPost();
  }, [displayPostId]);

  return (
    <>
      <Card
        sx={{
          p: 1,
          backgroundColor: "#f3bf88",
          border: "2px dashed #fff ",
          boxShadow: " 0 0 0 8px #f3bf88",
          maxWidth: {lg: 500},
          minWidth: 100,
          display: {sm: "flex", md: "flex", lg:"flex"},
        }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : postData.length > 0 && displayPostData ? (
          <>
            <Box sx={{ display: "flex" }}>
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  width: "0.7",
                }}
              >
                <Typography variant="body2" component="p">
                  {displayPostData.content.replace(/\n<a href=.*/,"")}
                </Typography>
              </CardContent>
            </Box>
            {displayPostData.postImage.length > 0 && (
              <CardMedia
                component="img"
                sx={{
                  p: 1,
                  m: "auto",
                  width: {
                    xs: 100,
                    sm: 150,
                    md: 200,
                    lg: 200},
                }}
                image={displayPostData.postImage[0]}
                alt="画像"
              />
            )}
          </>
        ) : (
          <>
            <Typography
              variant="subtitle2"
              component="p"
              textAlign="center"
              sx={{ p: 1, mt: 3, mb: 3, mx: "auto", fontSize: {xs: "12px"} }}
            >
              該当するタイムラインがありません
            </Typography>
          </>
        )}
      </Card>
      {postData.length > 0 && displayPostData ? (
        <>
        <Link
        to={"/home/timeline"}
        state={{ itemId: props.itemId }}
        style={{ margin: "10px",  textDecoration: "underline", display: "block", textAlign: "end", fontSize: "14px"
        }}
      >
        タイムラインへ移動
      </Link>
        </>
      ) : (
        <>
        <Link
        to={"/home/timeline"}
        style={{ margin: "10px",  textDecoration: "underline", display: "block", textAlign: "end", fontSize: "14px"
        }}
      >
        タイムラインへ移動
      </Link>
        </>
      )}
      
    </>
  );
});

export default TimelineCorner;
