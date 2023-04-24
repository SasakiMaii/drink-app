import { FC, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HistorySharpIcon from '@mui/icons-material/HistorySharp';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  Avatar,
  Paper,
  Stack,
  Input,
  TextField,
  Hidden,
} from '@mui/material';
import { red } from '@mui/material/colors';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import DefaultLayout from '../layout/DefaultLayout';
import { PrimaryButton } from '../atoms/button/Button';
import { Title } from '@mui/icons-material';

import { useRecoilState } from 'recoil';
import { useRecoilValue } from 'recoil';

import { useLoginUser } from '../../hooks/useLoginUser';
import useGetAnItem from '../../hooks/useGetAnItem';
import AdmTitleText from '../atoms/text/AdmTitleText';

type Props = {};

const AdminHome: FC<Props> = memo((props) => {
  const { loginUserInfo } = useLoginUser({ id: 3 });
  console.log(loginUserInfo);
  return (
    <>
      {loginUserInfo.isAdmin ? <p>管理者ユーザです</p> : <p>一般ユーザです</p>}
      <DefaultLayout>
        <Paper
          sx={{
            width: '100%',
            minWidth: 500,
            maxWidth: 1200,
            minHeight: 600,
            padding: '50px',
          }}
        >
          {/* <Typography
            sx={{
              fontFamily: 'Georgia',
              fontSize: '50px',
              color: '#024098',
              mt: '50px',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            -管理者MENU-
          </Typography> */}
          <AdmTitleText>管理者MENU</AdmTitleText>
          {/* {loginUserInfo.isAdmin ? <p>管理者です</p> : <p>一般ユーザです</p>} */}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={8}
            flexWrap="wrap"
            marginTop="110px"
          >
            <Link to="/adminhome/consumption">
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  backgroundColor: '#024098',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px solid',
                  backgroundImage:
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)', // ここで別の色を指定してください
                  '&:hover': {
                    opacity: 0.8,
                    cursor: 'pointer',
                  },
                }}
              >
                <AddBoxIcon
                  sx={{
                    width: '130px',
                    height: '130px',
                    color: 'white',
                    paddingTop: '10px',
                  }}
                />
                <Typography
                  fontFamily="Source Han Sans"
                  sx={{ color: 'black', fontSize: '20px', marginTop: '10px' }}
                >
                  補充在庫入力
                </Typography>
              </Box>
            </Link>
            <Link to="/adminhome/addition">
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  backgroundColor: '#024098',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px solid',
                  backgroundImage:
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)', // ここで別の色を指定してください
                  '&:hover': {
                    opacity: 0.8,
                    cursor: 'pointer',
                  },
                }}
              >
                <IndeterminateCheckBoxIcon
                  sx={{
                    width: '130px',
                    height: '130px',
                    color: 'white',
                    paddingTop: '10px',
                  }}
                />
                <Typography
                  fontFamily="Source Han Sans"
                  sx={{ color: 'black', fontSize: '20px', marginTop: '10px' }}
                >
                  消費在庫入力
                </Typography>
              </Box>
            </Link>
            <Link to="/adminhome/history">
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  backgroundColor: '#024098',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px solid',
                  backgroundImage:
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)', // ここで別の色を指定してください
                  '&:hover': {
                    opacity: 0.8,
                    cursor: 'pointer',
                  },
                }}
              >
                <ManageSearchIcon
                  sx={{
                    width: '130px',
                    height: '130px',
                    color: 'white',
                    paddingTop: '10px',
                  }}
                />
                <Typography
                  fontFamily="Source Han Sans"
                  sx={{ color: 'black', fontSize: '20px', marginTop: '10px' }}
                >
                  在庫履歴
                </Typography>
              </Box>
            </Link>
            <Link to="/adminhome/addpoll">
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  backgroundColor: '#024098',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px solid',
                  backgroundImage:
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)', // ここで別の色を指定してください
                  '&:hover': {
                    opacity: 0.8,
                    cursor: 'pointer',
                  },
                }}
              >
                <AssignmentIcon
                  sx={{
                    width: '130px',
                    height: '130px',
                    color: 'white',
                    paddingTop: '10px',
                  }}
                />
                <Typography
                  fontFamily="Source Han Sans"
                  sx={{ color: 'black', fontSize: '20px', marginTop: '10px' }}
                >
                  補充在庫入力
                </Typography>
              </Box>
            </Link>
          </Stack>
        </Paper>
      </DefaultLayout>
    </>
  );
});

export default AdminHome;
