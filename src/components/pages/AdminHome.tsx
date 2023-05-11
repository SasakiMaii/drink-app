import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Stack } from '@mui/material';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import DefaultLayout from '../layout/DefaultLayout';

import AdmTitleText from '../atoms/text/AdmTitleText';

type Props = {};

const AdminHome: FC<Props> = memo((props) => {
  return (
    <>
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
          <AdmTitleText>管理者MENU</AdmTitleText>
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
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)',
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
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)',
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
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)',
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
                    'linear-gradient(to bottom, #024098 70%, #fff 30%)',
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
                  アンケート追加
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
